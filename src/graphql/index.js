import { ApolloGateway } from '@apollo/gateway'
import { ApolloServer } from 'apollo-server-express' 
import express from 'express'
import basicAuth from 'express-basic-auth'
import process from 'process'
import { path } from 'ramda'

import * as gateways from './gateways' 
import { shouldChallenge } from './utils'

const port = path(['env', 'PORT'], process) || 4000
const app = express()

const createGateway = gateways => 
  new ApolloGateway({
    serviceList: Object.entries(gateways) 
      .map(([key, val]) => {
      /* eslint-disable-next-line fp/no-unused-expression */
        (new ApolloServer(val)).applyMiddleware({
          app,
          path: `/${key}`, 
        }) 

        return {
          name: key,
          url: `http://localhost:${port}/${key}`, 
        }
      }), 
  })

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: false,
  }, 
  gateway: createGateway(gateways),
  subscriptions: false,
})

if (shouldChallenge(process)) 
  /* eslint-disable-next-line fp/no-unused-expression */
  app.use(basicAuth({
    users: { [path(['env', 'HTTP_USER'], process)]: path(['env', 'HTTP_PASS'], process) },
    challenge: true,
  }))

/* eslint-disable-next-line fp/no-unused-expression */
server.applyMiddleware({
  app,
  path: '/', 
})

/* eslint-disable-next-line fp/no-unused-expression */
app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
)
