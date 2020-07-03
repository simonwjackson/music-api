import { ApolloServer } from 'apollo-server-express'
import { construct } from 'ramda'

/**
 * @returns {ApolloServer}
 */
const createServer = construct(ApolloServer)

export default createServer
