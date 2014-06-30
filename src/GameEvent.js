var Dimension;
(function (Dimension) {
    (function (GameEvent) {
        GameEvent[GameEvent["ATTACK"] = 0] = "ATTACK";
        GameEvent[GameEvent["DAMAGE"] = 1] = "DAMAGE";
        GameEvent[GameEvent["DAMAGE_DEALT"] = 2] = "DAMAGE_DEALT";
        GameEvent[GameEvent["START_OF_TURN"] = 3] = "START_OF_TURN";
        GameEvent[GameEvent["END_OF_TURN"] = 4] = "END_OF_TURN";
        GameEvent[GameEvent["DEATH"] = 5] = "DEATH";
        GameEvent[GameEvent["CAST"] = 6] = "CAST";
        GameEvent[GameEvent["HEAL"] = 7] = "HEAL";
        GameEvent[GameEvent["DRAW"] = 8] = "DRAW";
        GameEvent[GameEvent["SECRET_REVEALED"] = 9] = "SECRET_REVEALED";
        GameEvent[GameEvent["SUMMON"] = 10] = "SUMMON";
    })(Dimension.GameEvent || (Dimension.GameEvent = {}));
    var GameEvent = Dimension.GameEvent;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=GameEvent.js.map
