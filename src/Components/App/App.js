import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults:[],
      playlistName: 'New Playlist',
      playlistTracks: [],
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
    let currentTracks = this.state.playlistTracks;

    if (!(currentTracks.includes(track))) {
      currentTracks.push(track);

      this.setState({ playlistTracks: currentTracks });
    } else {
      alert("This track is already in your playlist");
    }
  }

  removeTrack(track) {
    let currentTracks = this.state.playlistTracks;

    currentTracks = currentTracks.filter(element => element.id !== track.id);
    this.setState({ playlistTracks: currentTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  search(term) {
    console.log("Search term is: " + term);
    Spotify.search(term).then(results => {
      this.setState({ searchResults: results })
    });
  }

render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}  />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onClick={this.props.onSave} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
