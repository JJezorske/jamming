const clientID = '79ef062407d24a658bc4386c3a643386';
const redirectURI = "https://stoic-nobel-dd6261.netlify.app/";
let accessToken;

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])
            //Use the following code to help you wipe the access token and URL parameters
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURI;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        const url = 'https://api.spotify.com/v1/search?type=track&q=' + term;
        return fetch(url, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userID = jsonResponse.id; 
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        })
    }
};

export default Spotify;