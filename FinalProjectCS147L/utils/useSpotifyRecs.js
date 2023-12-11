import { useState, useEffect } from "react";
import getEnv from "./env";

import { getRecs, getAlbumTracks } from "./apiOptions";

const { ALBUM_ID } = getEnv();

const useSpotifyRecs = (token) => {
  const [recs, setRecs] = useState(null);
  useEffect(() => {
    const getMyRecs = async () => {
      if (token) {
        try {
          const songs = await getRecs(token);
          //   console.log("in useSpotifyArtists.js file");
          //   console.log(songs);
          setRecs(songs);
        } catch (error) {
          console.error("Error");
        }
      }
    };
    getMyRecs();
  }, [token]);
  //console.log("end file");
  return recs;
};

export default useSpotifyRecs;
