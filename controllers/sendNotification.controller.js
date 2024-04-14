const express = require("express");
const router = express.Router();
const subscriptionService = require("../service/sendNotification.service");


router.post("/", send);





function send(req, res, next) {
  console.log(req.body)
  subscriptionService
    .send(req,res)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}


module.exports = router;
