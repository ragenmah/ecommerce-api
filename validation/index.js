exports.productValidation = (req, res, next) => {
  req.check("product_name", "Product Name is required").notEmpty();
  req
    .check("product_price", "Product Price is mandatory")
    .notEmpty()
    .isNumeric()
    .withMessage("Price Only accept numeric value");
  req
    .check("countInStock", "Stock quantity is required")
    .notEmpty()
    .isNumeric()
    .withMessage("Stock quantity only accept numeric value");
  req
    .check("product_description", "Description is not required")
    .notEmpty()
    .isLength({ min: 30 })
    .withMessage("Description must be mmore than 30 characters");
  req.check("category", "Category is required").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const showError = errors.map((err) => err.msg)[0];
    // value haru one by one wrap garne
    return res.status(400).json({ error: showError });
  }
  //   validadation milyo vane arko ma jaanu paryo
  next();
};
