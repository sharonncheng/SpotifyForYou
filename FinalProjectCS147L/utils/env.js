import { Platform } from "react-native";

// ***** TODO: Fill in your constants here ***** //
const CLIENT_ID = "d4de8d26c3924f9b905648c689af67ef";
const REDIRECT_URI = "exp://10.31.227.246:19000"; // TODO: Replace this with your own redirect URI
const ALBUM_ID = "2nLOHgzXzwFEpl62zAgCEC?si=Vy8vkAwuT-GJ_nEKsoo2DA"; // By default, this is the Weeknd's album "DAWN FM"
// ********************************************* //

const redirectUri = (uri) => {
  if (!uri) {
    const err = new Error(
      "No redirect URI provided.\nPlease provide a redirect URI in env.js.\n You can find the file in utils/env.js."
    );
    console.error(err);
    alert(err);
  }
  return Platform.OS === "web" ? "http://localhost:19006/" : uri;
};

const ENV = {
  CLIENT_ID: CLIENT_ID,
  SCOPES: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ],
  REDIRECT_URI: redirectUri(REDIRECT_URI),
  ALBUM_ID: ALBUM_ID,
  SPOTIFY_API: {
    // Endpoints for auth & token flow
    DISCOVERY: {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
    // ***** TODO: Fill this in ***** //
    TOP_TRACKS_API:
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5",
    // ***** TODO: Or fill this in ***** //
    ALBUM_TRACK_API_GETTER: (albumId) => "https://api.spotify.com/v1/TODO",
    PROFILE_INFO: "https://api.spotify.com/v1/me",
    TOP_ARTISTS_API:
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10",
    RECOMMENDATIONS:
      "https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA&limit=50",
  },
};

const getEnv = () => ENV;
export default getEnv;
// ^ use this type of exporting to ensure compliance with webpack and expo-web
