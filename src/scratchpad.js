// const stringSimilarity = require('string-similarity')
// const axios = require('axios')
// import { exec } from 'child_process'
import googleIt from 'google-it'
import { writeFile } from 'fs'


googleIt({ 
  'query': 'poison the well opposite of december', 
  returnHtmlBody: true
})
  .then(({ body }) => {
    writeFile('googleIt.html', body.replace(/[\n\r]/g, ''), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${output}: ${err}`)
      }
    })
  })

// const INDEX = join(__dirname, '../googleIt.html')
// const readFile = promisify(fs.readFile)
//
// const linkRegEx = /mu(s)ic/g
//
// readFile(INDEX)
//   .then(e => e.toString())
//   .then(html => {
//     return linkRegEx.exec(html)[1]
//   })
//   .then(console.log)
