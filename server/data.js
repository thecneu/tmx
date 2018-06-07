const fs = require('fs')
const json = require('./data.json')
const _ = require('lodash')
const ObjectId = require('mongodb').ObjectId

const data = json.filter(trailer => trailer.Type)
const music = []
const trailers = []
const movies = []

data.forEach(trailer => {
  const id = trailer.Link.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)
  const obj =  {
    _id: new ObjectId(),
    title: trailer.Title,
    type: trailer.Type,
    year: trailer.Year,
    videoUrl: trailer.Link,
  }

  if (id) {
    obj.youtubeId = id[1]
  }

  const cues = ['C1', 'C2', 'C3'].map(cue => ({
      song: new ObjectId(),
      artist: trailer[`${cue}_artist`],
      time: trailer[`${cue}_time`],
      title: trailer[`${cue}_title`]
    })
  ).filter(cue => cue.artist)

  trailers.push({ ...obj, cues })
  music.push(...cues.map(cue => ({ _id: cue.song, artist: cue.artist, title: cue.title })))
  movies.push({ _id: new ObjectId, title: obj.title, year: obj.year })
})

// console.log(music)
// console.log(trailers)

// fs.writeFile('music.json', JSON.stringify(_.orderBy(music, ['artist'])), () => console.log('music done'))
fs.writeFile('trailers.json', JSON.stringify(_.orderBy(trailers, ['year', 'title', 'type'], ['desc'])), () => console.log('trailers done'))
