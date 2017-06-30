require('setup')
const {createIndexes} = require('utils/algolia')

const configureIndex = (model, options) => {
  createIndexes(Object.assign({}, options, {
    setSettings: true
  }))
  model.SetAlgoliaSettings({
    searchableAttributes: options.searchableAttributes
  })

  model.SyncToAlgolia()
}

const {Horse, horseSearchSettings} = require('api/horse/model')

configureIndex(Horse, horseSearchSettings)

