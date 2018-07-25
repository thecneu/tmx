import React, { Component } from 'react';
import { get, find } from '../api';
import './home.css';

class Home extends Component {
  state = {
    trailers: []
  }

  componentDidMount() {
    get('trailers').then(({ data }) => this.setState({ trailers: data }));
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const q = e.currentTarget.q.value;

    const results = await find({ title: q });
    this.setState({ searcH: q, trailers: results })
  }

  render() {
    const { trailers } = this.state;

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

        <section>
          {trailers.map(trailer => (
            <div key={trailer._id} className="tile">
              { console.log(trailer) }
              <img alt={trailer.title} src={`https://img.youtube.com/vi/${trailer.youtubeId}/hqdefault.jpg`} className="tile-image" />
              <a href={trailer.videoUrl} className="tile-content">
                <h2 className="title">{trailer.title}</h2>
                <h3>{trailer.type}</h3>
                <p>{trailer.year}</p>
              </a>
            </div>
          ))}
        </section>
      </main>
    );
  }
}

export default Home;
