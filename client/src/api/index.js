import axios from 'axios'
import _ from 'lodash'

const config = {
  mongoUrl: 'mongodb://<dbuser>:<dbpassword>@ds044907.mlab.com:44907/trailermusic',
  apiKey: 'y4AgaX-AawKMzllgISU9Ff-7j5J1ydDW',
  rootUrl: 'https://api.mlab.com/api/1',
  collection: '/databases/{database}/collections/{collection}',
  db: 'trailermusic'
}

export const get = (collection, query = '') => {
  return axios.get(`${config.rootUrl}/databases/${config.db}/collections/${collection}?apiKey=${config.apiKey}${query ? `&q=${JSON.stringify(query)}` : ''}`)
}

export const find = async (query) => {
  const { data: trailers } = await get('trailers');
  return trailers.filter(trailer => {
    const keys = Object.keys(query);
    return keys.some(key => {
      var regex = new RegExp(query[key], 'i');
      const cues = trailer.cues.some(cue => regex.test(cue[key]));
      return cues || regex.test(trailer[key])
    });
  })
}

/*
  eslint:ignore:max-len
  q=<query> - restrict results by the specified JSON query
  c=true - return the result count for this query
  f=<set of fields> - specify the set of fields to include or exclude in each document (1 - i; 0 - ex)
  fo=true - return a single document from the result set (same as findOne() using the mongo shell
  s=<sort order> - specify the order in which to sort each specified field (1- ascending; -1 - descending)
  sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
  l=<limit> - specify the limit for the number of results (default is 1000)
*/
