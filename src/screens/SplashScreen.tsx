import React from 'react';
import {ImageBackground, StatusBar, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {images} from '../assets';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

export function SplashScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const logoWidth = Math.min(width * (compact ? 0.72 : 0.74), compact ? 270 : 304);
  const logoPadding = compact ? 18 : 24;
  const logoNameSize = Math.min(compact ? 36 : 41, Math.max(30, (logoWidth - logoPadding * 2) / 6.25));
  const logoSublineSize = compact ? 12 : 14;

  return (
    <ImageBackground source={images.splashBackground} resizeMode="cover" style={styles.root}>
      <StatusBar hidden />
      <View style={[styles.logoWrap, compact && styles.logoWrapCompact, {width: logoWidth, paddingHorizontal: logoPadding}]}>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[styles.logoName, {fontSize: logoNameSize}]}>
          RiverRock
        </Text>
        <View style={styles.logoDivider} />
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[styles.logoSubline, compact && styles.logoSublineCompact, {fontSize: logoSublineSize}]}>
          GUEST ACCESS
        </Text>
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
    maxWidth: 304,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapCompact: {
    maxWidth: 250,
    borderRadius: 20,
  },
  logoName: {
    color: colors.gold,
    fontFamily: typography.serif,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
  },
  logoDivider: {
    width: '100%',
    height: 1,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: colors.gold,
    opacity: 0.72,
  },
  logoSubline: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontWeight: '900',
    letterSpacing: 3.2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  logoSublineCompact: {
    letterSpacing: 2.4,
  },
});
