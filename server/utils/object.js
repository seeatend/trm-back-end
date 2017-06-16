const objectUtils = {
  isObject: (obj) => {
    return obj != null && typeof obj === 'object' && Array.isArray(obj) === false
  },
  removePrivate: (obj) => {
    const result = {}
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (key[0] !== '_') {
        result[key] = value
      }
    })
    return result
  },
  cloneObject: (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = objectUtils