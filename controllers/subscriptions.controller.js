const express = require("express");
const router = express.Router();
const subscriptionService = require("../service/subscribedUser.service");

router.get("/:id", read);
router.get("/", readAll);
router.post("/active/", readByState);
router.post("/", add);

router.delete("/:id", remove);



function add(req, res, next) {
  console.log(req.body)
  subscriptionService
    .add(req,res)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function remove(req, res, next) {
  subscriptionService
    .remove(req,res,next)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function read(req, res, next) {
  subscriptionService
    .read(req)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}
function readAll(req, res, next) {
  subscriptionService
    .readAll(req)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}
function readByState(req, res, next) {
  subscriptionService
    .readByState(req)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

module.exports = router;
