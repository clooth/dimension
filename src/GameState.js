var Dimension;
(function (Dimension) {
    (function (GameState) {
        GameState[GameState["CAST_SPELL"] = 0] = "CAST_SPELL";
        GameState[GameState["ATTACK"] = 1] = "ATTACK";
        GameState[GameState["TARGET"] = 2] = "TARGET";
        GameState[GameState["SUMMON"] = 3] = "SUMMON";
        GameState[GameState["CHOOSE_ONE"] = 4] = "CHOOSE_ONE";
        GameState[GameState["MULLIGAN"] = 5] = "MULLIGAN";
    })(Dimension.GameState || (Dimension.GameState = {}));
    var GameState = Dimension.GameState;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=GameState.js.map
