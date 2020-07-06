/* eslint-disable fp/no-unused-expression */ 
import {
  __,
  apply,
  bind,
  compose,
  curry,
  pipe,
  tap,
} from 'ramda'


const applyMiddleware = (federatedOptions, server) => pipe(
  server => bind(server.applyMiddleware, server),
  compose(
    tap,
    apply(__, [federatedOptions]), 
  )
)(server) 

export default curry(applyMiddleware)
