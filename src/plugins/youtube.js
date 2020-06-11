import { when, tail, nth, match, tap, pathEq, test, map, trim, zipObj, mergeDeepLeft, omit, pick, split, find, path } from 'ramda'
import { whenFound, logger, renameKey } from '../utils'

// const linkRegEx = /mu(s)ic/gm
const linkRegEx = /<a href="(https:\/\/music.youtube.com\/playlist\?.+?)&amp;feature=gws_kp_album.+?" /g

// const titleToAlbumArtist = obj =>
//   obj
//     |> path(['title'], #)
//     |> split('|', #)
//     |> map(trim, #)
//     |> zipObj(['artist', 'album'], #)
//     |> mergeDeepLeft(obj, #)
//     |> omit(['title'], #)
//     |> renameKey('link', 'url', #)

// const createResultObj = payload => item =>
// item

// |> pick(['title', 'link'], #)
// |> titleToAlbumArtist(#)

// const isYoutubeKG = entry =>
//   entry
//     |> pathEq(['name'], 'YouTube Music', #)
//
export const youtube = html =>
  html
    |> linkRegEx.exec(#)
    |> whenFound(tail, #)
    // |> path(['knowledge_graph', 'available_on'], #)
    // |> find(isYoutubeKG, #)
    // |> whenFound(createResultObj(payload), #)
