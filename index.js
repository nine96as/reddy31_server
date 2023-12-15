require("dotenv").config();
const mongoose = require('mongoose')

const app = require("./app");

mongoose.connect(process.env.DB_URL)
  .then(()=>{
    app.listen(process.env.PORT, () => {
      console.log(`API listening on ${process.env.PORT}`);
    })
  })
  .catch((error)=>{
    console.log(error)
  })

