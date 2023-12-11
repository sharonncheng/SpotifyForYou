import { useState, useEffect } from "react";
import getEnv from "./env";

import { getMyTopTracks, getAlbumTracks } from "./apiOptions";

const { ALBUM_ID } = getEnv();

const useSpotifyTracks = (token) => {
  const [top_songs, setTop_songs] = useState(null);
  useEffect(() => {
    const getSongs = async () => {
      if (token) {
        try {
          const songs = await getMyTopTracks(token);
          setTop_songs(songs);
        } catch (error) {
          console.error("Error");
        }
      }
    };
    getSongs();
  }, [token]);
  return top_songs;
};

export default useSpotifyTracks;
