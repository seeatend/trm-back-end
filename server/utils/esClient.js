const elasticsearch = require('elasticsearch')
console.log('Connecting to elasticsearch')
module.exports = new elasticsearch.Client({
  host: 'https://elastic:li67yeCaJ8po8p6eXcWLAOih@737756dda0f4228814b1233b2e959893.us-east-1.aws.found.io:9243',

})