const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrementModelID = require("./counterModel");

const Subscription = new Schema({   
  id: { type: String, unique: true, min: 1 },
  subscription:{ type: String , required: true,},
  member:{ type: Schema.Types.ObjectId, ref: "members" },
});

Subscription.pre("save", function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID("subscriptions", this, next);
});

module.exports = mongoose.model("subscriptions", Subscription);
