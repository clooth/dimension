var Dimension;
(function (Dimension) {
    (function (CardType) {
        CardType[CardType["MINION"] = 0] = "MINION";
        CardType[CardType["SPELL"] = 1] = "SPELL";
        CardType[CardType["WEAPON"] = 2] = "WEAPON";
        CardType[CardType["ABILITY"] = 3] = "ABILITY";
    })(Dimension.CardType || (Dimension.CardType = {}));
    var CardType = Dimension.CardType;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=CardType.js.map
