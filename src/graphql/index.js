import express from 'express'
import { ApolloServer } from 'apollo-server-express' 
import { ApolloGateway } from '@apollo/gateway'

import collections from './gateways/collection'
import musicbrainz from './gateways/musicbrainz'
import bandcamp from './gateways/bandcamp'
import youtube from './gateways/youtube'
import albumGoogler from './gateways/albumGoogler'

const port = 30000
const app = express()

const gateways = {
  musicbrainz,
  collections,
  bandcamp,
  youtube,
  albumGoogler
}

Object.entries(gateways).map(([key, val]) => {
  (new ApolloServer(val)).applyMiddleware({ app, path: `/${key}` }) 
})

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'collections',
      url: 'http://localhost:30000/collections'
    },
    {
      name: 'musicbrainz',
      url: 'http://localhost:30000/musicbrainz'
    },
    {
      name: 'bandcamp',
      url: 'http://localhost:30000/bandcamp'
    },
    {
      name: 'youtube',
      url: 'http://localhost:30000/youtube'
    },
    {
      name: 'albumGoogler',
      url: 'http://localhost:30000/albumGoogler'
    },
  ]
})

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: false
  }, 
  gateway,
  subscriptions: false
})

server.applyMiddleware({ app, path: '/api/graphql' })

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
