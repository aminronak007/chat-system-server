const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const SettingsController = require("../controllers/settings.controller");

router.put(
  "/update/theme",
  verifyAccessToken,
  SettingsController.updateThemeSettings
);

router.put(
  "/update/privacy",
  verifyAccessToken,
  SettingsController.updatePrivacySettings
);

module.exports = router;
