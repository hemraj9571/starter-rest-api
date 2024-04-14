const moment = require("moment");
const db = require("../_helpers/db");
const dbPayment = db.payment;
const dbWallet = db.wallet;
const dbMember = db.members;
const smsObj = require("../_helpers/sms");
const axios = require('axios');
const qs = require('qs');
const cron = require('node-cron');

const task = async() => {
  paymentUpdateC();
};
const cronExpression = '*/1 * * * * *'; // Every 30 seconds
cron.schedule(cronExpression, task);

async function paymentUpdateC(req, res) {
  var result = await dbPayment.find({status:"requested"})

const results = await Promise.all(result.map(async (k, v) => {

const data1 = {
  user_token: "eb0c44f223f310f7a6bc94432b44d9e9",
   order_id: k.orderId,
}

  const url = 'https://payment.ludokingjaipur.com/api/check-order-status';

  const data = qs.stringify(data1);

  const config = {
    method: 'post',
    url: url,
    data : data
  };
  
  axios(config)
  .then(function (response) {

if(response.data.result.status==="PENDING"){
  var gameTime = k.transactionDate
  const updatedDate =new Date(gameTime.getTime() + 5 * 60000)
 if(updatedDate<new Date()){
  const data2 = {
    status:"failed"
  }
  dbPayment.updateOne(
    { _id:k._id},
    data2,
    function (err) {
      if (err) return next(err);
    }
  );
 }
}


  if(response.data.status === "ERROR"){
  console.log("hiiii",response.data)

    var gameTime = k.transactionDate
    const updatedDate =new Date(gameTime.getTime() + 5 * 60000)
   if(updatedDate<new Date()){
    const data2 = {
      status:"failed"
    }
    dbPayment.updateOne(
      { _id:k._id},
      data2,
      function (err) {
        if (err) return next(err);
      }
    );
   }
  }
  
    if(response.data.result.status==="SUCCESS"){
      const data2 = {
        status:"success"
      }
        dbPayment.updateOne(
          { _id:k._id},
          data2,
          function (err) {
            if (err) return next(err);
          }
        );
    member11(k);
    }






  })
  .catch(function (error) {
    // console.log(error);
  });
})
)

}


async function member11(req, res) {
  var result3 = await dbWallet.findOne({ member:req.member});
     const data3 = {
     depositeAmount :  result3.depositeAmount+req.amount
      }
      dbWallet.updateOne(
          { member:req.member},
          data3,
          function (err) {
            if (err) return next(err);
          }
        );
}

async function add(req, res) {
  var result = await dbPayment(req.body)
    .save()
  //smsObj.SendOtp(req.body.mobile);
  return { data: result, responseCode: 1, responseMessage: "success" };
}
async function update(req, res, next) {
  var result = await dbPayment.updateOne(
    { _id: req.params.id },
    req.body,
    function (err) {
      if (err) return next(err);
    }
  );
  return { data: result, responseCode: 1, responseMessage: "Updated" };
}

async function remove(req, res, next) {
  let _id = parseInt(req.params.id);

  var result = await dbPayment
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
  var result = await dbPayment
    .findOne({ member: req.params.id,status:"requested" });

  return { data: result };
}
async function readByUser(req) {
  var result = await dbPayment
    .find({ member: req.params.userid });
  return { data: result };
}
async function readAll(req) {
  var result = await dbPayment.find().populate(["member","upiId"]);
  return { data: result };
}


async function monthlyReport(req) {
  var fromDate = req.body.fromDate;
  var toDate = req.body.toDate;
  var rechargeSummery = '';

    if (fromDate === null || fromDate === undefined || toDate === null || toDate === undefined) {
      toDate = new Date();

      rechargeSummery = await dbPayment.aggregate([

        {
          $match: {
            status: "success" // Specify your condition here
          }
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ]);

    }
    else {
      rechargeSummery = await dbPayment.aggregate([
        {
          $match: {
            "transactionDate": {
              $gte: moment(req.body.fromDate).endOf("day").toDate(),
              $lte: moment(req.body.toDate).endOf("day").toDate()
            }
          }
        },
        {
          $match: {
            status: "success" // Specify your condition here
          }
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },

      ]);

    }
    return rechargeSummery;
}
async function monthlyReport2(req) {
  var rechargeRequest = '';

      rechargeRequest = await dbPayment.aggregate([
        
        {
          $match: {
            status: "requested" // Specify your condition here
          }
        },
        {
          $group: {
            _id: null,
              count: { $sum: 1 }
          }
      }

      ]);

    
    return rechargeRequest;
  }
async function reachargeReport(req, res) {
  var result = await monthlyReport(req, res);
  return { data: result };
}
async function reachargeReport2(req, res) {
  var result = await monthlyReport2(req, res);
  return { data: result };
}

module.exports = {
  add,
  update,
  read,
  readAll,
  readByUser,
  remove,
  reachargeReport,
  reachargeReport2,
};
