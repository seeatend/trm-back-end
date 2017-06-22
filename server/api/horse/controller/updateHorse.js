const {Horse} = require('api/horse/model')
const {processFiles} = require('utils/request')

module.exports = updateHorse = (query, _data, files) => {
  let data = Object.assign({}, _data)

  return processFiles(
    files, `horses/${Date.now()}`
  ).then(filesData => {
    if (filesData) {
      if (filesData.featuredImage && filesData.featuredImage.length > 0) {
        data.featuredImage = filesData.featuredImage[0].path
      }
      if (filesData.thumbnailImage && filesData.thumbnailImage.length > 0) {
        data.thumbnailImage = filesData.thumbnailImage[0].path
      }
    }
    return Horse.findOneAndUpdate(
      query,
      data,
      {upsert: true, new: true}
    )
  }).then(horse => {
    if (horse) {
      return Promise.resolve(horse)
    }
    else {
      return Promise.reject({message: 'Could not update horse.'})
    }
  }).catch(Promise.reject)
}
