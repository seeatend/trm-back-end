const {removeFile} = require('utils/file')

module.exports = function (schema, {definition}) {
  Object.keys(definition).forEach(key => {
    let field = definition[key]
    if (field.file) {
      schema.path(key).set(function (newVal) {
        let oldVal = this[key]
        if (!field.default || oldVal !== field.default) {
          removeFile(oldVal)
        }
        return newVal
      })
    }
  })
}
