import React, { Dispatch, useState, JSX, useEffect } from "react";
import {
  LayoutChangeEvent,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const defaultLayout: LayoutRectangle = {
  x: 0,
  y: 0,
  height: 0,
  width: 0,
};
interface IProps {
  style?: AnimatedStyle;
  onLayout?: (e: LayoutChangeEvent) => void;
  children: JSX.Element;
}

const Header = (props: IProps) => {
  const { style, onLayout, children } = props;

  return (
    <Animated.View style={[styles.header, style]} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
};

const Contents = (props: IProps) => {
  const { children } = props;

  return <View style={styles.item}>{children}</View>;
};

export default function HomeScreen() {
  const [firstHeaderLayout, setFirstHeaderLayout] =
    useState<LayoutRectangle>(defaultLayout);
  const [secondHeaderLayout, setSecondHeaderLayout] =
    useState<LayoutRectangle>(defaultLayout);
  const [thirdHeaderLayout, setThirdHeaderLayout] =
    useState<LayoutRectangle>(defaultLayout);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    console.log(firstHeaderLayout.y);
  }, []);

  const firstHeaderAnimatedStyle = useAnimatedStyle(
    () => ({
      display: scrollY.value > firstHeaderLayout.y ? "flex" : "none",
    }),
    [firstHeaderLayout],
  );

  const secondHeaderAnimatedStyle = useAnimatedStyle(
    () => ({
      display:
        scrollY.value + firstHeaderLayout.height > secondHeaderLayout.y
          ? "flex"
          : "none",
    }),
    [firstHeaderLayout, secondHeaderLayout],
  );

  const thirdHeaderAnimatedStyle = useAnimatedStyle(
    () => ({
      display:
        scrollY.value + firstHeaderLayout.height + secondHeaderLayout.height >
        thirdHeaderLayout.y
          ? "flex"
          : "none",
    }),
    [firstHeaderLayout, secondHeaderLayout],
  );

  const handleLayout =
    (setter: Dispatch<React.SetStateAction<LayoutRectangle>>) =>
    (e: LayoutChangeEvent) => {
      setter(e.nativeEvent.layout);
    };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  };

  return (
    <SafeAreaView>
      <View>
        <ScrollView onScroll={handleScroll}>
          <Contents>
            <Text>zero contents</Text>
          </Contents>

          <Header onLayout={handleLayout(setFirstHeaderLayout)}>
            <Text>first header</Text>
          </Header>

          <Contents>
            <Text>first contents</Text>
          </Contents>

          <Header onLayout={handleLayout(setSecondHeaderLayout)}>
            <Text>second header</Text>
          </Header>

          <Contents>
            <Text>second contents</Text>
          </Contents>

          <Header onLayout={handleLayout(setThirdHeaderLayout)}>
            <Text>third header</Text>
          </Header>

          <Contents>
            <Text>third contents</Text>
          </Contents>

          <Header>
            <Text>forth header</Text>
          </Header>

          <Contents>
            <Text>forth contents</Text>
          </Contents>
        </ScrollView>

        <View style={styles.stickyHeader}>
          <Header style={firstHeaderAnimatedStyle}>
            <Text>first header</Text>
          </Header>

          <Header style={secondHeaderAnimatedStyle}>
            <Text>second header</Text>
          </Header>

          <Header style={thirdHeaderAnimatedStyle}>
            <Text>third header</Text>
          </Header>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#D3D3D3",
  },
  item: {
    width: "100%",
    backgroundColor: "#AEC6CF",
    height: 500,
  },
  stickyHeader: {
    position: "absolute",
    width: "100%",
  },
});
