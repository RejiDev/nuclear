import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import { defaultHealTargeting as heal } from "@/Targeting/HealTargeting";
import KeyBinding from "@/Core/KeyBinding";
import colors from "@/Enums/Colors";

export class RejiDemonologyWarlockBehavior extends Behavior {
  name = "Reji Demonology";
  context = BehaviorContext.Any;
  specialization = Specialization.Warlock.Demonology;

  build() {
    return new bt.Selector(

      new bt.Decorator(
        ret => !spell.isGlobalCooldown(),
        new bt.Selector(
          // Basic checks
          common.waitForNotMounted(),
          common.waitForNotSitting(),
          common.waitForCastOrChannel(),
          common.waitForTarget(),
          common.waitForFacing(),
          this.dots(),
          spell.castOneButtonRotation()
        )
      )
    );
  }

  interrupt() {
    return new bt.Sequence(
      // Interrupt logic will go here
    );
  }

  defensives() {
    return new bt.Selector(
      // Defensive spells will go here
    );
  }

  dots() {
    return new bt.Selector(
      spell.cast("Corruption", on => this.useCorruption()),
      spell.cast("Agony", on => this.useAgony()),
    );
  }

  cooldowns() {
    return new bt.Selector(
      // Offensive cooldowns will go here
    );
  }

  dotKeybind() {
    this.dotKeybindEnabled = !this.dotKeybindEnabled;
    console.info(`Dots ${this.dotKeybindEnabled ? 'enabled' : 'disabled'}`);
    return this.dotKeybindEnabled;
  }

  useCorruption() {
    return combat.targets.find(unit => !unit.hasAuraByMe("Corruption") && me.isMoving);
  }

  useAgony() {
    return combat.targets.find(unit => !unit.hasAuraByMe("Agony") && me.isMoving);
  }
}
