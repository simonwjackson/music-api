import { mapFrom, logger } from '../../utils'
const { ApolloServer, gql } = require('apollo-server') 
const { map, path, pick } = require('ramda')
const { buildFederatedSchema } = require('@apollo/federation')
const fetch = require('node-fetch')
const { MusicBrainzApi } = require('musicbrainz-api')
const Bottleneck = require('bottleneck')
const storage = require('node-persist')

const init = async () => {
  await storage.init({
    dir: './musicbrainz.cache'
  })
}
init()
// await storage.setItem('name','yourname')

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000
})

const mbApi = new MusicBrainzApi({
  appName: 'album-collector',
  appVersion: '0.1.0',
  appContactInfo: 'simon@simonwjackson.com'
})

const port = 30002

const typeDefs = gql`
  type MusicBrainzArtist @key(fields: "id") {
		id: ID!  
		name: String!
  }

	type MusicBrainzReleaseGroup @key(fields: "id") {
		id: ID!
		title: String
    releases: [MusicBrainzRelease]
	}

	type MusicBrainzRelease @key(fields: "id") {
		id: ID!
		country: String
		quality: String
		barcode: String
		date: String
		status: String
		disambiguation: String
		title: String
		packaging: String
		media: [Media]
		relations: [Relation]
    artists: [MusicBrainzArtist]
	}

	type Media {
		trackOffset: Int
		position: Int
		trackCount: Int
		format: String
		title: String
		tracks: [Track]
	}

	type Recording @key(fields: "id") {
		id: ID!  
		relations: [Relation]
  }

	type Track { 
		length: Int 
		title: String
		position: Int
    recording: Recording
	}

	type Relation { 
    direction: String
    type: String
    url: Resource
	}

	type Resource @key(fields: "id") {
    id: String
    resource: String
	}

	extend type Query {
		musicBrainzRelease(id: ID!): MusicBrainzRelease
		musicBrainzReleases(query: String): [MusicBrainzRelease]
	}
`

const resolvers = {
  Track: {
    recording: (track) => {
      return limiter.schedule(() => mbApi.getRecording(track.recording.id, [
        'artists',
        'releases',
        // 'recordings',
        'artists',
        'artist-credits',
        'isrcs',
        'url-rels',
        'release-groups',
        'aliases',
        'discids',
        'annotation',
        'media',
        'area-rels',
        'artist-rels',
        'event-rels',
        'instrument-rels',
        'label-rels',
        'place-rels',
        'recording-rels',
        'release-rels',
        'release-group-rels',
        'series-rels',
        'url-rels',
        'work-rels' 
      ]).then(r => {
        console.log(r)
        return r
      }))
    }
  },

  MusicBrainzRelease: {
    __resolveReference: async (ref) => {
      return limiter.schedule(() => mbApi.getRelease(ref.id, [
        'artists',
        // 'releases',
        'recordings',
        'artists',
        'artist-credits',
        'isrcs',
        'url-rels',
        'release-groups',
        'aliases',
        'discids',
        'annotation',
        'media',
        'area-rels',
        'artist-rels',
        'event-rels',
        'instrument-rels',
        'label-rels',
        'place-rels',
        'recording-rels',
        'release-rels',
        'release-group-rels',
        'series-rels',
        'url-rels',
        'work-rels' 
      ]).then(r => {
        // console.log(r.media[0].tracks)
        return r
      }))
    },

    artists: async (parent, args, ctx, info) => {
      return parent
       |> path(['artist-credit'], #)
       |> map(path(['artist']), #)
    }, 
  },

  // ReleaseGroup: {
  //   __resolveReference: async (ref) => {
  //     const res = await limiter.schedule(() => mbApi.getReleaseGroup(ref.id, ['releases']));
  //
  //     return {
  //       ...pick(['id', 'title'], res),
  //       releases: res.releases.map(r => r.id)
  //     }
  //   },
  //
  //   releases: async (releaseGroup) => {
  //     return limiter.schedule(() => {
  //       const all = releaseGroup.releases.map(id => mbApi.getRelease(id, ['recordings', 'media']));
  //       return Promise.all(all)
  //     })
  //   }
  // },

  Query: {
    musicBrainzRelease: async (a,s,d,f) => {
      console.log(s.id)

      return mbApi.getRelease(s.id, [
        'artists',
        // 'recordings',
        // 'artists',
        // 'artist-credits',
        // 'isrcs',
        // 'url-rels',
        // 'release-groups',
        // 'aliases',
        // 'discids',
        // 'annotation',
        // 'media',
        // 'area-rels',
        // 'artist-rels',
        // 'event-rels',
        // 'instrument-rels',
        // 'label-rels',
        // 'place-rels',
        // 'recording-rels',
        // 'release-rels',
        // 'release-group-rels',
        // 'series-rels',
        // 'url-rels',
        // 'work-rels'
      ])
      |> await #
      |> logger(#)
    }, 
    musicBrainzReleases: async (a,s) => {
      return mbApi.searchReleaseGroup(s.query)
        |> await #
        |> path(['release-groups'], #)
    }
  }
}

export default {
  schema: buildFederatedSchema({ typeDefs, resolvers })
}
