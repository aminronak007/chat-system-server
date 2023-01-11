const router = require("express").Router();
const UserContoller = require("../../controllers/admin/users.controller");

router.post("/create", UserContoller.createUser);

module.exports = router;
