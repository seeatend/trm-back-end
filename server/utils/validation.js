const validator = require('validator')

const {EMAIL, FIRSTNAME} = require('data/messages')

const FIRSTNAME_REG = /^(?=[a-zA-Z-\s]{2,}$)^[a-zA-Z\s]+(-[a-zA-Z\s]+)*$/

const FIRSTNAME_VLD = {
  type: String,
  required: FIRSTNAME.REQUIRED,
  validate: {
    message: FIRSTNAME.ERROR,
    validator: FIRSTNAME_REG
  }
}

const EMAIL_REG = /^[_a-zA-Z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/

const EMAIL_VLD = {
  type: String,
  unique: EMAIL.DUPLICATE,
  required: true,
  validate: {
    message: EMAIL.ERROR,
    validator: EMAIL_REG
  }
}

let PASSWORD_REG = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

const PASSWORD_VLD = {
  type: String,
  required: true,
  validate: {
    message: 'Passwords must have at least one capital letter, lower case letter, number and be at least 6 characters long.',
    validator: PASSWORD_REG
  }
}

const POSTCODE_VLD = {
  type: String,
  validate: {
    message: 'Please provide valid postcode.',
    validator: (value) => (validator.isPostalCode(value, 'GB'))
  }
}

module.exports = {
  FIRSTNAME_VLD,
  EMAIL_VLD,
  PASSWORD_VLD,
  POSTCODE_VLD
}
