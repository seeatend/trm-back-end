const mongoose = require('mongoose')
const {Schema} = mongoose
const {ObjectId} = Schema.Types
const {EMAIL_VLD, PASSWORD_VLD, FIRSTNAME_VLD} = require('utils/validation')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')
const {AUTHENTICATION} = require('data/messages')
const {removeFilesOnUpdate} = require('utils/mongoose')
const {isMongoId} = require('utils/object')

let UserModel

let userDefinition = {
  firstname: FIRSTNAME_VLD,
  surname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    validate: {
      isAsync: true,
      validator: function (value, done) {
        if (this.isModified('username') || this.isNew) {
          UserModel.findOne(
            {username: value}
          ).then(user => {
            if (user) {
              done(false)
            } else {
              done(true)
            }
          }).catch(err => {
            console.error(err)
            done(false)
          })
        } else {
          done(true)
        }
      },
      message: `This username has been taken`
    }
  },
  verification: {
    type: String
  },
  avatarImage: {
    type: String,
    file: true
  },
  birthDate: {
    type: Date
  },
  email: EMAIL_VLD,
  password: PASSWORD_VLD,
  type: {
    type: String,
    lowercase: true
  },
  location: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  syndicates: [{
    type: ObjectId,
    ref: 'Syndicate'
  }],
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
}

const UserSchema = new Schema(userDefinition)

UserSchema.plugin(uniqueValidator)
UserSchema.plugin(removeFilesOnUpdate, {
  definition: userDefinition
})

// Hash the user's password before inserting a new user
UserSchema.pre('save', function (next) {
  let user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

// Compare password input to password saved in database
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(
    password,
    this.password,
    (err, isMatch) => {
      if (err) {
        return Promise.reject({message: AUTHENTICATION.ERROR})
      }
      if (isMatch) {
        return Promise.resolve()
      } else {
        return Promise.reject({message: AUTHENTICATION.ERROR})
      }
    })
}

UserSchema.methods.addShare = function ({horse, amount = 1}) {
  let owned = this.ownership.filter(o => (o.horse.toString() === horse._id.toString()))
  if (owned.length > 0) {
    owned[0].shares.owned += 1
  } else {
    this.ownership.push({
      horse: horse._id,
      shares: {
        owned: amount,
        total: horse.shares.total
      }
    })
  }
}

UserSchema.methods.ownsSyndicate = function (syndicateId) {
  return isMongoId(syndicateId) && this.syndicates.indexOf(syndicateId.toString()) >= 0
}

UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
