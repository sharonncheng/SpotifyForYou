import axios from "axios";
import getEnv from "./env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
//const [seedT, setSeedT] = useState("");
//const [seedA, setSeedA] = useState("");
/*
useEffect(() => {
  const fetchSeed = async () => {
    const seedTra = await AsyncStorage.getItem("seedTracks");
    const seedArt = await AsyncStorage.getItem("seedArtists");
    if (seedTra) {
      setSeedT(seedTra);
    }
    if (seedArt) {
      setSeedA(seedArt);
    }
  };
  fetchSeed();
}, []);
*/
const {
  SPOTIFY_API: {
    TOP_TRACKS_API,
    TOP_ARTISTS_API,
    ALBUM_TRACK_API_GETTER,
    PROFILE_INFO,
    RECOMMENDATIONS,
  },
} = getEnv();

const ERROR_ALERT = new Error(
  "Oh no! Something went wrong; probably a malformed request or a network error.\nCheck console for more details."
);

/* Pulls out the relevant data from the API response and puts it in a nicely structured object. */
const formatter = (data) =>
  data.map((val) => {
    const artists = val.artists?.map((artist) => ({ name: artist.name }));
    // console.log("start formatter");
    // console.log(val.artists);
    // console.log("endformatter");
    // returning undefined for now to not confuse students, ideally a fix would be a hosted version of this
    var info = {
      songTitle: val.name,
      songArtists: artists,
      albumName: val.album?.name,
      imageUrl: val.album?.images[0]?.url ?? undefined,
      duration: val.duration_ms,
      externalUrl: val.external_urls?.spotify ?? undefined,
      previewUrl: val.preview_url ?? undefined,
      songId: val.id ?? undefined,
    };
    return info;
  });

const profileFormatter = (data) => {
  //const images = data.images.url;
  var info = {
    displayName: data.data.display_name,
    username: data.data.id,
    profilePic: data.data.images[0].url,
    id: data.data.id,
  };
  //console.log(info);
  return info;
};

const artistsFormatter = (data) => {
  // Use the 'map' function to transform each item in the array
  return data.map((val) => {
    var info = {
      artistName: val.name,
      artistPic: val.images[0].url,
      artistId: val.id,
    };
    return info;
  });
};

const recFormatter = (data) => {
  return data.map((val) => {
    //console.log(val);
    const artists = val.artists?.map((artist) => ({ name: artist.name }));
    var info = {
      songTitle: val.name,
      songArtists: artists,
      albumName: val.album?.name,
      imageUrl: val.album?.images[0]?.url ?? undefined,
      duration: val.duration_ms,
      externalUrl: val.external_urls?.spotify ?? undefined,
      previewUrl: val.preview_url ?? undefined,
    };
    return info;
  });
};

/* Fetches data from the given endpoint URL with the access token provided. */
const fetcher = async (url, token) => {
  try {
    return await axios(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

/* Fetches your top tracks from the Spotify API.
 * Make sure that TOP_TRACKS_API is set correctly in env.js */
export const getMyTopTracks = async (token) => {
  try {
    let res = await fetcher(TOP_TRACKS_API, token);
    //console.log(formatter(res.data.items));
    return formatter(res.data?.items);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

export const getMyTopArtists = async (token) => {
  try {
    let res = await fetcher(TOP_ARTISTS_API, token);
    // console.log("this is getMyTopArtists at work");
    // console.log(artistsFormatter(res.data?.items));
    return artistsFormatter(res.data?.items);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

export const getMyProfile = async (token) => {
  try {
    let res = await fetcher(PROFILE_INFO, token);
    //console.log(res.data);
    return profileFormatter(res);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

/* Fetches the given album from the Spotify API.
 * Make sure that ALBUM_TRACK_API_GETTER is set correctly in env.js */
export const getAlbumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    return formatter(transformedResponse);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};
export const getRecs = async (token) => {
  try {
    //let url = RECOMMENDATIONS;
    //console.log("url test");
    //console.log(url);
    console.log(token);
    //console.log(RECOMMENDATIONS);
    let res = await fetcher(RECOMMENDATIONS, token);
    return recFormatter(res.data?.tracks);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};
