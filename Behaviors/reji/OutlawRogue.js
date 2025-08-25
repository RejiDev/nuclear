import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { bestTarget, defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import { PowerType } from "@/Enums/PowerType";
import { defaultHealTargeting as heal } from "@/Targeting/HealTargeting";


export class RejiOutlawRogueBehavior extends Behavior {
  name = "Outlaw - Rogue";
  context = BehaviorContext.Any;
  specialization = Specialization.Rogue.Combat;

  build() {
    return new bt.Selector(
      new bt.Decorator(
        ret => !spell.isGlobalCooldown(),
        new bt.Selector(
          common.waitForNotMounted(),
          common.waitForNotSitting(),
          common.waitForCastOrChannel(),
          common.waitForTarget(),
          common.waitForFacing(),
          common.ensureAutoAttack(),
          this.interrupt(),
          this.defensives(),
          this.cooldowns(),
          this.spenders(),
          this.builders(),
        )
      )
    );  
  }

  interrupt() {
    return new bt.Sequence(
      spell.interrupt("Kick"),
    );
  }

  defensives() {
    return new bt.Selector(
      spell.cast("Evasion", on => me, req => {
        return me.effect.healthPercent <= 80 && combat.targets.find(enemy => enemy.targetGuid === me.guid);
      }),
    );
  }

  spenders() {
    return new bt.Selector(
      spell.cast("Killing Spree", on => this.getCurrentTarget(), req => this.useKillingSpree()),
      spell.cast("Coup de Grace", on => this.getCurrentTarget(), req => this.useCoupDeGrace()),
      spell.cast("Between the Eyes", on => this.getCurrentTarget(), req => this.useBetweenTheEyes()),
      spell.cast("Dispatch", on => this.getCurrentTarget(), req => this.useDispatch()),
    );
  }

  builders() {
    return new bt.Selector(
      spell.cast("Pistol Shot", on => this.getCurrentTarget(), req => this.usePistolShot()),
      spell.cast("Sinister Strike", on => this.getCurrentTarget(), req => this.getComboPoints() <= 5),
    );
  }

  cooldowns() {
    return new bt.Selector(
        spell.cast("Tricks of the Trade", on => heal.friends.Tanks[0], req => !heal.friends.Tanks[0].hasAuraByMe("Tricks of the Trade")),
        spell.cast("Keep it rolling", on => me, req => this.getRollTheBonesBuffCount() >= 4),
        spell.cast("Roll the Bones", on => this.useRollTheBones()),
        spell.cast("Adrenaline Rush", on => me, req => this.getComboPoints() <= 2),
        spell.cast("Blade Flurry", on => this.getCurrentTarget(), req => this.useBladeFlurry()),
        spell.cast("Ghostly Strike", on => this.getCurrentTarget()),
        spell.cast("Vanish", on => this.useVanish()),
    );
  }

  // Functions
  getAuraRemainingTime(auraName) {
    const aura = me.getAura(auraName);
    return aura ? aura.remaining / 1000 : 0;
  }

  getAuraStacks(auraName) {
    const aura = me.getAura(auraName);
    return aura ? aura.stacks : 0;
  }

  getCurrentTarget() {
    return me.targetUnit || combat.bestTarget;
  }

  getComboPoints() {
    return me.powerByType(PowerType.ComboPoints);
  }

  getRollTheBonesBuffCount() {
    const rollTheBonesBuffs = [
      "Broadside",
      "Buried Treasure",
      "Grand Melee",
      "Ruthless Precision",
      "Skull and Crossbones",
      "True Bearing"
    ];
    return rollTheBonesBuffs.filter(buff => me.hasAura(buff)).length;
  }


  // Cooldowns
  useRollTheBones() {
    return (
      this.getRollTheBonesBuffCount() === 0 ||
      (me.hasAura("Loaded Dice") && this.getRollTheBonesBuffCount() <= 2) ||
      spell.getTimeSinceLastCast("Keep it Rolling") < 5
    );
  }

  useBladeFlurry() {
    const unitsInRange = combat.getUnitsAroundUnit(me, 10).length;
    const comboPoints = this.getComboPoints();
    if (!me.hasAura("Blade Flurry")) {
      return unitsInRange >= 2;
    } else {
      return unitsInRange >= 4 && comboPoints <= 4;
    }
  }


  // Spenders
  useKillingSpree() {
    if (me.hasVisibleAura("Subterfuge")) {
      return false;
    }

    const adrenalineRushAura = me.getAura("Adrenaline Rush");
    if (
      me.hasAura("Vanish") &&
      adrenalineRushAura &&
      adrenalineRushAura.remaining <= 5000
    ) {
      return false;
    }

    return this.getComboPoints() >= 6;
  }

  useCoupDeGrace() {
    return this.getComboPoints() >= 5 && !me.hasVisibleAura("Subterfuge") && spell.getCooldown("Coup de Grace").ready;
  }

  useVanish() {
    const comboPoints = this.getComboPoints();
    const adrenalineRushAura = me.getAura("Adrenaline Rush");
    const vanishCooldown = spell.getCooldown("Vanish");
    const killingSpreeCooldown = spell.getCooldown("Killing Spree");
    const coupDeGraceRecentlyUsed = spell.getTimeSinceLastCast("Coup de Grace") < 5;

    if (
      comboPoints >= 6 &&
      adrenalineRushAura &&
      (
        adrenalineRushAura.remaining < 3000 && spell.getCooldown("Adrenaline Rush").timeleft > 10000 ||
        (vanishCooldown.duration - vanishCooldown.timeleft < 15000) ||
        (killingSpreeCooldown.duration > 0 && killingSpreeCooldown.timeleft <= 20 && coupDeGraceRecentlyUsed)
      )
    ) {
      return true;
    }
    return false;
  }

  useBetweenTheEyes() {
    const comboPoints = this.getComboPoints();
    if (me.hasAura("Subterfuge")) {
      return comboPoints >= 5;
    }
    return comboPoints >= 6;
  }

  useDispatch() {
    return this.getComboPoints() >= 6;
  }
  

  // Builders

  usePistolShot() {
    const comboPoints = this.getComboPoints();
    const opportunityStacks = this.getAuraStacks("Opportunity");

    if (!me.hasAura("Opportunity")) {
      return false;
    }

    if (me.hasAura("Broadside")) {
      if (opportunityStacks >= 6) {
        return comboPoints <= 4;
      }
      return comboPoints <= 2;
    } else {
      return comboPoints <= 4;
    }
  }
}
