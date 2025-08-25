import { Behavior, BehaviorContext } from "@/Core/Behavior";
import * as bt from '@/Core/BehaviorTree';
import Specialization from '@/Enums/Specialization';
import common from '@/Core/Common';
import spell from "@/Core/Spell";
import { me } from "@/Core/ObjectManager";
import { DispelPriority } from "@/Data/Dispels";
import { WoWDispelType } from "@/Enums/Auras";
import { defaultHealTargeting as heal } from "@/Targeting/HealTargeting";
import { defaultCombatTargeting as combat } from "@/Targeting/CombatTargeting";
import Settings from "@/Core/Settings";

export class RejiDisciplinePriestBehavior extends Behavior {
  name = "Priest - Discipline";
  context = BehaviorContext.Any;
  specialization = Specialization.Priest.Discipline;
  static settings = [
    {
      header: "Emergency Healing",
      options: [
      ]
    },
    {
      header: "Defensives",
      options: [
        { type: "slider", uid: "DisciplinePriestDesperatePrayerPercent", text: "Desperate Prayer Percent", min: 0, max: 100, default: 40 },
      ]
    },
    {
      header: "General",
      options: [
      ]
    },
    {
      header: "Single Target Healing",
      options: [
        { type: "slider", uid: "DisciplinePriestFlashHealPercent", text: "Flash Heal Percent", min: 0, max: 100, default: 40 },
        { type: "slider", uid: "DisciplinePriestRenewPercent", text: "Renew Percent", min: 0, max: 100, default: 90 },
        { type: "slider", uid: "DisciplinePriestPenancePercent", text: "Penance Percent", min: 0, max: 100, default: 50 },
      ]
    },
  ];

  build() {
    return new bt.Selector(

      new bt.Decorator(
        ret => !spell.isGlobalCooldown(),
        new bt.Selector(
          // Basic checks
          common.waitForNotMounted(),
          common.waitForNotSitting(),
          common.waitForCastOrChannel(),
          this.defensives(),
          this.highPriorityHeals(),
          this.mediumPriorityHeals(),
          this.lowPriorityHeals(),
          this.cooldowns(),
          common.waitForTarget(),
          common.waitForFacing(),
          spell.castOneButtonRotation()
        )
      )
    );  
  }

  dispel() {
    return new bt.Selector(
      spell.dispel("Purify", true, DispelPriority.Low, true, WoWDispelType.Magic, WoWDispelType.Disease)
    );
  }

  interrupt() {
    return new bt.Sequence(
      // Interrupt logic will go here
    );
  }

  defensives() {
    return new bt.Selector(
      spell.cast("Desperate Prayer", on => me, req => this.useDesperatePrayer()),
      spell.cast("Fade", on => me, req => me.inCombat() && me.pctHealth < 90 && me.isTanking()),
    );
  }

  lowPriorityHeals() {
    return new bt.Selector(
      spell.cast("Renew", on => this.findRenewTarget())
    );
  }

  mediumPriorityHeals() {
    return new bt.Selector(
      spell.cast("Flash Heal", on => this.findFlashHealTarget())
    );
  }

  highPriorityHeals() {
    return new bt.Selector(
      spell.cast("Power Word: Shield", on => this.findPowerWordShieldTarget()),
      spell.cast("Penance", on => this.findPenanceTarget()),
    );
  }

  cooldowns() {
    return new bt.Selector(
      spell.cast("Power Word: Fortitude", on => me, req => !me.hasAura("Power Word: Fortitude")),
    );
  }

  useDesperatePrayer() {
    return me.pctHealth < Settings.DisciplinePriestDesperatePrayerPercent;
  }

  findPenanceTarget() {
    return heal.priorityList.find(unit => unit.pctHealth < Settings.DisciplinePriestPenancePercent);
  }

  findPowerWordShieldTarget() {
    // Only return the tank if they need a shield, otherwise return null (no target)
    const tank = heal.friends.Tanks[0];
    if (tank && !tank.hasAura("Power Word: Shield")) {
      return tank;
    }
    return null;
  }

  findRenewTarget() {
    const renewThreshold = Settings.DisciplinePriestRenewPercent;

    return heal.priorityList.find(unit => unit.pctHealth < renewThreshold && !unit.hasAura("Renew"));
  }

  findFlashHealTarget() {
    const flashHealThreshold = Settings.DisciplinePriestFlashHealPercent;

    return heal.priorityList.find(unit => unit.pctHealth < flashHealThreshold);
  }

}
