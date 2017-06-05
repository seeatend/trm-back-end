const objectUtils = {
  removePrivate: (obj) => {
    const result = {}
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (key[0] !== '_') {
        result[key] = value
      }
    })
    return result
  }
}

module.exports = objectUtils