import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import { defaultHealTargeting as heal } from "@/Targeting/HealTargeting";

export class RejiRetributionPaladinBehavior extends Behavior {
  name = "Reji Retribution";
  context = BehaviorContext.Any;
  specialization = Specialization.Paladin.Retribution;

  build() {
    return new bt.Decorator(
      ret => !spell.isGlobalCooldown(),
      new bt.Selector(
        // Basic checks
        common.waitForNotMounted(),
        common.waitForNotSitting(),
        this.emergencyHealing(),
        common.waitForCastOrChannel(),
        common.waitForTarget(),
        common.waitForFacing(),
        this.defensives(),
        this.interrupt(),
        this.cooldowns(),
        spell.castOneButtonRotation()
      )
    );
  }

  interrupt() {
    return new bt.Sequence(
      // Interrupt logic will go here
      spell.interrupt("Rebuke")
    );
  }

  defensives() {
    return new bt.Selector(
      spell.cast("Divine Shield", req => this.shouldUseDivineShield()),
      spell.cast("Divine Protection", req => this.shouldUseDivineProtection()),
      spell.cast("Blessing of Freedom", on => this.shouldUseBlessingOfFreedom()),
    );
  }

  emergencyHealing() {
    return new bt.Selector(
      spell.cast("Blessing of Protection", on => this.findBlessingOfProtectionTarget()),
      spell.cast("Lay on Hands", on => this.findLayOnHandsTarget()),
    );
  }

  cooldowns() {
    return new bt.Selector(
      spell.cast("Avenging Wrath"),
    );
  }

  findLayOnHandsTarget() {
    return heal.friends.All.find(unit => unit.pctHealth < 20);
  }

  findFlashOfLightTarget() {
    return heal.friends.All.find(unit => unit.pctHealth < 70);
  }

  shouldUseDivineShield() {
    return me.pctHealth < 50 && combat.targets.find(unit => unit.isTanking());
  }

  shouldUseDivineProtection() {
    return me.pctHealth < 90 && combat.targets.find(unit => unit.isTanking());
  }

  shouldUseBlessingOfFreedom() {
    if (heal.friends.All.find(unit => unit.isRooted() || unit.isSlowed())) {
      const DetectedTime = wow.frameTime;
      if (this.lastDetectedTime === undefined) {
        this.lastDetectedTime = DetectedTime;
        return true;
      }
      if (DetectedTime - this.lastDetectedTime > 1000) {
        this.lastDetectedTime = DetectedTime;
        return true;
      }
    }
    return false;
  }

  findBlessingOfProtectionTarget() {
    return heal.friends.All.find(unit =>
      unit.pctHealth < 50 &&
      unit.guid !== me.guid &&
      combat.targets.find(enemy =>
        enemy.targetUnit &&
        enemy.targetUnit.guid === unit.guid &&
        enemy.isWithinMeleeRange(unit)
      )
    );
  }
}
