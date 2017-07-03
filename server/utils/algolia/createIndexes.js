const algoliaClient = require('./algoliaClient')
const getIndexName = require('./getIndexName')

const isProduction = process.env.NODE_ENV === 'prod'

module.exports = ({sortBy, filterBy, modelName, setSettings}) => {
  if (!modelName) { throw new Error('Model name is not defined.')}
  let primaryIndexName = `${isProduction ? 'prod' : 'dev'}${modelName}s`

  let primaryIndex = algoliaClient.initIndex(primaryIndexName)

  let replicaInfos = []
  let replicaNames = []

  // Create sorting replicas
  sortBy.forEach(field => {
    replicaInfos.push({field, order: 'desc'})
    replicaInfos.push({field, order: 'asc'})
  })

  replicaInfos.forEach(replicaInfo => {
    replicaNames.push(getIndexName(primaryIndexName, replicaInfo.field, replicaInfo.order))
  })

  // Configure replicas for correct sorting and filtering
  let replicaIndexes = {}

  let attributesForFaceting

  if (setSettings) {
    if (filterBy) {
      attributesForFaceting = filterBy.map(field => (`filterOnly(${field})`))
    }
    console.log(`Set settings for: ${primaryIndexName}`)
    primaryIndex.setSettings({
      replicas: replicaNames,
      attributesForFaceting
    })
  }

  replicaNames.forEach((name, i) => {
    let replicaInfo = replicaInfos[i]
    let replicaIndex = algoliaClient.initIndex(name)

    if (setSettings) {
      console.log(`Set settings for: ${name}`)
      replicaIndex.setSettings({
        ranking: [
          `${replicaInfo.order}(${replicaInfo.field})`,
          'typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'
        ],
        attributesForFaceting
      })
    }
    replicaIndexes[name] = replicaIndex
  })

  return {
    primaryIndex,
    primaryIndexName,
    replicaIndexes
  }
}
