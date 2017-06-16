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
    let newObj = Object.assign({}, obj)
    Object.keys(newObj).forEach(key => {
      let val = newObj[key]
      if (objectUtils.isObject(val)) {
        let isObjectId = val._bsontype && val._bsontype === 'ObjectID'
        if (!isObjectId) {
          newObj[key] = objectUtils.cloneObject(val)
        }
      }
    })
    return newObj
  }
}

module.exports = objectUtils