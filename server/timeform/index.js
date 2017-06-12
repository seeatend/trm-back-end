require('dotenv').config()
const { authenticate, horses } = require('./api')

authenticate.then(() => {
  horses.get({
    $top: 1,
    $filter: `horseName eq 'tobefair'`
  }).then(body => {
    console.log(body)
  })
})
