const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user_info_schema = new Schema({
    user_ssn: {
        type: Number,
        require: true
    },
    user_email: {
        type: String,
        require: true
    },
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    user_DOB: {
        type: Date,
        require: true
    },
    user_accountID: {
        //store user account id here cuz no relations lol
        type: String,
        require: true
    }
});
module.exports = mongoose.model("user_info", user_info_schema);