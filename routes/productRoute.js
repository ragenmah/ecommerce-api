const express = require("express");
const {
  postProduct,
  productList,
  productDetails,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { productValidation } = require("../validation");
const upload = require("../middleware/file-upload");
const { requireSignin } = require("../controllers/authController");
const errorHandler = require("../helpers/errorHandler");
const router = express.Router();

router.post("/postproduct",requireSignin,errorHandler, upload.single('product_image'), productValidation, postProduct);
router.get("/productlist", productList);
router.get("/productdetails/:id", productDetails);
router.put("/updateproduct/:id", requireSignin,errorHandler,updateProduct);
router.delete("/deleteproduct/:id",requireSignin,errorHandler, deleteProduct);
module.exports = router;
