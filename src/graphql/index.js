const { ApolloServer } = require('apollo-server')
const { ApolloGateway } = require('@apollo/gateway')

const port = 30000

const gateway = new ApolloGateway({
  serviceList: [
    {
      name: 'collections',
      url: 'http://localhost:30001'
    },
    {
      name: 'musicbrainz',
      url: 'http://localhost:30002'
    },
    {
      name: 'bandcamp',
      url: 'http://localhost:30003'
    },
    {
      name: 'youtube',
      url: 'http://localhost:30004'
    },
    {
      name: 'albumGoogler',
      url: 'http://localhost:30005'
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

server.listen({ port }).then(({ url }) => {
  console.log(`Collection server ready at ${url}`)
})
