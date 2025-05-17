import { validationResult, body } from "express-validator";

const handleValidationErrors = (
  req,
  res,
  next
) => {
  const errors = validationResult(req); // check validation errors from the request
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return; 
  }
  next(); // If no errors, proceed to the next middleware or controller
};

export const validateRegister = [
  body("first_name")
    .notEmpty()
    .withMessage("Firstname is required")
    .isString()
    .withMessage("firstname must be a string"),
  body("last_name")
    .notEmpty()
    .withMessage("lastName is required")
    .isString()
    .withMessage("LastName must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  handleValidationErrors,
  body("date_of_birth")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  handleValidationErrors,
  body("address")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  handleValidationErrors,
  body("phone_number")
    .notEmpty()
    .withMessage("Phone_Number is required")
    .isString()
    .withMessage("PhoneNuber must be a string"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),
  handleValidationErrors,
];


