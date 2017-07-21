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

module.exports = {
  EMAIL
}