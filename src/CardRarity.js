var Dimension;
(function (Dimension) {
    (function (CardRarity) {
        CardRarity[CardRarity["BASIC"] = 0] = "BASIC";
        CardRarity[CardRarity["COMMON"] = 1] = "COMMON";
        CardRarity[CardRarity["RARE"] = 2] = "RARE";
        CardRarity[CardRarity["EPIC"] = 3] = "EPIC";
        CardRarity[CardRarity["LEGENDARY"] = 4] = "LEGENDARY";
    })(Dimension.CardRarity || (Dimension.CardRarity = {}));
    var CardRarity = Dimension.CardRarity;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=CardRarity.js.map
