const multer = require("multer");
const fs = require("fs"); //file system
const path = require("path");

const storage = multer.diskStorage({
  // cb callback- euta fxn le execute gare pachi aru garnu paryo
  destination: (req, file, cb) => {
    let fileDestination = "public/uploads/";
    // check if directory exists
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
      // recursive: true means it create parent folder as well as sub folder
      cb(null, fileDestination);
    } else {
      cb(null, fileDestination);
    }
  },
  filename: (req, file, cb) => {
    let fileName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    ); // returns the image name
    let ext = path.extname(file.originalname); //.JPG
    cb(null, fileName + "_" + Date.now() + ext);
  },
});
let imageFilter = (req, file, cb) => {
  if (
    !file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|PNG|JPEG|SVG|JFIF)$/)
  ) {
    return cb(new Error("You can upload image file only"), false);
  } else {
    return cb(null, true);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2000000, //2 MB
  },
});

module.exports = upload;
