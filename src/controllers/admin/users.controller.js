const { UserModel } = require("../../models/users.model");

class UserContoller {
  constructor() {}

  async createUser(req, res) {
    req
      .checkBody("first_name")
      .notEmpty()
      .withMessage("Please provide first name.");
    req
      .checkBody("last_name")
      .notEmpty()
      .withMessage("Please provide last name.");
    req
      .checkBody("email")
      .notEmpty()
      .withMessage("Please enter email.")
      .isEmail()
      .withMessage("The email you have entered is invalid")
      .isLength({ max: 60 })
      .withMessage("Email id should not be more than 60 Characters.");
    req
      .checkBody("mobile")
      .notEmpty()
      .withMessage("Please enter mobile number.")
      .matches(/^[0-9]+$/)
      .withMessage("Please enter a valid mobile number.")
      .isLength({ min: 10, max: 10 })
      .withMessage("Please enter a valid mobile number.");
    req
      .checkBody("password")
      .notEmpty()
      .withMessage("Please provide password.");

    const errors = req.validationErrors();
    if (errors) {
      return errorHandler(res, 400, message.SOMETHING_WRONG, errors);
    }

    if (req.body.key !== "TMJB@neesh") {
      return errorHandler(res, 400, message.KEY, {});
    }

    const result = await UserModel.createUser(req.body);

    if (result?.length > 0) {
      if (result[0]?.email === req.body.email) {
        return errorHandler(res, 400, message.EXISTS("Email"), []);
      }
      if (result[0]?.mobile === req.body.mobile) {
        return errorHandler(res, 400, message.EXISTS("Mobile"), []);
      }
    }
    successHandler(res, 200, message.SUCCESS, result);
  }
}

module.exports = new UserContoller();
