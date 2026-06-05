import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {PlaceCard} from '../components/PlaceCard';
import {PlaceDetail} from '../components/PlaceDetail';
import {ScreenScroll} from '../components/ScreenScroll';
import {placeCategories, places} from '../data/places';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {PlaceCategoryKey} from '../types/app';

type Filter = PlaceCategoryKey | 'all';

type Props = {
  savedPlaceIds: string[];
  onToggleSave: (id: string) => void;
};

export function GuideScreen({savedPlaceIds, onToggleSave}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const [filter, setFilter] = useState<Filter>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const selectedPlace = places.find(place => place.id === detailId);
  const filteredPlaces = useMemo(
    () => (filter === 'all' ? places : places.filter(place => place.category === filter)),
    [filter],
  );

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

  return (
    <ScreenScroll>
      <Text style={[styles.title, compact && styles.titleCompact]}>City Guide</Text>
      <Text style={styles.subtitle}>Richmond, British Columbia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, compact && styles.filterRowCompact]}>
        {placeCategories.map(item => {
          const active = filter === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.filterButton, compact && styles.filterButtonCompact, active && styles.filterActive]}>
              <Text style={styles.filterIcon}>{item.icon}</Text>
              <Text style={[styles.filterText, compact && styles.filterTextCompact, active && styles.filterTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.list}>
        {filteredPlaces.map(place => (
          <PlaceCard
            key={place.id}
            place={place}
            saved={savedPlaceIds.includes(place.id)}
            compact={compact}
            onOpen={() => setDetailId(place.id)}
            onToggleSave={() => onToggleSave(place.id)}
          />
        ))}
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
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
  filterRow: {
    gap: 9,
    paddingTop: 14,
    paddingBottom: 14,
  },
  filterRowCompact: {
    gap: 7,
    paddingTop: 10,
    paddingBottom: 10,
  },
  filterButton: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  filterButtonCompact: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  filterActive: {
    backgroundColor: colors.goldDeep,
    borderColor: colors.lineStrong,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 7,
  },
  filterText: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  filterTextCompact: {
    fontSize: 11,
  },
  filterTextActive: {
    color: colors.gold,
  },
  list: {
    paddingTop: 2,
  },
});
