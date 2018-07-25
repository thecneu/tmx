import _ from 'lodash';
import React, { Component } from 'react';
import { get, find } from '../api';
import './home.css';

const sort = (data) => {
  return Object.entries(_.groupBy(data, (trailer) => trailer.title)).map(([title, trailers]) => ({ title, year: trailers[0].year, trailers }))
}

class Home extends Component {
  state = {
    trailers: [],
    movies: []
  }

  componentDidMount() {
    get('trailers').then(({ data }) => this.setState({ trailers: data, movies: sort(data) }));
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const q = e.currentTarget.q.value;

    const results = await find({ title: q });
    this.setState({ search: q, trailers: results, movies: sort(results) })
  }

  calculateTime(time) {
    if (time.length) {
      const [ min, sec ] = time.split(':');
      return 60 * min + parseInt(sec);
    }

    return 0;
  }

  render() {
    const { trailers, movies } = this.state;

    return (
      <main>
        <header>
          <h1>Trailer Music</h1>
          <div>
            <form onSubmit={this.onSubmit}>
              <input name="q" type="text" />
              <button type="submit">Go</button>
            </form>
          </div>
        </header>

        <hr />

        <section style={{ display: 'none' }}>
          {trailers.map(trailer => (
            <div key={trailer._id} className="tile">
              {/* console.log(trailer) */}
              <div style={{ overflow: 'hidden' }}>
              <img alt={trailer.title} src={`https://img.youtube.com/vi/${trailer.youtubeId}/hqdefault.jpg`} className="tile-image" />
              <h2 className="title">{trailer.title} - <small>{trailer.year}</small></h2>
              <h3>{trailer.type}</h3>
              </div>
              {trailer.cues.length > 0 &&
                <ul>
                  {trailer.cues.map(cue =>
                    <li>
                      {cue.artist} - {cue.title} <a href={`${trailer.videoUrl}&t=${this.calculateTime(cue.time)}s`} target="_blank">View Trailer</a>
                    </li>
                  )}
                </ul>
              }
            </div>
          ))}
        </section>

        <section>
          {movies.map(movie => (
            <div key={movie.title} className="tile">
              {/* console.log(movies) */}
              <h2 className="title">{movie.title} - <small>{movie.year}</small></h2>
              {movie.trailers.map(trailer => (
                <div key={trailer._id}>
                  <div style={{ overflow: 'hidden' }}>
                    <img alt={trailer.title} src={`https://img.youtube.com/vi/${trailer.youtubeId}/hqdefault.jpg`} className="tile-image" />
                    <h3>
                      <a href={trailer.videoUrl} target="_blank">{trailer.type}</a>
                    </h3>
                  </div>

                  {trailer.cues.length > 0 &&
                    <ul>
                      {trailer.cues.map(cue =>
                        <li>
                          {cue.artist} - {cue.title} <a href={`${trailer.videoUrl}&t=${this.calculateTime(cue.time)}s`} target="_blank">View Trailer</a>
                        </li>
                      )}
                    </ul>
                  }
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>
    );
  }
}

export default Home;
