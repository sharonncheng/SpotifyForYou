import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Dimensions,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";

const windowWidth = Dimensions.get("window").width;

export default function Page() {
  const [phrase, setPhrase] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const getSongSuggestions = async () => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Please suggest exactly 10 songs based on these words or phrases: "${phrase}". If there are no phrases, suggest random songs. In your response, provide a numbered list containing the song title and the song's artist (in that specific order) for each song without mentioning the words 'duration' or 'album' unless they are in the title of either. The list should be separated only by commas, and each item in the list should be the song and artist pairing. Please do not provide anything else in your response other than this list. Thanks.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      processResponse(data.choices[0].message.content);
      //processResponse(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const processResponse = (data) => {
    const extractedSongs = data.split(",");
    console.log(extractedSongs);
    setSuggestions(extractedSongs);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Song Genie</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.infoText}>
          Give AI Song Genie comma-separated phrases
        </Text>
        <Text style={styles.infoText}>
          and it will give you your song suggestions!
        </Text>

        <Text style={styles.exText}>Ex: packing motivation, Taylor Swift</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter phrases separated by comma."
          value={phrase}
          onChangeText={setPhrase}
        />
        <Pressable onPress={getSongSuggestions}>
          <View style={styles.goContainer}>
            <Text style={styles.textContained}>Go!</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.outputContainer}>
        <Text style={styles.response}>{suggestions}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //padding: 24,
    backgroundColor: "white",
    justifyContent: "flex-start",
  },
  main: {
    //flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    //marginHorizontal: "auto",
    width: "100%",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
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
  infoText: {
    color: "black",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "bold",
    padding: 3,
  },
  exText: {
    color: "gray",
    fontSize: 15,
    fontStyle: "italic",
    fontWeight: "bold",
    padding: 3,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  response: {
    fontSize: windowWidth * 0.04,
    //fontWeight: "bold",
    padding: windowWidth * 0.08,
  },
  goContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: windowWidth * 0.1,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
  },
  textContained: {
    color: "#007AFF",
    fontSize: windowWidth * 0.05,
  },
  input: {
    fontSize: windowWidth * 0.05,
    padding: windowWidth * 0.04,
    marginTop: 10,
  },
  outputContainer: {
    width: windowWidth * 0.9,
    // backgroundColor: "#f2f2f2",
    backgroundColor: "honeydew",
    borderRadius: 10,
  },
});
