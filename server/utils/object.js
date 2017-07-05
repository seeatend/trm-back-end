const objectUtils = {
  isObject: (obj) => {
    return obj != null && typeof obj === 'object' && Array.isArray(obj) === false
  },
  isString: (elem) => (typeof elem === 'string' || elem instanceof String),
  isBoolean: (elem) => (typeof elem === 'boolean'),
  isFunction: (elem) => {
    return elem && {}.toString.call(elem) === '[object Function]';
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