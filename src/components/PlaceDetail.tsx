import React from 'react';
import {Image, Pressable, Share, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {PrimaryButton} from './PrimaryButton';
import {ScreenScroll} from './ScreenScroll';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {Place} from '../types/app';

type Props = {
  place: Place;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
};

export function PlaceDetail({place, saved, onBack, onToggleSave}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  async function share() {
    await Share.share({
      message: `${place.name}\n${place.address}\n${place.description}`,
    });
  }

  return (
    <ScreenScroll contentStyle={[styles.content, compact && styles.contentCompact]}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backHit}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Pressable onPress={onToggleSave} style={styles.iconButton}>
          <Text style={styles.saveIcon}>{saved ? '🔖' : '♡'}</Text>
        </Pressable>
      </View>

      <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
        <Image source={place.image} resizeMode="cover" style={styles.image} />
        <View style={styles.imageShade} />
      </View>

      <View style={[styles.body, compact && styles.bodyCompact]}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{place.name}</Text>
        <Text style={[styles.address, compact && styles.addressCompact]}>📍 {place.address}</Text>
        <View style={[styles.meta, compact && styles.metaCompact]}>
          <Text style={styles.metaText}>⭐ {place.rating.toFixed(1)}</Text>
          <Text style={styles.metaText}>⌁ {place.distance} from hotel</Text>
        </View>
        <Text style={[styles.description, compact && styles.descriptionCompact]}>{place.description}</Text>
        <PrimaryButton label={saved ? '🔖 Saved' : '🔖 Save Location'} onPress={onToggleSave} variant={saved ? 'outline' : 'filled'} />
        <Pressable onPress={share} style={[styles.shareButton, compact && styles.shareButtonCompact]}>
          <Text style={styles.shareText}>🔗 Share</Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 36,
  },
  contentCompact: {
    paddingTop: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backHit: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  back: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 38,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    color: colors.gold,
    fontSize: 20,
  },
  body: {
    paddingTop: 18,
  },
  bodyCompact: {
    paddingTop: 12,
  },
  imageWrap: {
    marginTop: 18,
    height: 178,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  imageWrapCompact: {
    marginTop: 10,
    height: 136,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 25,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 22,
  },
  address: {
    marginTop: 12,
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  addressCompact: {
    marginTop: 8,
    fontSize: 11,
  },
  meta: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 22,
  },
  metaCompact: {
    gap: 12,
    marginTop: 14,
  },
  metaText: {
    color: colors.textSoft,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  description: {
    marginTop: 16,
    marginBottom: 24,
    color: colors.textSoft,
    fontFamily: typography.sans,
    fontSize: 14,
    lineHeight: 25,
  },
  descriptionCompact: {
    marginTop: 12,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 22,
  },
  shareButton: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonCompact: {
    marginTop: 10,
    minHeight: 42,
  },
  shareText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 14,
    fontWeight: '900',
  },
});
