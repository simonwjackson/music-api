import {
  pipe,
  tail
  // find,
  // map,
  // match,
  // mergeDeepLeft,
  // nth,
  // omit,
  // path,
  // pathEq,
  // pick,
  // split,
  // tap,
  // test,
  // trim,
  // when,
  // zipObj
} from 'ramda'
import {
  // logger,
  // renameKey,
  whenFound 
} from 'utils'

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


const execRegex = regex => data =>
  regex.exec(data)


/**
 * @param {string} html - The HTML to parse
 * @return {string|null} A url
 */

export const youtube = html => 
  pipe(
    execRegex(linkRegEx),
    whenFound(tail),
  )(html)

// |> path(['knowledge_graph', 'available_on'], #)
// |> find(isYoutubeKG, #)
// |> whenFound(createResultObj(payload), #)
