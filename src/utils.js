import https from 'https'
import {
  assoc,
  complement,
  curry,
  dissoc,
  flip,
  isNil,
  map,
  prop,
  tap,
  when 
} from 'ramda'

export const httpRequest = url => {
  return new Promise(resolve => 
    https.get(url, resp => {
      /* eslint-disable-next-line fp/no-let */
      let data = ''

      // A chunk of data has been recieved.
      /* eslint-disable-next-line fp/no-unused-expression, fp/no-mutation */
      resp.on('data', chunk => data += chunk)

      // The whole response has been received. Print out the result.
      /* eslint-disable-next-line fp/no-unused-expression, fp/no-mutation */
      resp.on('end', () => resolve(data))

      return true 
    }).on('error', err => console.log('Error: ' + err.message)
    ) 
  )
}

export const logger = tap(console.log)

export const renameKey = curry((oldKey, newKey, obj) =>
  assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj)))

export const whenFound = when(complement(isNil))

export const mapFrom = flip(map)
