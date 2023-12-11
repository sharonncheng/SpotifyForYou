import { useState, useEffect } from "react";
import getEnv from "./env";

import { getMyTopArtists, getAlbumTracks } from "./apiOptions";

const { ALBUM_ID } = getEnv();

const useSpotifyArtists = (token) => {
  const [top_artists, setTop_artists] = useState(null);
  useEffect(() => {
    const getArtists = async () => {
      if (token) {
        try {
          const songs = await getMyTopArtists(token);
          //   console.log("in useSpotifyArtists.js file");
          //   console.log(songs);
          if (songs !== null) {
            setTop_artists(songs);
          }
        } catch (error) {
          console.error("Error");
        }
      }
    };
    getArtists();
  }, [token]);
  //console.log("end file");
  return top_artists;
};

export default useSpotifyArtists;
