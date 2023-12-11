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
  Share,
} from "react-native";
import { useEffect, useState } from "react";
import {
  millisToMinutesAndSeconds,
  useSpotifyAuth,
  useSpotifyTracks,
} from "../../utils";
import { Themes } from "../../assets/Themes";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";

import useProfileInfo from "../../utils/useProfileInfo";
import useSpotifyArtists from "../../utils/useSpotifyArtists";
import useSpotifyRecs from "../../utils/useSpotifyRecs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Ionicons from "@expo/vector-icons/Ionicons";

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

  const tracks = useSpotifyTracks(token);
  useEffect(() => {
    if (tracks) {
      let seed_tracks =
        tracks[0].songId + "," + tracks[1].songId + "," + tracks[2].songId;
      AsyncStorage.setItem("seedTracks", seed_tracks);
    }
  }, [tracks]);
  const profile = useProfileInfo(token);

  const artistsList = useSpotifyArtists(token);
  useEffect(() => {
    if (artistsList) {
      let seed_artists =
        artistsList[0].artistId + "," + artistsList[1].artistId;
      AsyncStorage.setItem("seedArtists", seed_artists);
    }
  }, [artistsList]);

  const [time_duration, setTime] = useState(null);

  const getArtists = (artists) => {
    const arr = [];
    for (let i = 0; i < artists.length; i++) {
      arr.push(artists[i].name);
    }
    return arr.join(", ");
  };

  // for debugging sharing
  const website = "open.spotify.com/user/" + profile.id;

  // const downloadAndShare = async (url) => {
  //   try {
  //     const { uri } = await FileSystem.downloadAsync(
  //       url,
  //       FileSystem.documentDirectory + profile.externalUrl // Replace 'filename.ext' with your file's name and extension
  //     );
  //     await Sharing.shareAsync(uri);
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  // const onShare = async () => {
  //   if (await Sharing.isAvailableAsync()) {
  //     await Sharing.shareAsync(website);
  //   } else {
  //     alert("Sharing not enabled.");
  //   }
  // };

  const onShare = async () => {
    const message = `I'm sharing my Spotify profile using ✨Spotify For You✨!\n\n${website}`;
    try {
      const result = await Share.share({
        // message: website,
        message: message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const shareButton = () => {
    return (
      <Pressable onPress={onShare} style={styles.shareButton}>
        {/* <Image
          source={require("../../assets/shareIcon.png")}
          style={{ width: windowWidth * 0.05, height: windowWidth * 0.05 }}
        /> */}
        {({ pressed }) => (
          <Ionicons
            name="share"
            color={pressed ? "green" : "black"}
            size={30}
          />
        )}
      </Pressable>
    );
  };

  const MyPressableButton = () => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "darkblue" : "blue",
          },
          styles.button,
        ]}
        onPress={() => console.log("Pressed!")}
      >
        {({ pressed }) => (
          <Text style={styles.text}>{pressed ? "Pressed!" : "Press Me"}</Text>
        )}
      </Pressable>
    );
  };

  return tracks && profile && artistsList ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ url: profile.profilePic }}
        />
        <Text style={styles.headerText}>{profile.displayName}</Text>
        <View style={styles.shareButton}>{shareButton()}</View>
      </View>
      <View style={styles.topSongsContainer}>
        <Text style={styles.topSongsHeader}>Top Songs</Text>
      </View>

      <View style={styles.trackContainer}>
        <FlatList
          data={tracks}
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
      <View style={styles.topSongsContainer}>
        <Text style={styles.topSongsHeader}>Top Artists</Text>
      </View>
      <View style={styles.artistContainer}>
        <FlatList
          horizontal={true}
          data={artistsList}
          renderItem={({ item }) => (
            <View style={styles.artistInfo}>
              <View style={styles.artist}>
                <Image
                  style={styles.artistImage}
                  source={{ uri: item.artistPic }}
                ></Image>
                <Text style={styles.artistNames}> {item.artistName}</Text>
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
    justifyContent: "space-evenly",
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: Themes.colors.spotify,
    width: windowWidth * 0.65,
    height: windowWidth * 0.1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: windowWidth * 0.04,
  },
  logo: {
    width: windowWidth * 0.075,
    height: windowWidth * 0.075,
  },
  trackContainer: {
    padding: windowWidth * 0.025,
    alignItems: "center",
    justifyContent: "center",
    //flex: 0,
    width: "100%",
  },
  header: {
    width: windowWidth,
    height: windowWidth * 0.2,
    padding: windowWidth * 0.04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    //flex: 0.5,
  },
  profileImage: {
    paddingLeft: windowWidth * 0.05,
    width: windowWidth * 0.13,
    height: windowWidth * 0.13,
    borderRadius: 75,
  },
  shareButton: {
    paddingLeft: windowWidth * 0.03,
    borderRadius: 75,
  },
  shareContainer: {
    width: windowWidth * 0.13,
    height: windowWidth * 0.13,
  },
  headerText: {
    fontWeight: "bold",
    color: "black",
    fontSize: windowWidth * 0.09,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: windowWidth * 0.05,
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
  // links: {
  //   width: "100%",
  //   justifyContent: "100%",
  // },
  topSongsContainer: {
    alignSelf: "flex-start",
    paddingLeft: windowWidth * 0.05,
  },
  topSongsHeader: {
    fontSize: windowWidth * 0.07,
    color: "green",
    fontWeight: "bold",
  },
  artistContainer: {
    padding: windowWidth * 0.025,
    alignItems: "center",
    justifyContent: "center",
    //flex: 0,
    width: "100%",
  },
  artistInfo: {
    flexDirection: "col",
    //width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    //padding: windowWidth * 0.0025,
  },
  artistPhoto: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: 75,
    //padding: windowWidth * 0.5,
  },
  artistNames: {
    color: "black",
    padding: windowWidth * 0.025,
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
  },
  artistImage: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    borderRadius: 50,
    //padding: windowWidth * 0.8,
  },
  artist: {
    padding: windowWidth * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
});
