const algoliasearch = require('algoliasearch')
const mongooseAlgolia = require('mongoose-algolia')

const appId = process.env.ALGOLIA_APP_ID
const apiKey = process.env.ALGOLIA_API_KEY

const algoliaClient = algoliasearch(appId, apiKey)

const isProduction = process.env.NODE_ENV === 'prod'

const generateConditions = filter => {
  let results = []
  if (filter && filter.length > 0) {
    filter.forEach(condition => {
      if (condition.field) {
        let field = condition.field
        if (condition.range) {
          if (condition.range.min) {
            results.push(`${field} >= ${condition.range.min}`)
          }
          if (condition.range.max) {
            results.push(`${field} <= ${condition.range.max}`)
          }
        }
        else if (condition.value !== undefined) {
          let value = condition.value
          let valueAlgolia = value
          if (value === true) valueAlgolia = 1
          if (value === false) valueAlgolia = 0
          results.push(`${field}=${valueAlgolia}`)
        }
      }
    })
  }
  return results
}

const applyAlgolia = (schema, options = {}) => {
  let sort = options.sort
  delete options.sort

  if (Array.isArray(options.selector)) {
    if (options.virtuals) {
      options.selector = options.selector.concat(Object.keys(options.virtuals))
    }
    options.selector = options.selector.join(' ')
  }
  options.appId = appId
  options.apiKey = apiKey

  let indexName = `${isProduction ? 'prod' : 'dev'}${options.indexName}`;

  options.indexName = indexName

  options.debug = true

  schema.plugin(mongooseAlgolia, options)

  let index = algoliaClient.initIndex(indexName)

  let replicaInfos = []
  let replicaNames = []

  let getIndexName = ({field, order}) => (`${indexName}-${field}-${order}`)

  // Create sorting replicas
  sort.forEach(field => {
    replicaInfos.push({field, order: 'desc'})
    replicaInfos.push({field, order: 'asc'})
  })

  replicaInfos.forEach(replicaInfo => {
    replicaNames.push(getIndexName(replicaInfo))
  })

  let replicaIndexes = {}

  let attributesForFaceting = options.filter.map(field => (`filterOnly(${field})`))

  index.setSettings({
    replicas: replicaNames,
    attributesForFaceting
  })

  replicaNames.forEach((name, i) => {
    let replicaInfo = replicaInfos[i]
    let replicaIndex = algoliaClient.initIndex(name)

    replicaIndex.setSettings({
      ranking: [
        `${replicaInfo.order}(${replicaInfo.field})`,
        'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'
      ],
      attributesForFaceting
    })
    replicaIndexes[name] = replicaIndex
  })

  let searchHelper = {
    search: ({query, filter, sort}) => {
      let searchIndex
      if (sort) {
        searchIndex = replicaIndexes[getIndexName(sort)]
      }
      else {
        searchIndex = index
      }
      if (searchIndex) {
        let filterConditions = generateConditions(filter)
        let filters = filterConditions.join(' AND ');
        return searchIndex.search({
          query,
          filters
        })
      }
      else {
        return Promise.reject({message: 'Unsupported sorting strategy'})
      }
    }
  }

  return searchHelper
}

module.exports = {
  algoliaClient,
  applyAlgolia
}