const multer = require("multer");
var fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.fieldname === "profile" ||
      file.fieldname === "coverImage"
      // file.fieldname === "customer_images" ||
      // file.fieldname === "customer_docs"
    ) {
      if (file.fieldname === "profile") {
        if (!fs.existsSync(`${process.env.UPLOAD_DIR}/profile`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/profile`);
        }
        cb(null, `${process.env.UPLOAD_DIR}/profile`);
      }

      if (file.fieldname === "coverImage") {
        if (!fs.existsSync(`${process.env.UPLOAD_DIR}/coverImages`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/coverImages`);
        }
        cb(null, `${process.env.UPLOAD_DIR}/coverImages`);
      }
    } else {
      let path = "";
      return path;
    }
  },

  filename: (req, file, cb) => {
    let fileExt = file.originalname.split(".").pop();
    cb(
      null,
      Date.now() + "_" + `${file.fieldname}.${fileExt}`.split(" ").join("_")
    );
  },
});

exports.upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "profile" || file.fieldname === "coverImage") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        return cb(null, false);
      }
    }

    if (file.fieldname === "customer_images") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/webp"
      ) {
        cb(null, true);
      } else {
        return cb(null, false);
      }
    }

    if (file.fieldname === "customer_files") {
      if (
        file.mimetype == "application/pdf" ||
        file.mimetype == "application/msword" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype == "text/csv"
      ) {
        cb(null, true);
      } else {
        return cb(null, false);
      }
    }

    if (file.fieldname === "customer_docs") {
      if (
        file.mimetype == "application/pdf" ||
        file.mimetype == "application/msword" ||
        file.mimetype ==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype == "text/csv" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/webp"
      ) {
        cb(null, true);
      } else {
        return cb(null, false);
      }
    }
  },
});
