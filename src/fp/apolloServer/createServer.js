import {
  construct,
  path,
  pipe
} from 'ramda'

const createServer = pipe(
  require,
  path(['ApolloServer']),
  construct
)('apollo-server-express')

export default createServer
