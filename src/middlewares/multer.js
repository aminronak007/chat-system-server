const multer = require("multer");
var fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.fieldname === "profile" ||
      file.fieldname === "coverImage" ||
      file.fieldname === "file"
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

      if (file.fieldname === "file") {
        if (!fs.existsSync(`${process.env.UPLOAD_DIR}/media`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/media`);
        } else if (!fs.existsSync(`${process.env.UPLOAD_DIR}/media/images`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/media/images`);
        } else if (!fs.existsSync(`${process.env.UPLOAD_DIR}/media/pdfs`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/media/pdfs`);
        } else if (!fs.existsSync(`${process.env.UPLOAD_DIR}/media/csv`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/media/csv`);
        } else if (!fs.existsSync(`${process.env.UPLOAD_DIR}/media/word`)) {
          fs.mkdirSync(`${process.env.UPLOAD_DIR}/media/word`);
        }

        var dirName = "";
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg" ||
          file.mimetype == "image/gif" ||
          file.mimetype == "image/webp"
        ) {
          dirName = "images";
        }

        if (file.mimetype == "application/pdf") {
          dirName = "pdfs";
        }

        if (file.mimetype == "text/csv") {
          dirName = "csv";
        }

        if (
          file.mimetype == "application/msword" ||
          file.mimetype ==
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          dirName = "word";
        }
        cb(null, `${process.env.UPLOAD_DIR}/media/${dirName}`);
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

    if (file.fieldname === "file") {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/webp" ||
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
  },
});
