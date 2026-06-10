import React, {useCallback, useMemo, useState} from 'react';
import {GestureResponderEvent, LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ScreenScroll} from '../components/ScreenScroll';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

type ClimateMode = 'cool' | 'heat' | 'fan' | 'sleep';

const modes: Array<{key: ClimateMode; label: string; icon: string}> = [
  {key: 'cool', label: 'Cool', icon: '❄️'},
  {key: 'heat', label: 'Heat', icon: '♨️'},
  {key: 'fan', label: 'Fan', icon: '💨'},
  {key: 'sleep', label: 'Sleep', icon: '🌙'},
];

const fans = ['Low', 'Medium', 'High', 'Auto'];
const minTemperature = 17;
const maxTemperature = 28;

export function ClimateScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const [active, setActive] = useState(true);
  const [temperature, setTemperature] = useState(22);
  const [mode, setMode] = useState<ClimateMode>('cool');
  const [fanSpeed, setFanSpeed] = useState(1);
  const [sliderWidth, setSliderWidth] = useState(1);
  const accent = mode === 'heat' ? colors.orange : colors.blue;
  const inactive = !active;
  const temperaturePercent =
    ((temperature - minTemperature) / (maxTemperature - minTemperature)) * 100;
  const humidity = useMemo(() => {
    const modeOffset = mode === 'heat' ? -7 : mode === 'cool' ? -4 : mode === 'sleep' ? -2 : 2;
    const fanOffset = fanSpeed === 3 ? -3 : fanSpeed * -1;
    const temperatureOffset = Math.round((22 - temperature) * 1.4);
    return Math.min(68, Math.max(35, 52 + modeOffset + fanOffset + temperatureOffset));
  }, [fanSpeed, mode, temperature]);
  const airQuality = useMemo(() => {
    const humidityPenalty = humidity > 62 || humidity < 38 ? 18 : humidity > 58 || humidity < 42 ? 8 : 0;
    const temperaturePenalty = temperature > 26 || temperature < 18 ? 8 : 0;
    const fanBoost = fanSpeed === 3 ? 8 : fanSpeed * 3;
    const modeBoost = mode === 'fan' ? 7 : mode === 'cool' ? 4 : mode === 'sleep' ? 3 : 0;
    const score = (active ? 74 : 54) + fanBoost + modeBoost - humidityPenalty - temperaturePenalty;

    if (score >= 86) {
      return 'Great';
    }

    if (score >= 70) {
      return 'Good';
    }

    if (score >= 55) {
      return 'Fair';
    }

    return 'Poor';
  }, [active, fanSpeed, humidity, mode, temperature]);

  const activate = useCallback(() => {
    setActive(true);
  }, []);

  function decreaseTemperature() {
    activate();
    setTemperature(value => Math.max(minTemperature, value - 1));
  }

  function increaseTemperature() {
    activate();
    setTemperature(value => Math.min(maxTemperature, value + 1));
  }

  const setTemperatureFromSlider = useCallback((event: GestureResponderEvent) => {
    activate();
    const ratio = Math.min(1, Math.max(0, event.nativeEvent.locationX / Math.max(sliderWidth, 1)));
    setTemperature(Math.round(minTemperature + ratio * (maxTemperature - minTemperature)));
  }, [activate, sliderWidth]);

  function setSliderLayout(event: LayoutChangeEvent) {
    setSliderWidth(Math.max(1, event.nativeEvent.layout.width));
  }

  const sliderPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: setTemperatureFromSlider,
        onPanResponderMove: setTemperatureFromSlider,
      }),
    [setTemperatureFromSlider],
  );

  function selectMode(nextMode: ClimateMode) {
    activate();
    setMode(nextMode);
  }

  function selectFanSpeed(index: number) {
    activate();
    setFanSpeed(index);

    if (mode === 'sleep') {
      setMode('fan');
    }
  }

  function toggleSleepMode() {
    activate();
    setMode(current => (current === 'sleep' ? 'cool' : 'sleep'));
  }

  return (
    <ScreenScroll>
      <Text style={styles.title}>Room Climate</Text>
      <Text style={styles.subtitle}>Room 1204 · Floor 12</Text>

      <View style={[styles.heroCard, compact && styles.heroCardCompact, {borderColor: active ? accent : colors.line}, inactive && styles.inactive]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.cardLabel}>Air Conditioning</Text>
            <Text style={styles.stateText}>{active ? 'Active' : 'Standby'}</Text>
          </View>
          <Pressable onPress={() => setActive(value => !value)} style={[styles.toggle, active && {backgroundColor: accent}]}>
            <View style={[styles.toggleKnob, active && styles.toggleKnobActive]} />
          </Pressable>
        </View>

        <View style={[styles.temperatureWrap, compact && styles.temperatureWrapCompact]}>
          <Text style={[styles.temperature, compact && styles.temperatureCompact]}>
            {temperature}
            <Text style={[styles.degree, {color: accent}]}> °C</Text>
          </Text>
          <Text style={[styles.modeState, {color: accent}]}>{active ? mode.toUpperCase() : 'OFF'}</Text>
        </View>

        <View style={[styles.arc, compact && styles.arcCompact]}>
          {[0, 1, 2, 3, 4].map(item => (
            <View key={item} style={[styles.arcSegment, compact && styles.arcSegmentCompact, {backgroundColor: active ? accent : colors.goldDeep}]} />
          ))}
        </View>

        <View style={[styles.tempControls, compact && styles.tempControlsCompact]}>
          <Pressable
            hitSlop={8}
            onPress={decreaseTemperature}
            style={[styles.roundButton, compact && styles.roundButtonCompact]}>
            <Text style={styles.roundButtonText}>−</Text>
          </Pressable>
          <View
            onLayout={setSliderLayout}
            style={styles.sliderHit}
            {...sliderPanResponder.panHandlers}>
            <View style={styles.slider}>
              <View
                style={[
                  styles.sliderFill,
                  {width: `${temperaturePercent}%`, backgroundColor: active ? accent : colors.goldDeep},
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  {left: `${temperaturePercent}%`, borderColor: active ? accent : colors.goldDeep},
                ]}
              />
            </View>
          </View>
          <Pressable
            hitSlop={8}
            onPress={increaseTemperature}
            style={[styles.roundButton, compact && styles.roundButtonCompact, {borderColor: accent}]}>
            <Text style={[styles.roundButtonText, {color: accent}]}>＋</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.panel, compact && styles.panelCompact]}>
        <Text style={styles.panelTitle}>MODE</Text>
        <View style={[styles.modeGrid, compact && styles.modeGridCompact]}>
          {modes.map(item => {
            const selected = item.key === mode;

            return (
              <Pressable
                key={item.key}
                hitSlop={6}
                onPress={() => selectMode(item.key)}
                style={[
                  styles.modeButton,
                  compact && styles.modeButtonCompact,
                  selected && styles.modeButtonActive,
                  selected && {borderColor: mode === 'heat' ? colors.orange : colors.blue},
                ]}>
                <Text style={[styles.modeIcon, compact && styles.modeIconCompact]}>{item.icon}</Text>
                <Text
                  style={[
                    styles.modeLabel,
                    selected && {color: mode === 'heat' ? colors.orange : colors.blue},
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.panel, compact && styles.panelCompact]}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>FAN SPEED</Text>
          <Text style={styles.fanValue}>{fans[fanSpeed]}</Text>
        </View>
        <View style={[styles.fanRow, compact && styles.fanRowCompact]}>
          {fans.map((item, index) => (
            <Pressable
              key={item}
              hitSlop={6}
              onPress={() => selectFanSpeed(index)}
              style={[styles.fanButton, compact && styles.fanButtonCompact, fanSpeed === index && styles.fanButtonActive]}>
              <Text style={[styles.fanIcon, fanSpeed === index && styles.fanIconActive]}>💨</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.sleepCard, compact && styles.sleepCardCompact]}>
        <View style={[styles.sleepIconWrap, compact && styles.sleepIconWrapCompact]}>
          <Text style={styles.sleepIcon}>🌙</Text>
        </View>
        <View style={styles.sleepCopy}>
          <Text style={styles.sleepTitle}>Sleep Mode</Text>
          <Text style={styles.sleepText}>Gradually lowers temp over 2h</Text>
        </View>
        <Pressable hitSlop={10} onPress={toggleSleepMode} style={[styles.smallToggle, mode === 'sleep' && styles.smallToggleActive]}>
          <View style={[styles.smallKnob, mode === 'sleep' && styles.smallKnobActive]} />
        </Pressable>
      </View>

      <View style={[styles.statsRow, compact && styles.statsRowCompact]}>
        <StatCard icon="🌡️" value={`${temperature}°`} label="Feels Like" compact={compact} />
        <StatCard icon="💧" value={`${humidity}%`} label="Humidity" compact={compact} />
        <StatCard icon="🌿" value={airQuality} label="Air Quality" compact={compact} />
      </View>
    </ScreenScroll>
  );
}

type StatCardProps = {
  icon: string;
  value: string;
  label: string;
  compact: boolean;
};

function StatCard({icon, value, label, compact}: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.statCard, compact && styles.statCardCompact]}>
      <Text style={[styles.statIcon, compact && styles.statIconCompact]}>{icon}</Text>
      <Text style={[styles.statValue, compact && styles.statValueCompact]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  heroCard: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: colors.card,
    padding: 24,
  },
  heroCardCompact: {
    marginTop: 10,
    borderRadius: 18,
    padding: 16,
  },
  inactive: {
    opacity: 0.38,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  stateText: {
    marginTop: 5,
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  toggle: {
    width: 58,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.cardRaised,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.mutedDark,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
    backgroundColor: colors.text,
  },
  temperatureWrap: {
    alignItems: 'center',
    marginTop: 22,
  },
  temperatureWrapCompact: {
    marginTop: 14,
  },
  temperature: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 54,
    fontWeight: '700',
  },
  temperatureCompact: {
    fontSize: 46,
  },
  degree: {
    fontFamily: typography.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  modeState: {
    marginTop: -2,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '900',
  },
  arc: {
    marginTop: 12,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  arcCompact: {
    marginTop: 8,
    height: 40,
    gap: 7,
  },
  arcSegment: {
    width: 34,
    height: 8,
    borderRadius: 4,
    transform: [{rotate: '-18deg'}],
    opacity: 0.78,
  },
  arcSegmentCompact: {
    width: 29,
    height: 7,
  },
  tempControls: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 22,
  },
  tempControlsCompact: {
    gap: 14,
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardRaised,
  },
  roundButtonCompact: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  roundButtonText: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: '900',
  },
  slider: {
    position: 'relative',
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.goldDeep,
  },
  sliderHit: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    borderWidth: 3,
    backgroundColor: colors.text,
  },
  panel: {
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
  },
  panelCompact: {
    marginTop: 14,
    borderRadius: 18,
    padding: 13,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  fanValue: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 14,
  },
  modeGridCompact: {
    gap: 7,
    marginTop: 11,
  },
  modeButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonCompact: {
    minHeight: 64,
    borderRadius: 14,
  },
  modeButtonActive: {
    backgroundColor: colors.goldDeep,
  },
  modeIcon: {
    fontSize: 22,
  },
  modeIconCompact: {
    fontSize: 19,
  },
  modeLabel: {
    marginTop: 8,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 11,
    fontWeight: '800',
  },
  fanRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  fanRowCompact: {
    gap: 7,
    marginTop: 12,
  },
  fanButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanButtonCompact: {
    height: 42,
    borderRadius: 14,
  },
  fanButtonActive: {
    backgroundColor: colors.goldDeep,
    borderColor: colors.lineStrong,
  },
  fanIcon: {
    fontSize: 19,
    opacity: 0.35,
  },
  fanIconActive: {
    opacity: 1,
  },
  sleepCard: {
    marginTop: 20,
    minHeight: 72,
    borderRadius: 20,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sleepCardCompact: {
    marginTop: 14,
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 13,
  },
  sleepIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sleepIconWrapCompact: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  sleepIcon: {
    fontSize: 20,
  },
  sleepCopy: {
    flex: 1,
    minWidth: 0,
  },
  sleepTitle: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 15,
    fontWeight: '900',
  },
  sleepText: {
    marginTop: 3,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  smallToggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.goldDeep,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  smallToggleActive: {
    backgroundColor: colors.gold,
  },
  smallKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.muted,
  },
  smallKnobActive: {
    alignSelf: 'flex-end',
    backgroundColor: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  statsRowCompact: {
    gap: 8,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  statCardCompact: {
    minHeight: 76,
    borderRadius: 13,
  },
  statIcon: {
    fontSize: 21,
  },
  statIconCompact: {
    fontSize: 18,
  },
  statValue: {
    marginTop: 8,
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 14,
    fontWeight: '900',
  },
  statValueCompact: {
    marginTop: 6,
    fontSize: 13,
  },
  statLabel: {
    marginTop: 5,
    color: colors.mutedDark,
    fontFamily: typography.sans,
    fontSize: 10,
  },
});
