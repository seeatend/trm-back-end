const { isObject } = require('utils/object')
const { horseDefinition } = require('models/horse')

const selectFields = (body, fields) => {
  const result = {}
  Object.keys(fields).forEach(key => {
    const value = fields[key]
    if (isObject(value)) {
      if (value.tf !== undefined) {
        if (body[value.tf]) {
          result[key] = body[value.tf]
        }
      }
      else {
        result[key] = selectFields(body, value)
      }
    }
  })
  return result
}

const convertFields = {
  horse: body => {
    return selectFields(body, horseDefinition)
  },
  performance: body => {
    return selectFields(body, horseDefinition.performances[0])
  }
}

module.exports = convertFields