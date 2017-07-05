const {isString, isBoolean} = require('utils/object')

module.exports = filter => {
  let results = []
  if (filter && filter.length > 0) {
    filter.forEach(condition => {
      if (condition.field) {
        let field = condition.field
        if (condition.range) {
          if (condition.range.min) {
            results.push(`${field} >= ${condition.range.min}`)
          }
          if (condition.range.max) {
            results.push(`${field} <= ${condition.range.max}`)
          }
        }
        else if (condition.value !== undefined) {
          let value = condition.value
          if (isString(value)) {
            results.push(`${field}:"${value}"`)
          }
          else if (isBoolean(value)) {
            results.push(`${field}=${value ? 1 : 0}`)
          }
        }
      }
    })
  }
  return results
}
