const express = require("express");
const user_account = require("../models/user");
const bodyParser = require("body-parser");
const router = express.Router();

// /auth/login WIP cuz idk what to put
router.post("/login", bodyParser.urlencoded(), async(req,res) => {
    //if we use username for login that would make my life easier
    const { email, password }  = req.body;
    console.log("form submitted:", {email, password});

    const email_response = await user.findOne({user_email: email})

    if(!email_response){
        res.redirect("/login")
    }

    //probably couldve used an aggregate/join here idk
    const account_response = await user_account.findOne({_id: email_response.user_accountID})

    if(!account_response){
        res.redirect("/login")
    } else if (password != account_response.user_password){
        res.redirect("/login")
    } else {
        res.redirect("/")
    }
})

// /auth/signup is just whatever until we figure out something else
router.post("/signup", bodyParser.urlencoded(), async(req,res) => {
    //these fields WIP
    const { SSN, firstname, lastname, username, email, password, dob } = req.body
    console.log("form submitted:", { SSN, firstname, lastname, username, email, password, dob })

    //username duplicate check 
    const username_response = await user_account.findOne({user_name: username})
    if(username_response) {
        res.redirect("/signup")
    }

    //email duplicate check
    const email_response = await user.findOne({user_email: email})
    if(email_response) {
        res.redirect("/signup")
    } 

    const ssn_response = await user.findOne({user_SSN: SSN})
    if(ssn_response){
        res.redirect("/signup")
    }

    //register the user info
    try{
        const new_user = await user.insertOne({user_SSN: SSN, user_email: email, first_name: firstname, last_name: lastname, user_DOB: dob})
        res.redirect("/login")
    }catch (error){
        res.redirect("/signup")
    }
})

module.exports = router;