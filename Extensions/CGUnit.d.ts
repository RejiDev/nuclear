declare namespace wow {
  interface CGUnit {
    // Extended properties that don't conflict with base CGUnit
    targetUnit?: CGUnit;
    predictedHealthPercent: number;
    effectiveHealthPercent: number;
    timeToDeath(): number | undefined;
    isPlayer(): boolean;
    hasAura(identifier: string | number): boolean;
    hasAuraByMe(identifier: string | number): boolean;
    hasVisibleAura(identifier: string | number): boolean;
    hasVisibleAuraByMe(identifier: string | number): boolean;
    getAura(identifier: string | number): AuraData | undefined;
    getAuraByMe(identifier: string | number): AuraData | undefined;
    getAuraStacks(identifier: string | number): number;
    getUnitsAround(distance: number): Array<CGUnit>;
    getUnitsAroundCount(distance: number): number;
    isMoving(): boolean;
    inCombat(): boolean;
    inCombatWith(unit: CGUnit | Guid): boolean;
    inCombatWithMe: boolean;
    isSitting(): boolean;
    isSwimming(): boolean;
    isStunned(): boolean;
    isRooted(): boolean;
    isSilenced(): boolean;
    isFeared(): boolean;
    angleToXY(x1: number, y1: number, x2: number, y2: number): number;
    angleToPos(from: Vector3, to: Vector3): number;
    angleTo(target: CGUnit): number;
    isFacing(target: CGUnit, angle?: number): boolean;
    radToDeg(radians: number): number;
    inMyGroup(): boolean;
    isTanking(): boolean;
    withinLineOfSight(target: CGUnit): boolean;
    isImmune(): boolean;
    isHealImmune(): boolean;
    isWithinMeleeRange(target: CGUnit): boolean;
    isSlowed(): boolean;
    isHealer(): boolean;
    isDisarmableMelee(): boolean;
    canCC(): boolean;
    isCCd(): boolean;
    isCCdByCategory(category: string): boolean;
    getDR(category: string): number;
    getDRStacks(spellId: number): number;
    wouldBeDiminished(spellId: number): boolean;
    isImmuneToSpell(spellId: number): boolean;
    getDiminishedMultiplier(spellId: number): number;
    getActiveCCs(): object;

    // Getter properties for race and class
    klass: number;
    race: number;
    gender: number;

    // Current cast/channel properties
    currentCastOrChannel: SpellInfo | undefined;
    focusTarget: CGUnit | undefined;
  }
}
