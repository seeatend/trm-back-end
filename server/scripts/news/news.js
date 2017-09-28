/**
 * Created by Ali on 15/09/2017.
 */

// The script to fetch the news from the ftp server and save it to the database.
const config = require('config')
const path = require('path')

let PromiseFtp = require('promise-ftp')

// file stream to write images to disk
const fs = require('fs-extra')

// To parse xml files to javascript objects
let parseString = require('xml2js').parseString

// The model for the news
const News = require('api/news/controller')

module.exports = () => {
  let ftp = new PromiseFtp()
  let formattedArticles = []
  return ftp.connect({
    host: 'ftp.theracingmanager.com',
    user: 'press@theracingmanager.com',
    password: process.env.FTP_PASSWORD
  })
    .then((serverMessage) => {
      console.log(serverMessage)
      console.log('--------------------')
      return ftp.list('/')
    }).then((list) => {
      // The directory listing is required
      console.log('Getting xml files')
      let promises = []
      list.forEach((element) => {
        if (element.name.endsWith('.xml')) {
          // only looking at xml files to get all the data
          promises.push(
            // Getting the xml file
            ftp.get(element.name)
              .then(stream => {
                let xml = ''
                return new Promise((resolve, reject) => {
                  stream.on('data', (chunk) => {
                    xml += chunk
                  })
                  stream.on('error', reject)
                  stream.once('end', () => {
                    // return the xml contents
                    resolve(xml)
                  })
                })
              }))
        }
      })
      return Promise.all(promises)
    }).then((xmls) => {
      console.log('Parsing xml files to strings')
      let promises = []

      // parsing xml strings to js objects
      xmls.forEach(xml => {
        promises.push(new Promise((resolve, reject) => {
          parseString(xml, (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(err)
            }
          })
        })
        )
      })

      return Promise.all(promises)
    }).then((articles) => {
      // articles are the data within the xml file in js format
      console.log(`Formatting ${articles.length} article groups`)

      articles.forEach((elem) => {
        let date = elem.NewsML.NewsEnvelope[0].DateAndTime[0]
        let newsCompenents = elem.NewsML.NewsItem[0].NewsComponent[0].NewsComponent
        newsCompenents.forEach(component => {
          // Getting all the required data
          let headline = component.NewsComponent[0].NewsLines[0].HeadLine[0]
          let slugline = component.NewsComponent[0].NewsLines[0].SlugLine[0]
          let contentsOfArticle = component.NewsComponent[0].ContentItem[0].DataContent[0].nitf[0].body[0]['body.content'][0].p
          let contents = contentsOfArticle.join('\n')
          let imageName = component.NewsComponent[1].NewsComponent[0].NewsComponent[0].ContentItem[0].$.Href

          let year = date.substring(0, 4)
          let month = date.substring(4, 6)
          let day = date.substring(6, 8)
          let hours = date.substring(9, 11)
          let minutes = date.substring(11, 13)
          let seconds = date.substring(13, 15)
          let newDate = new Date(year, month, day, hours, minutes, seconds)

          let formattedArticle = {
            date: newDate,
            headline: headline,
            slugline: slugline,
            content: contents,
            thumbnailImage: imageName
          }
          formattedArticles.push(formattedArticle)
        })
      })
      console.log('Storing images')
      let promises = []
      let randomName = `${Date.now()}-${parseInt(Math.random() * 100)}`
      let baseDir = `/${config.get('storage.path')}/news/${randomName}/`
      promises.push(fs.ensureDir(path.resolve(`.${baseDir}`)))
      formattedArticles.forEach(article => {
        promises.push(
          ftp.get(article.thumbnailImage)
            .then(stream => {
              // TODO: Refactor path formatting into common function
              let imageName = article.thumbnailImage
              let imagePath = `${baseDir}${imageName}`
              return new Promise((resolve, reject) => {
                article.thumbnailImage = imagePath
                stream.pipe(fs.createWriteStream('.' + imagePath))
                stream.once('end', () => {
                  resolve({Success: true})
                })
                stream.once('error', () => reject({Success: false, message: 'Stream error'}))
              })
            })
        )
      })

      return Promise.all(promises)
    }).then(() => {
      console.log('Writing to database')
      let promises = formattedArticles.map(articleData => {
        return News.updateOrCreate({
          query: {
            date: articleData.date,
            headline: articleData.headline
          },
          data: articleData
        })
      })
      return Promise.all(promises)
    }).then(() => {
      let wasConnected = ftp.destroy()
      if (wasConnected) {
        return Promise.reject(new Error('Not all connections closed on time'))
      }
      console.log('--------------------')
      return Promise.resolve()
    })
}
