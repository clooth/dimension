var Dimension;
(function (Dimension) {
    (function (Stat) {
        Stat[Stat["NONE"] = 0] = "NONE";
        Stat[Stat["ATTACK"] = 1] = "ATTACK";
        Stat[Stat["HEALTH"] = 2] = "HEALTH";
        Stat[Stat["MANA"] = 3] = "MANA";
        Stat[Stat["TAUNT"] = 4] = "TAUNT";
        Stat[Stat["CHARGE"] = 5] = "CHARGE";
        Stat[Stat["WINDFURY"] = 6] = "WINDFURY";
        Stat[Stat["DIVINE_SHIELD"] = 7] = "DIVINE_SHIELD";
        Stat[Stat["COST"] = 8] = "COST";
        Stat[Stat["SPELL_POWER"] = 9] = "SPELL_POWER";
    })(Dimension.Stat || (Dimension.Stat = {}));
    var Stat = Dimension.Stat;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Stat.js.map
