import {
  construct,
  path,
  pipe
} from 'ramda' 

const createGateway = pipe(
  require,
  path(['ApolloGateway']),
  construct
)('@apollo/gateway')

export default createGateway
