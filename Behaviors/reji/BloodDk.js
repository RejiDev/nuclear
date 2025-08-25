import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import { PowerType } from "@/Enums/PowerType";




export class RejiBloodDkBehavior extends Behavior {
  name = "Reji Blood DK";
  context = BehaviorContext.Any;
  specialization = Specialization.DeathKnight.Blood;

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
          this.interrupt(),
          this.defensives(),
          this.cooldowns(),
          this.rotation(),
        )
      )
    );  
  }

  interrupt() {
    return new bt.Sequence(
      spell.interrupt("Mind Freeze"),
    );
  }

  defensives() {
    return new bt.Selector(
        spell.cast("Vampiric Blood", on => me, req => this.useVampiricBlood()),
        spell.cast("Icebound Fortitude", on => me, req => this.useIceboundFortitude()),
        spell.cast("Anti-Magic Shell", on => me, req => this.useAntiMagicShell()),
    );
  }

  rotation() {
    return new bt.Selector(
        common.ensureAutoAttack(),
        spell.cast("Dark Command", on => this.useDarkCommand()),
        spell.cast("Marrowrend", on => combat.bestTarget, req => this.useMarrowrend()),
        spell.cast("Death and Decay", on => combat.bestTarget, req => this.useDeathAndDecay()),
        spell.cast("Death Strike", on => combat.bestTarget, req => this.useDeathStrike()),
        spell.cast("Blood Boil", on => combat.bestTarget, req => this.useBloodBoil()),
        spell.cast("Heart Strike", on => combat.bestTarget, req => this.useHeartStrike()),
    );
  }

  cooldowns() {
    return new bt.Selector(
        spell.cast("Dancing Rune Weapon", on => me, req => this.useDancingRuneWeapon()),
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


  // Defensives
  useIceboundFortitude() {
    return me.pctHealth < 30;
  }
  
  useVampiricBlood() {
    return me.pctHealth < 60;
  }

  useAntiMagicShell() {
    return combat.targets.some(unit =>
        unit.isCastingOrChanneling &&
        unit.spellInfo?.spellTargetGuid?.equals(me.guid) &&
        unit.spellInfo &&
        (unit.spellInfo.castEnd - wow.frameTime) > 100 &&
        (unit.spellInfo.castEnd - wow.frameTime) < 200
      );
  }


  // Cooldowns
  useDancingRuneWeapon() {
    return !me.hasAura("Dancing Rune Weapon");
  }


  // Rotation
  useHeartStrike() {
    return me.powerByType(PowerType.Runes) >= 3;
  }
  
  useMarrowrend() {
    return this.getAuraStacks("Bone Shield") < 6 || this.getAuraRemainingTime("Bone Shield") < 10;
  }

  useDarkCommand() {
    return combat.targets.find(unit => unit.inCombat() && unit.target && !unit.isTanking());
  }

  useDeathStrike() {
    return me.powerByType(PowerType.RunicPower) >= 75;
  }

  useDeathAndDecay() {
    return !me.isMoving() && !me.hasAura("Death and Decay");
  }

  useBloodBoil() {
    return combat.getUnitsAroundUnit(me, 7).find(unit => !unit.hasAura("Blood Plague"));
  }
}
