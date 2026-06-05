import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {PlaceDetail} from '../components/PlaceDetail';
import {ScreenScroll} from '../components/ScreenScroll';
import {placeCategories, places} from '../data/places';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {Place, PlaceCategoryKey} from '../types/app';

type Filter = PlaceCategoryKey | 'all';

type Props = {
  savedPlaceIds: string[];
  focusPlaceId: string | null;
  onToggleSave: (id: string) => void;
};

const richmondRegion = {
  latitude: 49.169,
  longitude: -123.158,
  latitudeDelta: 0.12,
  longitudeDelta: 0.15,
};

type MapRegion = typeof richmondRegion;

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#0b1014'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#8f7845'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#020302'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#0b2a3a'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#2b2417'}]},
  {featureType: 'poi', elementType: 'labels.text.fill', stylers: [{color: '#d0ad63'}]},
];

export function MapScreen({savedPlaceIds, focusPlaceId, onToggleSave}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const mapFrameHeight = compact
    ? Math.max(292, Math.min(430, height - 318))
    : Math.min(536, Math.max(460, height - 310));
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(focusPlaceId);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [region, setRegion] = useState<MapRegion>(richmondRegion);
  const filteredPlaces = useMemo(
    () => (filter === 'all' ? places : places.filter(place => place.category === filter)),
    [filter],
  );
  const markerLayerKey = useMemo(
    () => `${filter}:${filteredPlaces.map(place => place.id).join('|')}`,
    [filter, filteredPlaces],
  );
  const selectedPlace = selectedId ? places.find(place => place.id === selectedId) : undefined;
  const detailPlace = places.find(place => place.id === detailId);

  useEffect(() => {
    if (focusPlaceId) {
      const place = places.find(item => item.id === focusPlaceId);

      if (place) {
        setFilter(place.category);
        setSelectedId(place.id);
        setRegion(regionForPlaces([place]));
      }
    }
  }, [focusPlaceId]);

  function changeFilter(nextFilter: Filter) {
    if (nextFilter === filter) {
      return;
    }

    const nextPlaces = nextFilter === 'all' ? places : places.filter(place => place.category === nextFilter);
    setFilter(nextFilter);
    setSelectedId(null);
    setRegion(regionForPlaces(nextPlaces));
  }

  function selectPlace(id: string) {
    const place = places.find(item => item.id === id);
    setSelectedId(id);

    if (place) {
      setRegion(current => ({
        ...current,
        latitude: place.coordinates.latitude,
        longitude: place.coordinates.longitude,
      }));
    }
  }

  function zoom(multiplier: number) {
    setRegion(current => ({
      ...current,
      latitudeDelta: Math.min(0.22, Math.max(0.018, current.latitudeDelta * multiplier)),
      longitudeDelta: Math.min(0.28, Math.max(0.018, current.longitudeDelta * multiplier)),
    }));
  }

  function recenter() {
    setRegion(regionForPlaces(filteredPlaces));
  }

  if (detailPlace) {
    return (
      <PlaceDetail
        place={detailPlace}
        saved={savedPlaceIds.includes(detailPlace.id)}
        onBack={() => setDetailId(null)}
        onToggleSave={() => onToggleSave(detailPlace.id)}
      />
    );
  }

  return (
    <ScreenScroll>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, compact && styles.titleCompact]}>Interactive Map</Text>
          <Text style={styles.subtitle}>Richmond, British Columbia</Text>
        </View>
        <View style={styles.layers}>
          <Text style={styles.layersIcon}>🗺️</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, compact && styles.filterRowCompact]}>
        {placeCategories.map(item => {
          const active = filter === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => changeFilter(item.key)}
              style={[styles.filterButton, compact && styles.filterButtonCompact, active && styles.filterActive]}>
              <Text style={styles.filterIcon}>{item.icon}</Text>
              <Text style={[styles.filterText, compact && styles.filterTextCompact, active && styles.filterTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.mapFrame, compact && styles.compactMapFrame, {height: mapFrameHeight}]}>
        <NativeMap
          locations={filteredPlaces}
          markerLayerKey={markerLayerKey}
          region={region}
          selectedId={selectedId}
          onRegionChange={setRegion}
          onSelect={selectPlace}
        />
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredPlaces.length} locations</Text>
        </View>
        <View style={styles.mapControls}>
          <Pressable onPress={() => zoom(0.72)} style={styles.mapControlButton}>
            <Text style={styles.mapControlText}>＋</Text>
          </Pressable>
          <Pressable onPress={() => zoom(1.35)} style={styles.mapControlButton}>
            <Text style={styles.mapControlText}>−</Text>
          </Pressable>
          <Pressable onPress={recenter} style={styles.mapControlButton}>
            <Text style={styles.mapControlText}>◎</Text>
          </Pressable>
        </View>
        {selectedPlace ? (
          <Pressable onPress={() => setDetailId(selectedPlace.id)} style={[styles.selectedCard, compact && styles.selectedCardCompact]}>
            <Image source={selectedPlace.image} style={[styles.selectedImage, compact && styles.selectedImageCompact]} />
            <View style={styles.selectedCopy}>
              <Text style={[styles.selectedName, compact && styles.selectedNameCompact]} numberOfLines={1}>
                {selectedPlace.name}
              </Text>
              <Text style={styles.selectedMeta}>⭐ {selectedPlace.rating.toFixed(1)}   {selectedPlace.distance}</Text>
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>{selectedPlace.category.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.selectedActions}>
              <Pressable
                onPress={event => {
                  event.stopPropagation();
                  setSelectedId(null);
                }}
                style={styles.selectedClose}>
                <Text style={styles.selectedCloseText}>×</Text>
              </Pressable>
              <Pressable
                onPress={event => {
                  event.stopPropagation();
                  onToggleSave(selectedPlace.id);
                }}
                style={styles.selectedSave}>
                <Text style={styles.selectedSaveText}>{savedPlaceIds.includes(selectedPlace.id) ? '🔖' : '♡'}</Text>
              </Pressable>
            </View>
          </Pressable>
        ) : null}
      </View>
    </ScreenScroll>
  );
}

