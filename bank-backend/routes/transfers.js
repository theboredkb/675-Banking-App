const express = require("express");
const transaction_data = require("../models/transfer.js");
const bodyParser = require("body-parser");
const router = express.Router();

router.post("/new", bodyParser.urlencoded(), async(req,res) => {
    const { type, amount, cust_id  } = req.body
    const new_transaction =  await transaction_data.insertOne({trasnaction_type: type, transaction_amount: amount, customer_id: cust_id})
    return res.status(200).json(new_transaction)
})