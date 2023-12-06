const express = require("express");
const user = require("../mongo_modes/user_mongo.js");
const user_account = require("../mongo_models/user_account_mongo.js");
const transaction_data = require("../mongo_models/transactions_mongo.js");
const bodyParser = require("body-parser");
const router = express.Router();

//new transaction
router.post("/new", bodyParser.urlencoded(), async(req,res) => {
    

})