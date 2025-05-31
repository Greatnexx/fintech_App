import { validationResult, body } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Registration Validation
export const validateRegister = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name must contain only letters'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name must contain only letters'),

  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+234|0)[789][01]\d{8}$/)
    .withMessage('Invalid phone number'),

  handleValidationErrors,
];

export const validateStaffRegister = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name must contain only letters'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name must contain only letters'),

  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('phone_number')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+234|0)[789][01]\d{8}$/)
    .withMessage('Invalid phone number'),

  handleValidationErrors,
];

// Login Validation
export const validateLogin = [
  body('email')
    .normalizeEmail()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors,
];

// Profile Validation
export const validateProfile = [
  body('address')
    .notEmpty()
    .withMessage('Address is required'),

  body('profile_image')
    .notEmpty()
    .withMessage('Profile image is required'),

  body('city')
    .notEmpty()
    .withMessage('City is required'),

  body('date_of_birth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),

  body('lga')
    .notEmpty()
    .withMessage('LGA is required'),

  body('state')
    .notEmpty()
    .withMessage('State is required'),

  body('country')
    .notEmpty()
    .withMessage('Country is required'),

  body('zip_code')
    .notEmpty()
    .withMessage('Zip code is required'),

  body('marital_status')
    .notEmpty()
    .withMessage('Marital status is required'),

  handleValidationErrors,
];
