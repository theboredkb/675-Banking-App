const express = require('express')
const mongoose = require("mongoose");
const userRoute = require("./routes/users.js");
const transferRoute = require("./routes/trasnfers.js");
const trasnactionRoute = require("./routes/transactions.js");
const app = express()
//const mysql = require('mysql2/promise')

// Start server
const PORT = process.env.PORT || 3000

app.use("/user",userRoute)
app.use("/transfer",transferRoute)
app.use("/transactions",trasnactionRoute)

mongoose.connect(process.env.mongo_url)
  .then(() =>{
    // start the Express server
    app.listen(PORT, () => {
      console.log(`Server connected to mongo and is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
});
