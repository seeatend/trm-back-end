let EMAIL_REG = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/

const EMAIL = {
  type: String,
  lowercase: true,
  unique: 'This email has been taken.',
  required: true,
  validate: {
    message: 'Please provide email with correct format.',
    validator: EMAIL_REG
  }
}

let PASSWORD_REG = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

const PASSWORD = {
  type: String,
  required: true,
  validate: {
    message: 'Passwords must have at least one capital letter, lower case letter, number and be at least 6 characters long.',
    validator: PASSWORD_REG
  }
}

module.exports = {
  EMAIL,
  PASSWORD
}