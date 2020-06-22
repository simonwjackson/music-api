import express from 'express'
import { ApolloServer } from 'apollo-server-express' 
import { ApolloGateway } from '@apollo/gateway'
import * as gateways from './gateways' 

const port = 4000
const app = express()

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

server.applyMiddleware({ app, path: '/' })

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
