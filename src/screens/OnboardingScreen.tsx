import React, {useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {isAndroid, navBottomOffset} from '../utils/layout';

type Props = {
  onComplete: () => void;
};

const pages = [
  {
    tag: 'WELCOME',
    icon: '🛎️',
    title: 'River Rock Guest Access',
    eyebrow: 'YOUR STAY, SIMPLIFIED',
    body: 'Manage dining, guest services, room comfort, and local recommendations from one polished guest companion.',
  },
  {
    tag: 'DINING',
    icon: '🍽️',
    title: 'Room Service',
    eyebrow: 'CULINARY EXCELLENCE DELIVERED',
    body: 'Explore curated signature entrees, fresh light options, and desserts. Add items to your cart and enjoy in-room dining at your leisure.',
  },
  {
    tag: 'GUEST SERVICES',
    icon: '🔔',
    title: 'Guest Requests',
    eyebrow: 'PERSONALIZED SERVICE, ANYTIME',
    body: 'Request housekeeping, amenities, transportation, concierge services, and more. Track every request from submission to completion.',
  },
  {
    tag: 'COMFORT',
    icon: '🌡️',
    title: 'Room Climate',
    eyebrow: 'YOUR COMFORT, PERFECTLY CALIBRATED',
    body: 'Fine-tune your room temperature, select cooling or heating mode, adjust fan speed, and enable sleep mode through an elegant control panel.',
  },
  {
    tag: 'CITY GUIDE',
    icon: '📍',
    title: 'Richmond City Guide',
    eyebrow: 'DISCOVER THE DESTINATION',
    body: "Explore Richmond, BC's waterfront walks, parks, cultural landmarks, and hidden gems. Save favorite spots and view them on the interactive city map.",
  },
];

export function OnboardingScreen({onComplete}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height, width} = useWindowDimensions();
  const page = pages[index];
  const compact = height < 760 || width < 390;
  const veryCompact = height < 640 || width < 350;
  const last = index === pages.length - 1;

  function next() {
    if (last) {
      onComplete();
    } else {
      setIndex(current => current + 1);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={[styles.top, isAndroid && styles.androidTop]}>
        <Pressable onPress={onComplete} style={styles.skipHit}>
          <Text style={styles.skip}>SKIP</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.content,
          compact && styles.compactContent,
          veryCompact && styles.veryCompactContent,
        ]}>
        <View style={[styles.tag, veryCompact && styles.tagVeryCompact]}>
          <Text
            style={[styles.tagText, veryCompact && styles.tagTextVeryCompact]}>
            {page.tag}
          </Text>
        </View>
        <View
          style={[
            styles.iconRing,
            compact && styles.iconRingCompact,
            veryCompact && styles.iconRingVeryCompact,
          ]}>
          <Text style={[styles.icon, veryCompact && styles.iconVeryCompact]}>
            {page.icon}
          </Text>
        </View>
        <Text style={[styles.title, compact && styles.titleCompact]}>
          {page.title}
        </Text>
        <Text style={[styles.eyebrow, compact && styles.eyebrowCompact]}>
          {page.eyebrow}
        </Text>
        <Text
          style={[
            styles.body,
            compact && styles.bodyCompact,
            veryCompact && styles.bodyVeryCompact,
          ]}>
          {page.body}
        </Text>
      </View>

      <View
        style={[
          styles.bottom,
          compact && styles.bottomCompact,
          {paddingBottom: navBottomOffset + (compact ? 12 : 20)},
        ]}>
        <View style={[styles.dots, compact && styles.dotsCompact]}>
          {pages.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={[styles.dot, dotIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <PrimaryButton
          label={last ? 'Get Started ›' : 'Continue ›'}
          onPress={next}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    height: 72,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  androidTop: {
    paddingTop: 30,
    height: 92,
  },
  skipHit: {
    padding: 12,
  },
  skip: {
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  compactContent: {
    justifyContent: 'flex-start',
    paddingTop: 24,
  },
  veryCompactContent: {
    paddingHorizontal: 26,
    paddingTop: 12,
  },
  tag: {
    height: 32,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  tagVeryCompact: {
    height: 28,
    paddingHorizontal: 14,
  },
  tagText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  tagTextVeryCompact: {
    fontSize: 10,
    letterSpacing: 1,
  },
  iconRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
    marginBottom: 30,
    backgroundColor: colors.card,
  },
  iconRingCompact: {
    marginTop: 24,
    marginBottom: 22,
  },
  iconRingVeryCompact: {
    width: 66,
    height: 66,
    borderRadius: 33,
    marginTop: 16,
    marginBottom: 14,
  },
  icon: {
    fontSize: 34,
  },
  iconVeryCompact: {
    fontSize: 27,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 25,
  },
  eyebrow: {
    marginTop: 8,
    color: colors.gold,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  eyebrowCompact: {
    marginTop: 6,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: {
    marginTop: 28,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 14,
    lineHeight: 24,
  },
  bodyCompact: {
    marginTop: 18,
    fontSize: 13,
    lineHeight: 22,
  },
  bodyVeryCompact: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 19,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingTop: 14,
  },
  bottomCompact: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  dots: {
    height: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dotsCompact: {
    height: 22,
    marginBottom: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.mutedDark,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 22,
    backgroundColor: colors.gold,
  },
});
