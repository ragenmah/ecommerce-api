const express = require("express");
require("dotenv").config();
const db = require("./database/connection");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const expressValidator = require("express-validator");
const categoryRoute = require("./routes/categoryRoute");
const productROute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");

// main app
const app = express();

//middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(expressValidator());
app.use(cookieParser());
app.use(cors());
app.use('/public/uploads',express.static('public/uploads'))
// api is prefix
//routes
app.use("/api", categoryRoute);
app.use("/api", productROute);
app.use("/api", authRoute);
app.use("/api", orderRoute);
app.use("/api", paymentRoute);
// app.get('/hello',(req,res)=>{
//     res.send('hello from express js')
// })

//to read port no from .env file
const port = process.env.PORT;
// nodemon - > server automatically start hos vanera ho

//to start the server
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
