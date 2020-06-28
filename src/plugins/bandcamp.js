// TODO: Write bandcamp regex
// TODO: Write google html fetcher

import {
  pipe,
  // find,
  // map,
  // mergeDeepLeft,
  // nth,
  // omit,
  // path,
  // pick,
  // split,
  tail,
  // test,
  // trim,
  // zipObj
} from 'ramda'

// import {
//   renameKey,
//   whenFound
// } from 'utils'

const linkRegEx = /<div class=\\"r\\"><a href=\\"(https:\/\/.+?.bandcamp.com\/album\/.+?)\\" onmousedown/g

// const titleToAlbumArtist = obj =>
//   obj
//     |> path(['title'], #)
//     |> split('|', #)
//     |> map(trim, #)
//     |> zipObj(['artist', 'album'], #)
//     |> mergeDeepLeft(obj, #)
//     |> omit(['title'], #)
//     |> renameKey('link', 'url', #)
//
// const mapBandcampItem = item =>
//   item
//     |> pick(['title', 'link'], #)
//     |> titleToAlbumArtist(#)
//
// const isBandcampLink = entry =>
//   entry
//     |> path(['link'], #)
//     |> test(/\.bandcamp\.com\/album\//, #)

export const bandcamp = html => 
  pipe(
    linkRegEx.exec,
    tail
  )(html)

// |> path(['organic_results'], #)
// |> find(isBandcampLink, #)
// |> whenFound(mapBandcampItem, #)
