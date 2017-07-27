require('setup')
const {createIndexes} = require('utils/algolia')

const configureIndex = (model, options) => {
  createIndexes(Object.assign({}, options, {
    setSettings: true
  }))
  model.SetAlgoliaSettings({
    searchableAttributes: options.searchableAttributes
  }, (err, content) => {
    if (err) {
      console.error(err.message)
    }
    else {
      console.log(content)
    }
  })

  model.SyncToAlgolia(
  ).then(() => {
    process.exit(0)
  }).catch(err => {
    console.log(err.message)
  })
}

const {Horse, horseSearchSettings} = require('api/horse/model')

configureIndex(Horse, horseSearchSettings)

