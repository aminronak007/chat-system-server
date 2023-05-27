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

router.get(
  "/read/privacy",
  verifyAccessToken,
  SettingsController.getPrivacySettings
);

router.put(
  "/update/password",
  verifyAccessToken,
  SettingsController.changePassword
);

module.exports = router;
