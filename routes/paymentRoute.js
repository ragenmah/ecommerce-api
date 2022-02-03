const express = require("express");
const { requireSignin } = require("../controllers/authController");
const { processPayment, sendStripeApi } = require("../controllers/paymentController");
const router = express.Router();

router.post("/process/payment",requireSignin, processPayment);
router.get("/sendstripeapi",sendStripeApi);
module.exports = router;
