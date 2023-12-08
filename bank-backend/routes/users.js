const express = require("express");
const user_account = require("../models/user");
const bodyParser = require("body-parser");
const router = express.Router();

// login 
router.post("/login",bodyParser.urlencoded(), async(req,res) => {
    //if we use username for login that would make my life easier
    const { email, password }  = req.body;
    console.log("form submitted:", {email, password});

    const email_response = await user_account.findOne({user_email: email})

    if(!email_response){
        return res.status(400).json({error: "email"})
    }

    if (password != email_response.user_password){
        return res.status(400).json({error: "password"})
    } else {
        req.session.user_ID = email_response._id;
        return res.status(200).json(email_response)
    }
})

// signup 
router.post("/signup", bodyParser.urlencoded(), async(req,res) => {
    //these fields WIP
    const { SSN, firstname, lastname, username, email, password, dob } = req.body
    console.log("form submitted:", { SSN, firstname, lastname, username, email, password, dob })

    //username duplicate check 
    const username_response = await user_account.findOne({user_name: username})
    if(username_response) {
        return res.status(400).json(username_response)
    }

    //email duplicate check
    const email_response = await user_account.findOne({user_email: email})
    if(email_response) {
        return res.status(400).json({error: "email"})
    } 

    const ssn_response = await user_account.findOne({user_SSN: SSN})
    if(ssn_response){
        return res.status(400).json({error: "ssn"})
    }

    //register the user info
    try{
        const new_user = await user_account.create({user_SSN: SSN, user_email: email, first_name: firstname, last_name: lastname, user_DOB: dob, user_password: password, balance: 0})
        return res.status(200).json(new_user)
    }catch (error){
        return res.status(400).json({error: "idk something went wrong"})
    }
})

module.exports = router;