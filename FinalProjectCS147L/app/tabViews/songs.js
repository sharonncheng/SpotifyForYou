import {
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import {
  millisToMinutesAndSeconds,
  useSpotifyAuth,
  useSpotifyTracks,
} from "../../utils";
import useSpotifyRecs from "../../utils/useSpotifyRecs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;

export default function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    fetchToken();
  }, []);
  const recs = useSpotifyRecs(token);
  //const recs = true;
  const [time_duration, setTime] = useState(null);
  let content_displayed;

  const getArtists = (artists) => {
    const arr = [];
    for (let i = 0; i < artists.length; i++) {
      arr.push(artists[i].name);
    }
    return arr.join(", ");
  };

  return recs ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Songs For You</Text>
      </View>
      <View style={styles.trackContainer}>
        <FlatList
          data={recs}
          renderItem={({ item, index }) => (
            <View style={styles.trackInfo}>
              <View style={styles.trackInfo}>
                <Image
                  style={styles.albumCovers}
                  source={{ uri: item.imageUrl }}
                ></Image>
                <View style={styles.trackArtistAndTitle}>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {item.songTitle}
                  </Text>
                  <Text style={styles.trackArtists} numberOfLines={1}>
                    {getArtists(item.songArtists)}
                  </Text>
                </View>

                <Text style={styles.trackAlbum} numberOfLines={1}>
                  {item.albumName}
                </Text>
                <Text style={styles.trackDuration}>
                  {millisToMinutesAndSeconds(item.duration)}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  ) : (
    <View>
      <Text>Loading info...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    //justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  header: {
    width: "100%",
    alignItems: "center",
    padding: windowWidth * 0.04,
  },
  headerText: {
    fontSize: windowWidth * 0.09,
    fontWeight: "bold",
    color: "green",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  trackContainer: {
    padding: windowWidth * 0.025,
    alignItems: "center",
    justifyContent: "center",
    //flex: 0,
    width: "100%",
  },
  trackInfo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: windowWidth * 0.0025,
  },
  trackArtistAndTitle: {
    width: "35%",
    alignContent: "center",
    justifyContent: "center",
    padding: windowWidth * 0.01,
  },
  trackTitle: {
    color: "black",
    fontSize: windowWidth * 0.035,
  },
  trackIndex: {
    padding: windowWidth * 0.045,
  },
  trackArtists: {
    color: "black",
    fontSize: windowWidth * 0.03,
    //padding: windowWidth * 0.025,
  },
  trackAlbum: {
    color: "black",
    width: "28%",
    padding: windowWidth * 0.025,
    fontSize: windowWidth * 0.035,
  },
  trackDuration: {
    color: "black",
    width: "10%",
    fontSize: windowWidth * 0.035,
  },
  albumCovers: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    resizeMode: "contain",
  },
});
