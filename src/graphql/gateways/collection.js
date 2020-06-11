const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')
const fetch = require('node-fetch')

const port = 30001

const typeDefs = gql`
  type Collection {
    id: ID!
    releases: [MusicBrainzRelease]
  }

  extend type MusicBrainzRelease @key(fields: "id") {
    id: ID! @external
  } 

  extend type Query {
    collections: [Collection]
  }
`

const collections = [
  { id: 'aieskchsd', releases: [{ id: '6fde285d-07ff-4173-83df-d946afeb99e8' }] }
]

const resolvers = {
  // Collection: {
  //   ReleaseGroups: (collection) => {
  //     return collection.releaseGroups
  //   },
  // },
  Query: {
    collections: () => collections 
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs, resolvers })
})

server.listen({ port }).then(({ url }) => {
  console.log(`Collection server ready at ${url}`)
})
