const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const exec = require('child_process').exec

const moveFile = (from, to, done) => {
  const source = fs.createReadStream(from)
  const destination = fs.createWriteStream(to)

  source.pipe(destination)
  source.on('end', function() {
    setTimeout(() => {
      fs.unlink(from, function(error) {
        done()
        if (error) {
          console.warn(`Could not unlink file ${from}`)
        }
      })
    }, 100)
  })
}

const fileUtils = {
  extension: (name) => {
    return name.slice(name.lastIndexOf('.') + 1)
  },

  move: (from, to, done) => {
    const toBaseName = path.dirname(to)

    if (!fs.existsSync(toBaseName)) {
      mkdirp(toBaseName, moveFile.bind(this, from, to, done))
    }
    else {
      moveFile(from, to, done)
    }
  },

  thumbnailPath: (file) => {
    return `${path.dirname(file)}/${path.basename(file, path.extname(file))}.jpg`
  },

  generateThumbnail: (file, done) => {
    const command = `ffmpeg -ss 00:00:01 -i ${file} -y -vframes 1 -f image2 ${fileUtils.thumbnailPath(file)}`
    exec(command, done)
  }
}

module.exports = fileUtils