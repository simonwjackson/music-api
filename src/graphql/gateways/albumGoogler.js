// TODO: youtube sometimes returns null
import { buildFederatedSchema } from '@apollo/federation'
import { gql } from 'apollo-server'
import Bottleneck from 'bottleneck'
import googleIt from 'google-it'
import storage from 'node-persist' 
// import { bandcamp } from 'plugins/bandcamp'
import { youtube } from 'plugins/youtube'
import {
  andThen,
  applySpec,
  // ascend,
  // complement,
  // descend,
  // filter,
  // isNil,
  map,
  // mergeLeft,
  // nth,
  path,
  pipe, 
  // pathEq,
  // pathSatisfies,
  // sort,
  // startsWith,
  // take,
  tap,
  // when
} from 'ramda'
import { whenFound } from 'utils' 

/* eslint-disable-next-line fp/no-unused-expression */
storage.init({
  dir: './googler',
  // logging: (...args) => console.log(...args),
})

const plugins = {
  // bandcamp,
  youtube
} 

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 30 * 1000
}) 

/* eslint-disable-next-line fp/no-rest-parameters */
const limitedGoogler = async (...args) => {
  const cache = await storage.getItem(args[0].query)
  if (cache) return cache

  return pipe(
    limiter.wrap(googleIt),
    andThen(path(['body'])),
    andThen(tap(html => 
      storage.setItem(args[0].query, html))) 
  )(...args)
}

const typeDefs = gql`
	scalar Date

	extend type Query {
		albumGoogler(query: String!): GoogleAlbumResult
  } 

  type GoogleAlbumResult {
    youtube: [YoutubePlaylist]
  }

  extend type YoutubePlaylist @key(fields: "id") {
    id: ID! @external
  }
` 

const resolvers = {
  Query: {
    albumGoogler: async (parent, args) => 
      pipe(
        limitedGoogler,
        andThen(applySpec(plugins))
      )({
        query: args.query,
        returnHtmlBody: true
      })
  },

  GoogleAlbumResult: {
    youtube: async ({ youtube }) => 
      whenFound(map(id => 
        ({ id })), youtube)
  }
}

export default { schema: buildFederatedSchema({ typeDefs, resolvers }) }
