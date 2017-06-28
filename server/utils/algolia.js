const algoliasearch = require('algoliasearch')
const mongooseAlgolia = require('mongoose-algolia')

const appId = process.env.ALGOLIA_APP_ID
const apiKey = process.env.ALGOLIA_API_KEY

const algoliaClient = algoliasearch(appId, apiKey)

const isProduction = process.env.NODE_ENV === 'prod'

const applyAlgolia = (schema, options = {}) => {
  if (Array.isArray(options.selector)) {
    options.selector = options.selector.join(' ')
  }
  options.appId = appId
  options.apiKey = apiKey

  options.indexName = `${isProduction ? 'prod' : 'dev'}${options.indexName}`

  options.debug = true

  schema.plugin(mongooseAlgolia, options)

  return algoliaClient.initIndex(options.indexName)
}

module.exports = {
  algoliaClient,
  applyAlgolia
}