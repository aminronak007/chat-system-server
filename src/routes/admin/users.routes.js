const router = require("express").Router();
const UserContoller = require("../../controllers/admin/users.controller");
const { upload } = require("../../middlewares/multer");

router.post("/create", upload.single("profile"), UserContoller.createUser);

module.exports = router;
