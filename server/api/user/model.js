const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const {EMAIL, PASSWORD} = require('utils/validation')
const bcrypt = require('bcrypt-as-promised')
const uniqueValidator = require('mongoose-unique-validator')

const User = new Schema({
  firstname: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  verification: {
    type: String
  },
  email: EMAIL,
  password: PASSWORD,
  type: {
    type: String,
    lowercase: true
  },
  ownership: [{
    _id: false,
    horse: {
      type: ObjectId,
      ref: 'Horse'
    },
    shares: {
      owned: {
        type: Number
      },
      total: {
        type: Number
      }
    }
  }]
})

User.plugin(uniqueValidator)

// Hash the user's password before inserting a new user
User.pre('save', function (next) {
  let user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        next(err)
      }
      bcrypt.hash(user.password, salt)
        .then(hash => {
          user.password = hash
          next()
        })
        .catch(err => {
          next(err)
        })
    })
  } else {
    return next()
  }
})

// Compare password input to password saved in database
User.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(isMatch => {
      if (isMatch) {
        return Promise.resolve()
      }
      else {
        return Promise.reject({message: 'Authentication failed. Passwords did not match.'})
      }
    })
}

module.exports = mongoose.model('User', User)