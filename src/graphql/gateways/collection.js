import { buildFederatedSchema } from '@apollo/federation'
import { gql } from 'apollo-server'

export const typeDefs = gql`
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
    collections: () => 
      collections 
  }
}

export default { schema: buildFederatedSchema({ typeDefs, resolvers }) }
