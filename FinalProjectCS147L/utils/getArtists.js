const getArtists = (artists) => {
  const arr = [];
  for (let i = 0; i < artists.length; i++) {
    arr.push(artists.name);
  }
  return arr.join(", ");
};

export default getArtists;