type NativeMapProps = {
  locations: Place[];
  markerLayerKey: string;
  region: MapRegion;
  selectedId: string | null;
  onRegionChange: (region: MapRegion) => void;
  onSelect: (id: string) => void;
};

function NativeMap({
  locations,
  markerLayerKey,
  region,
  selectedId,
  onRegionChange,
  onSelect,
}: NativeMapProps): React.JSX.Element {
  const mapRef = useRef<{animateToRegion?: (nextRegion: MapRegion, duration: number) => void} | null>(null);
  const {latitude, latitudeDelta, longitude, longitudeDelta} = region;

  useEffect(() => {
    mapRef.current?.animateToRegion?.(
      {latitude, latitudeDelta, longitude, longitudeDelta},
      140,
    );
  }, [latitude, latitudeDelta, longitude, longitudeDelta, markerLayerKey]);

  try {
    const maps = require('react-native-maps');
    const MapView = maps.default;
    const Marker = maps.Marker;

    return (
      <MapView
        ref={mapRef}
        style={styles.nativeMap}
        initialRegion={region}
        onRegionChangeComplete={onRegionChange}
        customMapStyle={mapStyle}>
        {locations.map(place => {
          const selected = selectedId === place.id;

          return (
            <Marker
              key={`${markerLayerKey}:${place.id}:${selected ? 'selected' : 'idle'}`}
              coordinate={place.coordinates}
              zIndex={selected ? 2 : 1}
              onPress={() => onSelect(place.id)}>
              <View style={[styles.marker, selected && styles.markerSelected]}>
                <Text style={styles.markerText}>{place.category === 'parks' ? '🌳' : place.category === 'landmarks' ? '🎭' : '🌊'}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
    );
  } catch {
    return (
      <FallbackMap
        locations={locations}
        markerLayerKey={markerLayerKey}
        region={region}
        selectedId={selectedId}
        onRegionChange={onRegionChange}
        onSelect={onSelect}
      />
    );
  }
}

function FallbackMap({locations, markerLayerKey, selectedId, onSelect}: NativeMapProps): React.JSX.Element {
  const bounds = {
    minLat: 49.11,
    maxLat: 49.23,
    minLon: -123.215,
    maxLon: -123.085,
  };

  return (
    <View style={styles.fallback}>
      <View style={styles.riverTop} />
      <View style={styles.riverBottom} />
      {Array.from({length: 9}).map((_, index) => (
        <View key={`v-${index}`} style={[styles.gridLineV, {left: `${(index + 1) * 10}%`}]} />
      ))}
      {Array.from({length: 7}).map((_, index) => (
        <View key={`h-${index}`} style={[styles.gridLineH, {top: `${(index + 1) * 12}%`}]} />
      ))}
      {locations.map(place => {
        const left =
          ((place.coordinates.longitude - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 86 + 5;
        const top =
          (1 - (place.coordinates.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 82 + 6;
        const selected = selectedId === place.id;

        return (
          <Pressable
            key={`${markerLayerKey}:${place.id}`}
            onPress={() => onSelect(place.id)}
            style={[
              styles.fallbackMarker,
              {left: `${left}%`, top: `${top}%`},
              selected && styles.fallbackMarkerSelected,
            ]}>
            <Text style={styles.markerText}>{place.category === 'parks' ? '🌳' : place.category === 'landmarks' ? '🎭' : '🌊'}</Text>
          </Pressable>
        );
      })}
      <View style={styles.hotelMarker}>
        <Text style={styles.hotelText}>▲ HOTEL</Text>
      </View>
    </View>
  );
}

function regionForPlaces(targetPlaces: Place[]): MapRegion {
  if (targetPlaces.length === 0) {
    return richmondRegion;
  }

  const latitudes = targetPlaces.map(place => place.coordinates.latitude);
  const longitudes = targetPlaces.map(place => place.coordinates.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max(0.035, (maxLat - minLat) * 1.65),
    longitudeDelta: Math.max(0.045, (maxLon - minLon) * 1.65),
  };
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  layers: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layersIcon: {
    fontSize: 18,
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
  mapFrame: {
    height: 536,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
    backgroundColor: '#071018',
  },
  compactMapFrame: {
    height: 430,
    borderRadius: 18,
  },
  nativeMap: {
    ...StyleSheet.absoluteFillObject,
  },
  countBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    minHeight: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  countText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 11,
    fontWeight: '900',
  },
  mapControls: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  mapControlButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  mapControlText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  marker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: 'rgba(101, 198, 236, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerSelected: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.blue,
  },
  markerText: {
    fontSize: 17,
  },
  selectedCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: '50%',
    minHeight: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.background,
    flexDirection: 'row',
    overflow: 'hidden',
    transform: [{translateY: -56}],
  },
  selectedCardCompact: {
    left: 12,
    right: 12,
    minHeight: 94,
    borderRadius: 14,
    transform: [{translateY: -47}],
  },
  selectedImage: {
    width: 104,
    height: '100%',
  },
  selectedImageCompact: {
    width: 84,
  },
  selectedCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  selectedName: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 17,
    fontWeight: '700',
  },
  selectedNameCompact: {
    fontSize: 15,
  },
  selectedMeta: {
    marginTop: 7,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  selectedBadge: {
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(101, 198, 236, 0.18)',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 9,
  },
  selectedBadgeText: {
    color: colors.blue,
    fontFamily: typography.sans,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  selectedActions: {
    width: 42,
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  selectedClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCloseText: {
    color: colors.gold,
    fontSize: 19,
    lineHeight: 20,
  },
  selectedSave: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSaveText: {
    color: colors.gold,
    fontSize: 18,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#071018',
  },
  riverTop: {
    position: 'absolute',
    top: 8,
    left: -20,
    width: '80%',
    height: 42,
    borderRadius: 20,
    backgroundColor: 'rgba(39, 113, 153, 0.56)',
    transform: [{rotate: '8deg'}],
  },
  riverBottom: {
    position: 'absolute',
    bottom: 18,
    right: -24,
    width: '78%',
    height: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(39, 113, 153, 0.24)',
    transform: [{rotate: '-7deg'}],
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(208, 173, 99, 0.08)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(208, 173, 99, 0.08)',
  },
  fallbackMarker: {
    position: 'absolute',
    width: 34,
    height: 34,
    marginLeft: -17,
    marginTop: -17,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: 'rgba(101, 198, 236, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackMarkerSelected: {
    width: 56,
    height: 56,
    marginLeft: -28,
    marginTop: -28,
    borderRadius: 28,
    backgroundColor: colors.blue,
  },
  hotelMarker: {
    position: 'absolute',
    left: '47%',
    top: '46%',
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  hotelText: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 10,
    fontWeight: '900',
  },
});
