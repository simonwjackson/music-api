import { ApolloServer, gql } from 'apollo-server'
const { buildFederatedSchema } = require('@apollo/federation')
const fetch = require('node-fetch')
const storage = require('node-persist') 
const {
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql') 
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date')

const { httpRequest } = require('../../utils') 
import { concat, pathEq, ascend, descend, when, take, map, complement, isNil,mergeLeft, pathSatisfies, sort, filter, startsWith, nth, path } from 'ramda'
import { log, promisify } from 'util'
import ytdl from 'ytdl-core' 
import ytplCB from 'ytpl' 

const ytpl = promisify(ytplCB)
const notNil = complement(isNil)
const notStartsWith = complement(startsWith)

const onlyAudio = list =>
  list
    |> filter(pathSatisfies(startsWith('audio/'), ['mimeType']), #)

const getYoutubeItem = async youtubeItem =>
  youtubeItem
    |> path(['url_simple'], #)
    |> ytdl.getInfo(#, {
      quality: 'highestaudio',
      filter: 'audioonly'
    })
    |> await #
    |> mergeLeft(youtubeItem, #)

// |> path(['formats'], #)
// |> onlyAudio(#)

const port = 30004

storage.init({
  dir: './db',
  // logging: (...args) => console.log(...args),
})

let memo = {}

const typeDefs = gql`
	scalar Date

  enum Order {
    ASC
    DESC
  }

  input SortBy {
    field: String!
    order: Order!
  }

	extend type Query {
		youtubePlaylist(id: ID!): YoutubePlaylist
  } 

	type YoutubePlaylist @key(fields: "id") {
    id: ID!
    url: ID!
    title: String
    visibility: String
    description: String
    total_items: Int
    views: Int
    last_updated: String
    items: [YoutubeItem]
  }

	type YoutubeItem @key(fields: "id") {
    id: ID!
    url: ID!  
    url_simple: ID!
    title: String
    thumbnail: String
    duration: String
    formats(type: String limit: Int sort: SortBy): [YoutubeMedia]
	}

  type YoutubeMedia {
    mimeType: String
    qualityLabel: String
    bitrate: Int
    audioBitrate: Int
    url: ID!
    lastModified: String
    quality: String
    projectionType: String
    averageBitrate: Int
    audioQuality: String
    approxDurationMs: String
    audioSampleRate: String
    audioChannels: Int
    container: String
    codecs: String
  } 
` 

const resolvers = {
  Query: {
    youtubePlaylist: async (parent, args, ctx, info) => 
      args.id
      |> when(notStartsWith('https://'), id => concat('https://www.youtube.com/playlist?list=', id), #)
      |> ytpl(#)
  },

  YoutubeItem: {
    formats: async (parent, args, ctx, info) => {
      return parent
        |> path(['formats'], #)
        |> when(
          () => pathSatisfies(notNil, ['type'], args),
          filter(pathSatisfies(startsWith(path(['type'], args) + '/'), ['mimeType'])),
          #
        )
        |> when(
          () => pathSatisfies(notNil, ['limit'], args),
          take(path(['limit'], args)),
          #
        )
        |> when(
          () => pathSatisfies(notNil, ['sort', 'order'], args),
          list => {
            const field = path(['sort', 'field'], args)

            if (pathEq(['sort', 'order'], 'DESC', args)) 
              return sort(descend(path([field])), list)
        
            return sort(ascend(path([field])), list) 
          },
          #
        )
    }
  },

  YoutubePlaylist: {
    __resolveReference: async (ref) => ytpl(ref.id),

    items: async (parent, args, ctx, info) => {
      return parent
        |> path(['items'], #)
        |> map(getYoutubeItem, #)
    },
  },
}

export default {
  schema: buildFederatedSchema({ typeDefs, resolvers })
}
