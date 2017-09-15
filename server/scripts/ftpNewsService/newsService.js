/**
 * Created by Ali on 15/09/2017.
 */

/*
 The script to fetch the news from the ftp server and save it to the database.
 */

let ftpPassword = process.env.FTP_PASSWORD

let PromiseFtp = require('promise-ftp')

// file stream to write images to disk
const fs = require('fs-extra')

// To parse xml files to javascript objects
let parseString = require('xml2js').parseString

// The model for the news
const News = require('api/news/model')
// require('./../../setup')

// for running the code every day at 12
let cron = require('node-cron')
getAndStoreNewsInDB()
scheduleJob()

function scheduleJob () {
  let task = cron.schedule('* * 12 * * *', function () {
    console.log('immediately started')

    getAndStoreNewsInDB()
  }, false)

  // Starting the task
  task.start()
}

function getAndStoreNewsInDB () {
  let ftp = new PromiseFtp()
  ftp.connect({
    host: 'ftp.theracingmanager.com',
    user: 'press@theracingmanager.com',
    password: ftpPassword
  })
    .then(function (serverMessage) {
      return ftp.list('/')
    }).then(function (list) {
      // The directory listing is required
      // console.log('Directory listing:')
      // console.dir(list);
      let promises = []
      list.forEach(function (element) {
        if (element.name.endsWith('.xml')) {
          // only looking at xml files to get all the data
          console.log('xml file')
          promises.push(
            // Getting the xml file
            ftp.get(element.name)
              .then(stream => {
                let xml = ''
                return new Promise((resolve, reject) => {
                  stream.on('data', function (chunk) {
                    xml += chunk
                  })
                  stream.once('end', function () {
                    // return the xml contents
                    resolve(xml)
                  })
                })
              }))
        }
      })

      return Promise.all(promises)
    }).then(function (xmls) {
      console.log('weve got streams')
      // stream.once('close', function() { c.end(); });
      let articles = []

      console.log(xmls.length)

      // parsing xml strings to js objects
      xmls.forEach(xml => {
        articles.push(new Promise((resolve, reject) => {
          parseString(xml, function (err, result) {
            if (!err) {
              console.log('result ', result)
              resolve(result)

              // console.log(result);
            } else {
              reject(err)
              console.log('error occured', err)
            }
          })
        })
        )
      })

      return Promise.all(articles)
    }).then(function (articles) {
      // articles are the data within the xml file in js format
      console.log('articles', articles.length)
      let imageNames = []
      articles.forEach(function (elem) {
        let date = elem.NewsML.NewsEnvelope[0].DateAndTime[0]
        elem.NewsML.NewsItem[0].NewsComponent[0].NewsComponent.forEach(component => {
          imageNames.push(new Promise((resolve, reject) => {
            /*

                     Getting all the required data

                     */
            let headline = component.NewsComponent[0].NewsLines[0].HeadLine[0]
            let slugline = component.NewsComponent[0].NewsLines[0].SlugLine[0]
            let contentsOfArticle = component.NewsComponent[0].ContentItem[0].DataContent[0].nitf[0].body[0]['body.content'][0].p
            let contents = contentsOfArticle.join('\n')
            let imageName = component.NewsComponent[1].NewsComponent[0].NewsComponent[0].ContentItem[0].$.Href
            // console.log(date);

            let year = date.substring(0, 4)
            let month = date.substring(4, 6)
            let day = date.substring(6, 8)
            let hours = date.substring(9, 11)
            let minutes = date.substring(11, 13)
            let seconds = date.substring(13, 15)
            let newDate = new Date(year, month, day, hours, minutes, seconds)
            // let imageString = new Date().toString() + imageName
            // let test =  imageString.replace(/\s/g,'');
            resolve(imageName)
            // console.log('image string is: ' + imageString)
            // console.log('newdate', newDate);
            let news = new News({
              date: newDate,
              headline: headline,
              slugline: slugline,
              news: contents,
              imagePath: imageName
            })

            news.save().then((res) => {
              if (res) {
                console.log('news saved successfully')
              } else {
                console.log('news not saved')
              }
            })
            // console.log(component.NewsComponent[0].ContentItem[0].DataContent[0].nitf[0].body[0]['body.content'][0].p);
            //  console.log(elem.NewsML.NewsItem[0].NewsComponent[0].NewsComponent.length)
            //  console.log(component.NewsComponent[1].NewsComponent[0].NewsComponent[0].ContentItem[0].$.Href);
          }))
        })
      })
      return Promise.all(imageNames)
    }).then(images => {
      // images are saved with a timestamp followed by their name
      console.log(images[0])
      let promises = []
      images.forEach(image => {
        promises.push(
          ftp.get(image)
            .then(stream => {
              return new Promise((resolve, reject) => {
                stream.once('close', resolve('Successfull'))
                stream.once('error', reject('Unsuccessful'))
                // writing the images in images directory
                stream.pipe(fs.createWriteStream('server/images/' + image))
              })
            }))
      })

      return Promise.all(promises)
    }).then(something => {
      console.log('something', something)
      return ftp.end()
    }).catch(err => {
      console.log('error ', err)
    })
}
