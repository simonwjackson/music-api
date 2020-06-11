// TODO: Write bandcamp regex
// TODO: Write google html fetcher

import { tail, test, map, trim, zipObj, mergeDeepLeft, omit, nth, pick, split, find, path } from 'ramda'
import { whenFound, renameKey } from '../utils'

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
  html
    |> linkRegEx.exec(#) 
    |> tail(#)
    // |> path(['organic_results'], #)
    // |> find(isBandcampLink, #)
    // |> whenFound(mapBandcampItem, #)
