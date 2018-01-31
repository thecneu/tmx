const fs = require('fs')
const json = require('./trailers.json')
const _ = require('lodash')

const data = json.filter(trailer => trailer.Type)
const music = []
const trailers = []

data.forEach(trailer => {
  const obj =  {
    _id: trailer.Title,
    title: trailer.Title,
    type: trailer.Type,
    year: trailer.Year,
    videoUrl: trailer.Link
  }

  const cues = ['C1', 'C2', 'C3'].map(cue => ({
      artist: trailer[`${cue}_artist`],
      time: trailer[`${cue}_time`],
      title: trailer[`${cue}_title`]
    })
  )

  trailers.push({ ...obj, cues })
  music.push(...cues.filter(cue => cue.artist))
})

// console.log(music)
// console.log(trailers)

fs.writeFile('music.json', JSON.stringify(_.orderBy(music, ['artist'])), () => console.log('done'))