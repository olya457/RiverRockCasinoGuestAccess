import React, {useState} from 'react';
import {Image, Pressable, Share, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {PlaceDetail} from '../components/PlaceDetail';
import {ScreenScroll} from '../components/ScreenScroll';
import {places} from '../data/places';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {Place} from '../types/app';
import {navBottomOffset, navHeight} from '../utils/layout';

type Props = {
  savedPlaceIds: string[];
  onToggleSave: (id: string) => void;
  onViewOnMap: (id: string) => void;
};

export function SavedScreen({savedPlaceIds, onToggleSave, onViewOnMap}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const [detailId, setDetailId] = useState<string | null>(null);
  const savedPlaces = places.filter(place => savedPlaceIds.includes(place.id));
  const selectedPlace = places.find(place => place.id === detailId);

  if (selectedPlace) {
    return (
      <PlaceDetail
        place={selectedPlace}
        saved={savedPlaceIds.includes(selectedPlace.id)}
        onBack={() => setDetailId(null)}
        onToggleSave={() => onToggleSave(selectedPlace.id)}
      />
    );
  }

  if (savedPlaces.length === 0) {
    return (
      <View style={[styles.empty, compact && styles.emptyCompact]}>
        <Text style={[styles.emptyIcon, compact && styles.emptyIconCompact]}>🔖</Text>
        <Text style={[styles.emptyTitle, compact && styles.emptyTitleCompact]}>No Saved Locations</Text>
        <Text style={[styles.emptyText, compact && styles.emptyTextCompact]}>
          Explore the City Guide tab and tap the bookmark icon on any location to save it here.
        </Text>
      </View>
    );
  }

  return (
    <ScreenScroll>
      <Text style={[styles.title, compact && styles.titleCompact]}>🔖 Saved Places</Text>
      <Text style={styles.subtitle}>{savedPlaces.length} locations saved</Text>
      <View style={styles.list}>
        {savedPlaces.map(place => (
          <SavedPlaceRow
            key={place.id}
            place={place}
            onOpen={() => setDetailId(place.id)}
            onDelete={() => onToggleSave(place.id)}
            onViewOnMap={() => onViewOnMap(place.id)}
            compact={compact}
          />
        ))}
      </View>
      <View style={styles.tip}>
        <Text style={styles.tipText}>💡 Ask our concierge team for personalized routes and transportation to any saved locations.</Text>
      </View>
    </ScreenScroll>
  );
}

type RowProps = {
  place: Place;
  onOpen: () => void;
  onDelete: () => void;
  onViewOnMap: () => void;
  compact: boolean;
};

function SavedPlaceRow({place, onOpen, onDelete, onViewOnMap, compact}: RowProps): React.JSX.Element {
  async function share() {
    await Share.share({
      message: `${place.name}\n${place.address}\n${place.description}`,
    });
  }

  return (
    <View style={[styles.savedCard, compact && styles.savedCardCompact]}>
      <Pressable onPress={onOpen} style={[styles.savedTop, compact && styles.savedTopCompact]}>
        <Image source={place.image} style={[styles.savedImage, compact && styles.savedImageCompact]} />
        <View style={[styles.savedCopy, compact && styles.savedCopyCompact]}>
          <Text style={[styles.savedName, compact && styles.savedNameCompact]} numberOfLines={2}>
            {place.name}
          </Text>
          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeText}>{place.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.savedMeta}>
            📍 {place.distance}   ⭐ {place.rating.toFixed(1)}
          </Text>
        </View>
        <Pressable
          onPress={event => {
            event.stopPropagation();
            onDelete();
          }}
          style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </Pressable>
      </Pressable>
      <View style={[styles.actions, compact && styles.actionsCompact]}>
        <Pressable onPress={share} style={styles.action}>
          <Text style={styles.actionText}>🔗 Share</Text>
        </Pressable>
        <View style={styles.actionDivider} />
        <Pressable onPress={onViewOnMap} style={styles.action}>
          <Text style={styles.actionText}>🗺️ View on Map</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 38,
    paddingBottom: navHeight + navBottomOffset,
  },
  emptyCompact: {
    paddingHorizontal: 26,
    paddingBottom: navHeight + navBottomOffset - 6,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: colors.line,
    textAlign: 'center',
    lineHeight: 86,
    fontSize: 38,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  emptyIconCompact: {
    width: 74,
    height: 74,
    borderRadius: 37,
    lineHeight: 72,
    fontSize: 32,
  },
  emptyTitle: {
    marginTop: 28,
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.serif,
    fontSize: 22,
    fontWeight: '700',
  },
  emptyTitleCompact: {
    marginTop: 20,
    fontSize: 20,
  },
  emptyText: {
    marginTop: 12,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 13,
    lineHeight: 21,
  },
  emptyTextCompact: {
    fontSize: 12,
    lineHeight: 19,
  },
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 24,
  },
  subtitle: {
    marginTop: 3,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  list: {
    marginTop: 16,
  },
  savedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    overflow: 'hidden',
    marginBottom: 12,
  },
  savedCardCompact: {
    borderRadius: 14,
    marginBottom: 10,
  },
  savedTop: {
    minHeight: 112,
    flexDirection: 'row',
  },
  savedTopCompact: {
    minHeight: 94,
  },
  savedImage: {
    width: 112,
    height: 112,
  },
  savedImageCompact: {
    width: 94,
    height: 94,
  },
  savedCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  savedCopyCompact: {
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  savedName: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 17,
    fontWeight: '700',
  },
  savedNameCompact: {
    fontSize: 15,
  },
  savedBadge: {
    alignSelf: 'flex-start',
    minHeight: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(101, 198, 236, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(101, 198, 236, 0.46)',
    justifyContent: 'center',
    paddingHorizontal: 9,
    marginTop: 8,
  },
  savedBadgeText: {
    color: colors.blue,
    fontFamily: typography.sans,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  savedMeta: {
    marginTop: 8,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  deleteButton: {
    width: 38,
    alignItems: 'center',
    paddingTop: 14,
  },
  deleteText: {
    fontSize: 17,
  },
  actions: {
    height: 46,
    borderTopWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
  },
  actionsCompact: {
    height: 40,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    backgroundColor: colors.line,
  },
  actionText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  tip: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
  },
  tipText: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
    lineHeight: 20,
  },
});
