import {
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  View,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Tabs, Stack, Redirect } from "expo-router";
import React, { useCallback, useState, useEffect } from "react";
import { useSpotifyAuth } from "../utils";
import { Themes } from "../assets/Themes";
import { colors } from "../assets/Themes/colors";
import images from "../assets/Images/images";
import useProfileInfo from "../utils/useProfileInfo";
import HomeLayout from "./tabViews/_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function MainScreen() {
  const { token, getSpotifyAuth } = useSpotifyAuth();
  const profile = useProfileInfo(token);

  useEffect(() => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
    }
  }, [token]);

  const SpotifyAuthButton = () => (
    <Pressable onPress={() => getSpotifyAuth()}>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>CONNECT WITH SPOTIFY</Text>
      </View>
    </Pressable>
  );

  const LoginScreen = () => (
    <View style={styles.container}>
      <View style={styles.appInfoContainer}>
        <Text style={styles.spotifyText}>Spotify</Text>
        <Text style={styles.forYouText}>✨ For You ✨</Text>
        <Image source={images.spotify} style={styles.spotifyIcon} />
        <Text style={styles.subtitleText}>Dedicated to you and your</Text>
        <Text style={styles.subtitleText}>personalized Spotify experience</Text>
      </View>
      <View style={styles.loginContainer}>
        <SpotifyAuthButton />
      </View>
    </View>
  );

  let contentDisplayed;
  if (token) {
    contentDisplayed = <Redirect href="tabViews/profile"></Redirect>;
  } else {
    contentDisplayed = <LoginScreen />;
  }

  return (
    // <SafeAreaView style={styles.container}>{contentDisplayed}</SafeAreaView>
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "black",
          },
        }}
      />
      <SafeAreaView style={styles.container}>{contentDisplayed}</SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Themes.colors.background,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    //flex: 1,
    minHeight: "100%",
  },
  appInfoContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    // flex: 2,
    height: windowHeight * 0.4,
  },
  loginContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // flex: 1,
    height: windowHeight * 0.3,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "green",
    height: 45,
    borderRadius: 20,
    width: windowWidth * 0.55,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: windowWidth * 0.55,
    margin: 2,
    backgroundColor: "green",
    borderRadius: 25,
  },
  spotifyText: {
    fontSize: 45,
    color: "green",
    fontWeight: "bold",
    padding: 3,
  },
  forYouText: {
    fontSize: 32,
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",
    padding: 3,
  },
  spotifyIcon: {
    height: windowWidth * 0.15,
    width: windowWidth * 0.15,
    marginTop: 15,
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    padding: 2,
  },
  titleText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 2,
  },
  subtitleText: {
    color: "black",
    fontSize: 18,
    fontStyle: "italic",
  },
});
