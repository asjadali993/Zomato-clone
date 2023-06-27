const express = require("express");
const mongoose = require("mongoose");
const APIRoutes = require("./routes/APIRoutes");
const cors = require("cors");
const app = express();
const MONGODB_URI = "mongodb://127.0.0.1:27017/batch8thjan";
const PORT = 3001;

// post data disabled , to make it enabled
// body perse
app.use(cors()); // 3001 ===> 3000
// enable all incoming json
app.use(express.json());

// allow raw post data to convert to a js  object
app.use(express.urlencoded({ extended: false }));
// extended: false  ==> skep get(url) in body json

app.use("/", APIRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server started at port ", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
