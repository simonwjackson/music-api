// TODO: youtube sometimes returns null
import googleIt from 'google-it'
import Bottleneck from 'bottleneck'
import { promisify } from 'util'
import { tap, applySpec, pathEq, ascend, descend, when, take, map, complement, isNil,mergeLeft, pathSatisfies, sort, filter, startsWith, nth, path } from 'ramda'
import { join } from 'path'
import fs from 'fs'
import { ApolloServer, gql } from 'apollo-server'
import { bandcamp } from '../../plugins/bandcamp'
import { youtube } from '../../plugins/youtube'
const { buildFederatedSchema } = require('@apollo/federation')
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

const { httpRequest, logger, whenFound } = require('../../utils') 

const port = 30005 
storage.init({
  dir: './googler',
  // logging: (...args) => console.log(...args),
})
const readFile = promisify(fs.readFile)

const plugins = {
  // bandcamp,
  youtube
} 

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 30 * 1000
}) 

const limitedGoogler = async (...args) => {
  const cache = await storage.getItem(args[0].query)
  if (cache) {
    console.log('grabbing cache')
    return cache
  }

  return limiter.wrap(googleIt)(...args)
    |> await #
    |> path(['body'], #)
    |> tap(html => storage.setItem(args[0].query, html), #) 
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
    albumGoogler: async (parent, args, ctx, info) => {
      return limitedGoogler({
        query: args.query,
        returnHtmlBody: true
      })
       |> await #
       |> applySpec(plugins)(#)
    }
  },

  GoogleAlbumResult: {
    youtube: async ({ youtube }) => whenFound(map(id => ({ id })), youtube)
  }
}

export default {
  schema: buildFederatedSchema({ typeDefs, resolvers })
}
