import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {Place} from '../types/app';

type Props = {
  place: Place;
  saved: boolean;
  compact?: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
};

const categoryLabels = {
  waterfront: 'WATERFRONT',
  parks: 'PARKS',
  landmarks: 'LANDMARKS',
};

export function PlaceCard({place, saved, compact = false, onOpen, onToggleSave}: Props): React.JSX.Element {
  const badgeStyle = [
    styles.badge,
    place.category === 'parks' && styles.badgeGreen,
    place.category === 'landmarks' && styles.badgePurple,
  ];

  return (
    <Pressable onPress={onOpen} style={[styles.card, compact && styles.compactCard]}>
      <View style={compact ? styles.compactMediaWrap : styles.mediaWrap}>
        <Image source={place.image} resizeMode="cover" style={styles.image} />
        <View style={styles.shade} />
        {!compact ? (
          <>
            <View style={badgeStyle}>
              <Text style={styles.badgeText}>{categoryLabels[place.category]}</Text>
            </View>
            <Pressable
              onPress={event => {
                event.stopPropagation();
                onToggleSave();
              }}
              style={styles.bookmark}>
              <Text style={[styles.bookmarkText, saved && styles.bookmarkSaved]}>{saved ? '🔖' : '♡'}</Text>
            </Pressable>
          </>
        ) : null}
      </View>
      <View style={[styles.copy, compact && styles.compactCopy]}>
        {compact ? (
          <View style={[badgeStyle, styles.compactInlineBadge]}>
            <Text style={[styles.badgeText, styles.compactBadgeText]}>{categoryLabels[place.category]}</Text>
          </View>
        ) : null}
        <Text style={[styles.name, compact && styles.compactName]} numberOfLines={compact ? 2 : 2}>
          {place.name}
        </Text>
        <View style={[styles.meta, compact && styles.compactMeta]}>
          <Text style={styles.metaText}>📍 {place.distance}</Text>
          <Text style={styles.metaText}>⭐ {place.rating.toFixed(1)}</Text>
        </View>
        {!compact ? (
          <Text style={styles.description} numberOfLines={2}>
            {place.description}
          </Text>
        ) : null}
      </View>
      {compact ? (
        <Pressable
          onPress={event => {
            event.stopPropagation();
            onToggleSave();
          }}
          style={styles.compactFavorite}>
          <Text style={[styles.compactFavoriteText, saved && styles.bookmarkSaved]}>{saved ? '🔖' : '♡'}</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    overflow: 'hidden',
    marginBottom: 14,
  },
  compactCard: {
    flexDirection: 'row',
    minHeight: 104,
  },
  mediaWrap: {
    height: 156,
    backgroundColor: colors.panelStrong,
  },
  compactMediaWrap: {
    width: 104,
    height: 104,
    backgroundColor: colors.panelStrong,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(73, 185, 232, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(101, 198, 236, 0.7)',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  compactInlineBadge: {
    position: 'relative',
    top: undefined,
    left: undefined,
    alignSelf: 'flex-start',
    minHeight: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 7,
  },
  badgeGreen: {
    backgroundColor: 'rgba(117, 202, 93, 0.22)',
    borderColor: 'rgba(117, 202, 93, 0.7)',
  },
  badgePurple: {
    backgroundColor: 'rgba(173, 103, 216, 0.2)',
    borderColor: 'rgba(173, 103, 216, 0.58)',
  },
  badgeText: {
    color: colors.blue,
    fontFamily: typography.sans,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bookmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkText: {
    color: colors.text,
    fontSize: 17,
  },
  bookmarkSaved: {
    color: colors.gold,
  },
  copy: {
    padding: 16,
  },
  compactCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 4,
  },
  name: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 18,
    fontWeight: '700',
  },
  compactName: {
    fontSize: 15,
  },
  compactBadgeText: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  compactMeta: {
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 6,
  },
  metaText: {
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  description: {
    marginTop: 16,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
    lineHeight: 19,
  },
  compactFavorite: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactFavoriteText: {
    color: colors.text,
    fontSize: 19,
  },
});
