const created = name => (`${name} has been created`)
const notFound = type => name => (`Could not find ${type} '${name}'`)

module.exports = {
  METHODS: {
    HORSE: {
      NOT_FOUND: notFound('horse')
    },
    USER: {
      NOT_FOUND: notFound('user')
    },
    MISSING_PARAMETER: param => (`Please provide ${param}.`)
  },
  GENERIC: {
    NOT_FOUND: 'Not found'
  },
  VERIFICATION: {
    ERROR: 'Please verify your account'
  },
  AUTHENTICATION: {
    ERROR: 'Login failed',
    SUCCESS: 'Login successful'
  },
  REGISTER: {
    SUCCESS: created('User')
  },
  EMAIL: {
    DUPLICATE: 'This email has been taken',
    ERROR: 'Please provide email with correct format'
  },
  FIRSTNAME: {
    REQUIRED: 'Please provide your first name',
    ERROR: 'Please enter a valid name; It can contain capital letters, hyphens and a min 2 characters'
  },
  MESSAGE: {
    SUCCESS: created('Message')
  },
  COMMENT: {
    SUCCESS: created('Comment')
  }
}
