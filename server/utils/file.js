const fs = require('fs')
const path = require('path')

const mkdirp = require('mkdirp')

const exec = require('child_process').exec

const moveFile = (from, to, done) => {
  const source = fs.createReadStream(from)
  const destination = fs.createWriteStream(to)

  source.pipe(destination)
  source.on('end', function () {
    setTimeout(() => {
      fs.unlink(from, function (error) {
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

  generateThumbnail: (file) => {
    return new Promise((resolve, reject) => {
      let thumbnailPath = `${path.dirname(file)}/${path.basename(file, path.extname(file))}.jpg`
      const command = `ffmpeg -ss 00:00:00 -i ${file} -y -vframes 1 -f image2 ${thumbnailPath}`
      exec(command, err => {
        if (err) {
          reject(err)
        }
        else {
          resolve(thumbnailPath)
        }
      })
    })
  }
}

module.exports = fileUtils