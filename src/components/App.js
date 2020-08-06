import React from 'react';
// import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, CardColumns, CardGroup } from 'react-bootstrap';

import './App.css';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import TrendingMovie from './TrendingMovie';

const logo = require ('../img/aftercredits_logo.png');

const API_TOKEN = `c25f9f42d55390cd41a66a8e8db8d4f9`;
const BASE_URL = `https://api.themoviedb.org/3`;

class App extends React.Component {
  constructor () {
    super ();
    this.state = {
      currentSearchResults: [],
      trendingMovies: [],
      allTrendingMovies: []
    }
    this.onSearch = this.onSearch.bind (this);
  }

  onSearch (str) {
    if (str) {
      str = str.replace (/\s\(([^\)]+)\)/g, '');
      fetch (`${BASE_URL}/search/movie?api_key=${API_TOKEN}&query=${str}`)
        .then (res => res.json ())
        .then (res => {
          const arr = [];
          for (let i = 0; i < Math.min (3, res.results.length); i++) {
            arr.push ({
              title: res.results [i].title,
              id: res.results [i].id,
              releaseDate: res.results [i].release_date,
              poster: res.results [i].poster_path,
              backdrop: res.results [i].backdrop_path,
              voteAverage: res.results [i].vote_average,
              overview: res.results [i].overview
            });
          }
          this.setState ({
            currentSearchResults: arr
          });
        });
    } else {
      this.setState ({
        currentSearchResults: []
      })
    }
  }

  componentDidMount () {
    fetch (`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_TOKEN}`)
      .then (res => res.json ())
      .then (res => {
        const arr = [];
        for (let i = 0; i < 6; i++) {
          console.log (res.results [i]);
          arr.push ({
            title: res.results [i].title,
            id: res.results [i].id,
            releaseDate: res.results [i].release_date,
            poster: res.results [i].poster_path,
            backdrop: res.results [i].backdrop_path,
            voteAverage: res.results [i].vote_average,
            overview: res.results [i].overview
          });
        }
        this.setState ({
          allTrendingMovies: res.results
        });
        this.setState ({
          trendingMovies: arr
        });
      });
  }

  render () {
    const { currentSearchResults, trendingMovies, allTrendingMovies } = this.state;
    return (
      <Container style = {{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}>
      <div className = "content">
        <Container style = {{
          textAlign: 'center'
        }}>
          <br/>
          {/* <h1>AfterCredits</h1> */}
          <img className = "logo" src = {logo}/>
          <br/>
          <h4 style = {{textAlign: 'left'}}>Search</h4>
          <SearchBar onSearch = { this.onSearch } suggestions = {allTrendingMovies.map (movie => `${movie.title} (${new Date (movie.release_date).getFullYear ()})`)}/>
          {
            currentSearchResults.map (result => <SearchResult
              { ...result }
              key = {result.id}
            />)
          }
          <br/>
        </Container>
        <br/>
        <Container>
          <h5>Trending Movies</h5>
          <CardGroup>
            {
              trendingMovies.map (result => <TrendingMovie
                { ...result }
                key = {result.id}
              />)
            }
          </CardGroup>
          
        </Container>
      </div>
      <br/>
      <footer className = "footer">
          <span style = {{paddingRight: '1em', fontSize: '.8em', color: 'grey'}}>This product uses the TMDb API but is not endorsed or certified by TMDb.</span>
          <img alt = "tmdb icon" width = "48px" src = {process.env.PUBLIC_URL + "/tmdb_icon.png"}></img>
      </footer>
      </Container>
    );
  }
}
export default App;
