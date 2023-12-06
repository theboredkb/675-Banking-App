const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transaction_schema = new Schema({
    //transaction id = mongo generated _id
    //transaction date + time = mongo generated date + time
    sender_uid: {
        type: String,
        require: true
    },
    reciever_uid: {
        type: String,
        require:true
    },
    transaction_type: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model("transaction_data", transaction_schema);
