const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrementModelID = require("./counterModel");

const Game2F = new Schema({
  id: { type: String, unique: true, min: 1 },
  gameFDate: { type: Date },
  player1: { type: Schema.Types.ObjectId, ref: "members" },
  player2: { type: Schema.Types.ObjectId, ref: "members" },
  game: { type: Schema.Types.ObjectId, ref: "game2" },
  status:{ type: String},
  reporter:{ type: Schema.Types.ObjectId, ref: "members" },
  gameAmount:{ type: Number},
  winningAmount:{type:Number},
  roomCode:{type:Number},
  image:{type:String},
});

Game2F.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID("game2F", this, next);
});

module.exports = mongoose.model("game2F", Game2F);
