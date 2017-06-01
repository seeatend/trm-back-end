const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const moveFile = (from, to) => {
  const source = fs.createReadStream(from)
  const destination = fs.createWriteStream(to)

  source.pipe(destination)
  source.on('end', function() {
    fs.unlink(from, function(err) {
      if (err) throw err
    })
  })
}

module.exports = {
  extension: (name) => {
    return name.slice(name.lastIndexOf('.') + 1)
  },

  move: (from, to) => {
    const toBaseName = path.dirname(to)

    if (!fs.existsSync(toBaseName)) {
      mkdirp(toBaseName, moveFile.bind(this, from, to))
    }
    else {
      moveFile(from, to)
    }
  }
}