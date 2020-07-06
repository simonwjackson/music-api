import { buildFederatedSchema } from '@apollo/federation'
import { gql } from 'apollo-server'
import permissions from 'graphql/permissions'
import storage from 'node-persist' 
import {
  andThen,
  ascend,
  complement,
  concat,
  descend,
  filter,
  isNil,
  map,
  mergeLeft,
  path,
  pathEq,
  pathSatisfies,
  pipe,
  sort,
  startsWith,
  take,
  when 
} from 'ramda'
import { promisify } from 'util'
import ytdl from 'ytdl-core' 
import ytplCB from 'ytpl' 

const ytpl = promisify(ytplCB)
const notNil = complement(isNil)
const notStartsWith = complement(startsWith)

// const onlyAudio = list =>
//   list
//     |> filter(pathSatisfies(startsWith('audio/'), ['mimeType']), #)

const getYoutubeItem = youtubeItem => 
  pipe(
    path(['url_simple']),
    url => 
      ytdl.getInfo(url, {
        quality: 'highestaudio',
        filter: 'audioonly'
      }),
    andThen(mergeLeft(youtubeItem))
  )(youtubeItem)

// |> path(['formats'], #)
// |> onlyAudio(#)

/* eslint-disable-next-line fp/no-unused-expression */
storage.init({
  dir: './db',
  // logging: (...args) => console.log(...args),
})

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
    youtubePlaylist: (parent, args, ctx) => pipe(
      when(
        notStartsWith('https://'),
        id => 
          concat('https://www.youtube.com/playlist?list=', id)
      ),
      ytpl
    )(args.id)
  },

  YoutubeItem: {
    formats: (parent, args) => 
      pipe(
        path(['formats']),
        when(
          () => 
            pathSatisfies(notNil, ['type'], args),
          filter(pathSatisfies(startsWith(path(['type'], args) + '/'), ['mimeType'])),
        ),
        when(
          () => pathSatisfies(notNil, ['limit'], args), 
          // @ts-ignore
          take(path(['limit'], args)), 
        ),
        when(
          () => 
            pathSatisfies(notNil, ['sort', 'order'], args),
          list => {
            const field = path(['sort', 'field'], args)

            if (pathEq(['sort', 'order'], 'DESC', args)) 
              return sort(descend(path([field])), list)
        
            return sort(ascend(path([field])), list) 
          },
        )
      )(parent)
  },

  YoutubePlaylist: {
    /** @type {(ref: {id: string}) => Promise<string>} */
    __resolveReference: async ref => 
      ytpl(ref.id),

    /** @type {(parent: object) => [*]} */
    // @ts-ignore
    items: pipe(
      path(['items']),
      map(getYoutubeItem),
    )
  },
}

export default { 
  permissions,
  schema: buildFederatedSchema({ typeDefs, resolvers }) 
}
