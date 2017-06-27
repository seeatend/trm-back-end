const {Horse} = require('api/horse/model')

module.exports = (body) => {
  if (body.query && body.query.length > 0) {
    let query = body.query.toUpperCase();
    return new Promise((resolve, reject) => {
      Horse.esSearch(
        {
          query: {
            match: {
              query
            }
          }
        },
        {
          hydrate: true,
          hydrateWithESResults: true,
          hydrateOptions: {select: 'name'}
        },
        function (err, results) {
          if (err) {
            console.log(err)
            reject(err)
          }
          else {
            resolve(results)
          }
        }
      )
    })
  }
  else {
    return Promise.reject()
  }
}