const express = require("express");
const { requireSignin } = require("../controllers/authController");
const {
  postOrder,
  orderList,
  orderDetails,
  updateStatus,
  deleteOrder,
  userOrders
} = require("../controllers/orderController");
const router = express.Router();

router.post("/postorder",requireSignin, postOrder);
router.get("/orderlist",requireSignin, orderList);
router.get("/orderdetails/:id",requireSignin, orderDetails);
router.put("/updatestatus/:id",requireSignin, updateStatus);
router.delete("/deleteorder/:id",requireSignin, deleteOrder);
router.get("/userorders/:userid",requireSignin,userOrders);
module.exports = router;
