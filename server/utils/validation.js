const EMAIL = {
  type: String,
  lowercase: true,
  unique: 'This email has been taken.',
  required: true,
  validate: {
    message: 'Please provide email with correct format.',
    validator: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/
  }
}

const PASSWORD = {
  type: String,
  required: true,
  validate: {
    message: 'Passwords must have at least one capital letter, lower case letter, number and be at least 5 characters long.',
    validator: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}/
  }
}

module.exports = {
  EMAIL,
  PASSWORD
}