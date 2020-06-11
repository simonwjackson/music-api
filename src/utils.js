import { map, flip, tap, curry, assoc, prop, dissoc, when, complement, isNil } from 'ramda'
import https from 'https'

export const httpRequest = (url) => {
  return new Promise(function(resolve) {
    https.get(url, (resp) => {
      let data = ''

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk
      })

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data)
      })

    }).on('error', (err) => {
      console.log('Error: ' + err.message)
    }) 
  })
}

export const logger = tap(console.log)

export const renameKey = curry((oldKey, newKey, obj) =>
  assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj)))

export const whenFound = when(complement(isNil))

export const mapFrom = flip(map)
