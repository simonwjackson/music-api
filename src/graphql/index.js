import process from 'process'
import express from 'express'
import { ApolloServer } from 'apollo-server-express' 
import { ApolloGateway } from '@apollo/gateway'
import * as gateways from './gateways' 
import { anyPass, pathSatisfies, complement, isEmpty, isNil, allPass, path, pathOr } from 'ramda'
import basicAuth from 'express-basic-auth'

const port = pathOr(4000, ['env','PORT'], process)
const app = express()
const notEmpty = complement(isEmpty)
const notNil = complement(isNil)
const notFalsy = anyPass([
  notEmpty,
  notNil
])

const shouldChallenge = process =>
  process
    |> path(['env'], #)
    |> allPass([
      pathSatisfies(notFalsy, ['HTTP_USER']),
      pathSatisfies(notFalsy, ['HTTP_PASS'])
    ])(#)

const createGateway = (gateways) => new ApolloGateway({
  serviceList: Object.entries(gateways)
    .map(([key, val]) => {
      (new ApolloServer(val)).applyMiddleware({ app, path: `/${key}` }) 

      return {
        name: key,
        url: `http://localhost:${port}/${key}` 
      }
    })
})

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: false
  }, 
  gateway: createGateway(gateways),
  subscriptions: false
})

if (shouldChallenge(process))
  app.use(basicAuth({
    users: {
      [path(['env','HTTP_USER'], process)]: path(['env', 'HTTP_PASS'], process)
    },
    challenge: true,
  }))

server.applyMiddleware({ app, path: '/' })

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
