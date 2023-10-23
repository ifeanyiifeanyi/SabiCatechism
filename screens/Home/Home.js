import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Fontisto } from "@expo/vector-icons";
import Carousel from "../../components/Carousel";
import { COLORS, SIZES } from "../../constants";
import Container from "../../components/Container";
import HeaderSection from "../../components/HeaderSection";
import SearchSection from "../../components/SearchSection";
import CategorySection from "../../components/CategorySection";
import LatestVideos from "../../components/videos/LatestVideos";

const Home = ({ navigation }) => {
  // const user = useSelector((state) => state.user);
  // console.log("check if user details was persisted with user details", user.userDetails);
  // console.log("check if user details was persisted with user", user.user.created_at);

  return (
    <Container>
      <HeaderSection onPress={() => navigation.navigate("Profile")} />
      <SearchSection />
      <ScrollView>
        <CategorySection />
        <Carousel />
        <LatestVideos />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Home;
