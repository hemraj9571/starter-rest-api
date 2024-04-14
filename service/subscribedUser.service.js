const db = require("../_helpers/db");
const dbSubscription = db.subscription;

async function add(req, res) {
    const data = req.body
console.log("req.body",data)
  var result = await dbSubscription(req.body).save();

  //smsObj.SendOtp(req.body.mobile);
  return { data: result, responseCode: 1, responseMessage: "success" };
}
async function remove(req, res, next) {
  let _id = parseInt(req.params.id);

  var result = await dbSubscription
    .deleteOne({ id: _id })
    .then(function () {
      // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  return { data: result, responseCode: 1, responseMessage: "Deleted" };
}
async function read(req) {
  var result = await dbSubscription.findOne({ member: req.params.id });
  return { data: result };
}
async function readByState(req) {
  
  var result = await dbSubscription.find({ status: "activate" });
  return { data: result };
}
async function readAll(req) {
  var result = await dbSubscription.find();
  return { data: result };
}

module.exports = {
  add,
  read,
  readAll,
  remove,
  readByState
};
