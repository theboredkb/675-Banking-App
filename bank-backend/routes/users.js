const express = require("express");
const user_account = require("../models/user");
const bodyParser = require("body-parser");
const router = express.Router();

router.get("/userinfo",async(req,res) => {
    const uid = req.session.user_ID;
    const uid_response = await user_account.findOne({_id: uid});
    console.log(uid_response)
    return res.status(200).json(uid_response);
})

// login 
router.post("/login",bodyParser.urlencoded(), async(req,res) => {
    const { email, password }  = req.body;
    console.log("form submitted:", {email, password});

    const email_response = await user_account.findOne({user_email: email})

    if(!email_response){
        res.redirect(400,"/login")
    }

    if (password != email_response.user_password){
        res.redirect(400,"/login")
    } else {
        req.session.user_ID = email_response._id;
        res.redirect(200,"/home")
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
        const new_user = await user_account.create({user_SSN: SSN, user_username: username, user_email: email, first_name: firstname, last_name: lastname, user_DOB: dob, user_password: password, balance: 0})
        res.status(200).json(new_user)
    }catch (error){
        return res.status(400).json({error: "idk something went wrong"})
    }
})

//update user
router.put("/edit/:id",bodyParser.urlencoded(), async(req,res) => {
    const { id } = req.params
    const edit_user = await user_account.findOneAndUpdate({_id:id}, {...req.body})

    if(!edit_user){
        return res.status(404)
    }

    res.status(200).json(edit_user)
})

//delete user
router.delete("/delete/:id",bodyParser.urlencoded(), async(req,res) => {
    const { id } = req.params
    const deleted_user = await user_account.findOneAndDelete({_id:id})

    if(!deleted_user_user){
        return res.status(404)
    }

    res.status(200).json(deleted_user)
})

router.post("/logout", async(req,res) => {
    try {
        await req.session.destroy()
    } catch (err) {
        return res.status(400).json({error: error.message})
    }
})

module.exports = router;