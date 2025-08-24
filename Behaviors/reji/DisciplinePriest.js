import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import { defaultHealTargeting as heal } from "@/Targeting/HealTargeting";



export class RejiDisciplinePriestBehavior extends Behavior {
  name = "Reji Discipline";
  context = BehaviorContext.Any;
  specialization = Specialization.Priest.Discipline;

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

  lowPriorityHeals() {
    return new bt.Selector(
    
    );
  }

  cooldowns() {
    return new bt.Selector(
      // Offensive cooldowns will go here
    );
  }
}
