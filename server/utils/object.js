const objectUtils = {
  isObject: obj => {
    return obj != null && typeof obj === 'object' && Array.isArray(obj) === false
  },
  isString: elem => (typeof elem === 'string' || elem instanceof String),
  isBoolean: elem => (typeof elem === 'boolean'),
  isFunction: elem => {
    return elem && {}.toString.call(elem) === '[object Function]';
  },
  removePrivate: obj => {
    const result = {}
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (key[0] !== '_') {
        result[key] = value
      }
    })
    return result
  },
  removeEmpty: obj => {
    let result = {}
    Object.keys(obj).forEach(key => {
      let val = obj[key]
      if (val !== undefined && val !== null && val !== '') {
        result[key] = val
      }
    })
    return result
  },
  cloneObject: obj => (JSON.parse(JSON.stringify(obj)))
}

module.exports = objectUtils