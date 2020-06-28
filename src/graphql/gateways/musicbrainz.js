import { buildFederatedSchema }  from '@apollo/federation'
import { gql } from 'apollo-server' 
import Bottleneck  from 'bottleneck'
import { MusicBrainzApi } from 'musicbrainz-api'
import storage from 'node-persist'
import {
  andThen,
  map,
  path,
  pipe,
} from 'ramda'

/* eslint-disable-next-line fp/no-nil */
const init = async () => 
  await storage.init({ dir: './musicbrainz.cache' })

/* eslint-disable-next-line fp/no-unused-expression, fp/no-nil */
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
    recording: track => 
      limiter.schedule(() => 
        mbApi.getRecording(track.recording.id, [
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
        ]).then(r => 
          r))
  },

  MusicBrainzRelease: {
    __resolveReference: async ref => 
      limiter.schedule(() => 
        mbApi.getRelease(ref.id, [
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
        ]).then(r => 
        // console.log(r.media[0].tracks)
          r
        )),

    artists: parent => 
      pipe(
        path(['artist-credit']),
        map(path(['artist'])), 
      )(parent)
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
    musicBrainzRelease: async (a, s) => 
      mbApi.getRelease(s.id, [
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
      ]),

    musicBrainzReleases: async (a, s) => 
      pipe(
        mbApi.searchReleaseGroup,
        andThen(path(['release-groups']))
      )(s.query)
  }
}

export default { schema: buildFederatedSchema({ typeDefs, resolvers }) }
