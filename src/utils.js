import https from 'https'
import {
  allPass,
  anyPass,
  assoc,
  complement,
  curry,
  dissoc,
  flip,
  isEmpty,
  isNil,
  map,
  prop,
  tap,
  when
} from 'ramda'


export const httpRequest = url => new Promise(resolve => 
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


export const logger = tap(console.log)


export const renameKey = curry((oldKey, newKey, obj) =>
  assoc(newKey, prop(oldKey, obj), dissoc(oldKey, obj)))


/**
 * @param  whenTrueFn A function to invoke when the `condition` evaluates to a truthy value.
 * @param  x An object to test with the `pred` function and pass to `whenTrueFn` if necessary.
 * @return Either `x` or the result of applying `x` to `whenTrueFn`.  
 *
 * @example
 *
 *      const tryAdd = whenFound(a => a + 1);
 *      tryAdd(2);         // 3
 *      truncate(null);    // null
 *
 * @type {(whenTrueFn: function, x: *) => *}
 */ 
// @ts-ignore
export const whenFound = when(complement(isNil))


export const mapFrom = flip(map)


/**
 * @param  predicates 
 * @param  obj 
 * @return a booleand
 *
 * @typedef { import("ramda/tools").Pred } Pred
 */ 
export const allFail = curry(
  /** @type {(predicates: Pred[], obj: object) => boolean} */
  (predicates, obj) => !allPass(predicates)(obj)
)


export const isFalsy = anyPass([
  isEmpty,
  isNil,
]) 


export const notEmpty = complement(isEmpty)
