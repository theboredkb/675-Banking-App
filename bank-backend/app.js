const express = require('express')
const mongoose = require("mongoose");
const app = express()
//const mysql = require('mysql2/promise')

//0 = mongo, 1 = sql
useSQL = 1;

// Start server
const PORT = process.env.PORT || 3000

if(useSQL){
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
} else {
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
}