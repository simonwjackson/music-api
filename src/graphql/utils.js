import {
  path,
  pathSatisfies,
  pipe,
} from 'ramda'
import {
  allFail,
  isFalsy
} from 'utils' 


export const shouldChallenge = process => pipe(
  path(['env']),
  allFail([
    pathSatisfies(isFalsy, ['HTTP_USER']),
    pathSatisfies(isFalsy, ['HTTP_PASS']),
  ]),
)(process)

