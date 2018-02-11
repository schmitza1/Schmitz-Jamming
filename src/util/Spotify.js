let accessToken;
const clientID = '1c395d3fb76e4a6c9623209a49ff6f35';
const redirectURI = 'http://ordinary-burn.surge.sh';

export const Spotify = {
  getAccessToken() {
		if(accessToken) {
			return accessToken;
		}

		const returnedToken = window.location.href.match(/access_token=([^&]*)/);
		const returnedExpiration = window.location.href.match(/expires_in=([^&]*)/);

		if( returnedToken && returnedExpiration ) {
			accessToken = returnedToken[1];
			const expirationTime = returnedExpiration[1];

			window.setTimeout(() => accessToken = '', expirationTime * 1000);
			window.history.pushState('Access Token', null, '/');

			return accessToken;
		} else {
			window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURI
		}
	},

  search(term) {
    const accessToken = Spotify.getAccessToken();
		return fetch('https://api.spotify.com/v1/search?type=track&q=' + term, {
			headers: {Authorization: 'Bearer ' + accessToken}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			if (jsonResponse.tracks) {
				return jsonResponse.tracks.items.map(track => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}));
			} else {
				return [];
			}
		});
  },

  savePlaylist(playlistName, trackURIs){
    if (!(playlistName || trackURIs)) {
      return;
    }

    let accessToken = Spotify.getAccessToken();
    let headers = { Authorization: `Bearer ${accessToken}` };
    let userID;
    let playlistID;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userID = jsonResponse.id;
      return fetch('https://api.spotify.com/v1/users/'+ userID + '/playlists', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: playlistName })
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        playlistID = jsonResponse.id;
        return fetch('https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks', {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackURIs })
        })
      });
    });
  }
};
