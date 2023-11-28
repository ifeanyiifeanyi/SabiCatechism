import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Container from "../../components/Container";
import { COLORS, SIZES } from "../../constants";
import { DarkBgColors, LightBgColors } from "../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useVideosSelector } from "../../components/videosSelector";

// Separate VideoPlayer component
const VideoPlayer = ({ videoUri }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const playVideoWithDelay = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the delay as needed
      await playVideo();
      setIsLoading(false);
    };

    playVideoWithDelay();
  }, []);

  const playVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={"green"} size={"large"} />
      ) : (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode="cover"
          useNativeControls
        />
      )}
    </View>
  );
};

export default function PlayVideo() {
  const route = useRoute();
  const { video } = route.params;
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const backButtonSize = 44;
  const backButtonMargin = 30;
  const backButtonTop = Platform.OS === "ios" ? 50 : backButtonMargin;
  const theme = useSelector((state) => state.theme);
  const navigation = useNavigation();

  // get all videos so we can find videos with the same category
  const videos = useVideosSelector();

  useEffect(() => {
    playVideo();
  }, []);

  const playVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  // video details components (for tab)
  const VideoDetails = () => {
    return (
      <View style={styles.tabContainer}>
        <View style={styles.detailsContainer}>
          <Text
            style={[
              styles.title,
              {
                color:
                  theme === "light" ? DarkBgColors.text : LightBgColors.text, fontSize: 35
              },
            ]}
          >
            {video?.title}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color:
                  theme === "light" ? DarkBgColors.text : LightBgColors.text,
              },
            ]}
          >
            {video?.long_description}
          </Text>
          <Text
            style={[
              styles.category,
              {
                color:
                  theme === "light" ? DarkBgColors.moon : LightBgColors.text,
              },
            ]}
          >
            {video?.catName}
          </Text>
        </View>
      </View>
    );
  };

  // related views components (for tab)
  const RelatedVideos = () => {
    const handlePress = (item) => {
      navigation.navigate("PlayVideo", { video: item });
    };

    return (
      <FlatList
        data={videos.filter((v) => v?.catName === video?.catName)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={styles.videoItem1}
          >
            <ImageBackground
              source={{ uri: `https://api.coinstarr.org/${item.thumbnail}` }}
              style={styles.thumbnail1}
              resizeMode="cover"
              imageStyle={styles.imageBackground1}
            >
              <View
                style={[
                  styles.overlay1,
                  {
                    backgroundColor:
                      theme === "light"
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                  },
                ]}
              >
                <Text style={[styles.videoTitle1, {color:
  theme === "light" ? LightBgColors.text : DarkBgColors.text,fontWeight: 'bold'}]}>{item.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        numColumns={3}
      />
    );
  };

  // set values for the tab starts //
  const initialLayout = { width: SIZES.width };
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "details", title: "Details" },
    { key: "related", title: "Related" },
  ]);
  const renderScene = SceneMap({
    details: VideoDetails,
    related: RelatedVideos,
  });
  // tab component itself
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.primary }}
      style={{
        backgroundColor:
          theme === "light" ? LightBgColors.headings : DarkBgColors.text,
      }}
      labelStyle={{
        color: theme === "light" ? DarkBgColors.text : LightBgColors.text,
      }}
    />
  );
  // set values for the tab ends //

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
          marginVertical: 10,
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="keyboard-arrow-left"
            size={backButtonSize}
            color={theme === "light" ? DarkBgColors.text : LightBgColors.text}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: theme === "light" ? DarkBgColors.text : LightBgColors.text,
            fontSize: 24,
          }}
        >
          {video?.title}
        </Text>
      </View>

      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{ uri: `https://api.coinstarr.org/${video?.video}` }}
          style={styles.video}
          resizeMode="cover"
          useNativeControls
        />
      </View>

      <View style={{ flex: 1, marginTop: 3 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9, // You can adjust the aspect ratio based on your video dimensions
  },
  controls: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
    marginTop: 30,
  },
  thumbnail: {
    width: 120,
    height: 100,
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  category: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
  },
  videoItem1: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  thumbnail1: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageBackground1: {
    borderRadius: 10,
  },
  overlay1: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 10,
  },
  videoTitle1: {
    color: "#FFF",
    fontSize: 12,
  },
});
