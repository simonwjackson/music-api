const { ApolloServer, gql } = require('apollo-server')
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

const port = 30003

storage.init({
  dir: './db',
  // logging: (...args) => console.log(...args),
})

let memo = {}

const getBandcampMetaData = async (url) => {
  if (memo[url]) return memo[url]

  const data = await httpRequest(url)

  const BandData = new Function('return ' + (/var BandData = ([\s\S]*?)};/).exec(data)[1] + '}')()
  const EmbedData = new Function('return ' + (/var EmbedData = ([\s\S]*?)};/).exec(data)[1] + '}')()
  const TralbumData = new Function('return ' + (/var TralbumData = ([\s\S]*?)};/).exec(data)[1] + '}')()

  memo[url] = ({
    BandData,
    EmbedData,
    TralbumData
  }) 

  return memo[url]
}

const typeDefs = gql`
	scalar Date
  union Result = BandcampArtist | BandcampAlbum

	extend type Query {
		bandcampArtist: BandcampArtist
    bandcampArtists(query: String!): [BandcampArtist]
		bandcampAlbum(albumUrl: String): BandcampAlbum 
    bandcampAlbums(query: String!): [BandcampArtist]
		bandcampTracks: [BandcampTrack]
  } 

	type BandcampArtist {
    id: ID!
    url: ID!
		name: String
		albums: [BandcampAlbum]
	}

	type BandcampAlbum @key(fields: "albumUrl") {
    albumUrl: ID!
		name: String
    tracks: [BandcampTrack]
	}

  type BandcampAudioFile {
    url: ID!
    encoding: String
    bitrate: Int
  }

	type BandcampTrack @key(fields: "trackId") {
		title: String
		file: BandcampAudioFile
		track: Int
    duration: Int
    trackId: ID!
	}
` 

const resolvers = {
  Query: {
    bandcampArtist: async (parent, args, ctx, info) => {
      return {
        name: data.BandData.name,
      }
    },

    bandcampArtists: async (parent, args, ctx, info) => {
      const url = `https://bandcamp.com/api/fuzzysearch/1/autocomplete?q=${args.query}`
      const data = await httpRequest(url).then(JSON.parse)
      return data.auto.results
        .filter(r => r.type === 'b')
        .filter(r => !r.is_label)
    },

    bandcampAlbum: async (parent, args, ctx, info) => {
      const data = await getBandcampMetaData(args.albumUrl)

      return {
        albumUrl: args.albumUrl,
        name: data.EmbedData.album_title,
        tracks: data.TralbumData.trackinfo
      }
    },

    bandcampAlbums: async (parent, args, ctx, info) => {
      const url = `https://bandcamp.com/api/fuzzysearch/1/autocomplete?q=${args.query}`
      const data = await httpRequest(url).then(JSON.parse)
      return data.auto.results
        .filter(r => r.type === 'a')
        .filter(r => !r.is_label)
    },

  },

  BandcampArtist: {
    albums(parent, args, ctx, info) { 
      return [
        {
          name: 'I AM ALBIM' 
        }
      ]
    }
  },

  BandcampAlbum: {
    tracks : async (parent, args, ctx, info) => { 
      return parent.tracks.map(item => ({
        track: item.track_num,
        duration: parseInt(item.duration),
        trackId: item.track_id,
        title: item.title,
        file: {
          url: item.file['mp3-128'],
          bitrate: 128,
          encoding: 'mp3'
        },
      }))
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema({ typeDefs, resolvers })
})

server.listen({ port }).then(({ url }) => {
  console.log(`Bandcamp server ready at ${url}`)
})
