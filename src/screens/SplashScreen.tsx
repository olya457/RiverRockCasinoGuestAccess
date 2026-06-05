import React from 'react';
import {Image, ImageBackground, StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import {images} from '../assets';
import {colors} from '../theme/colors';

export function SplashScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  return (
    <ImageBackground source={images.splashBackground} resizeMode="cover" style={styles.root}>
      <StatusBar hidden />
      <View style={[styles.logoWrap, compact && styles.logoWrapCompact]}>
        <Image source={images.logo} resizeMode="contain" style={styles.logo} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  logoWrap: {
    width: '74%',
    maxWidth: 304,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.black,
  },
  logoWrapCompact: {
    width: '66%',
    maxWidth: 250,
    borderRadius: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
