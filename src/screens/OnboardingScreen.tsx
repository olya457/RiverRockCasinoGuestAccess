import React, {useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {isAndroid, navBottomOffset} from '../utils/layout';

type Props = {
  onComplete: () => void;
};

const pages = [
  {
    tag: 'IMPORTANT NOTICE',
    icon: '❕',
    title: 'DEMO Application',
    eyebrow: 'FOR SHOWCASE PURPOSES ONLY',
    body:
      'This is a demonstration application created solely to showcase the guest journey and interface concepts. It is not connected to any real hotel system and is not intended for actual hotel usage.',
    notice: 'All data shown is fictional and for demonstration only. No bookings, orders, or requests are processed.',
  },
  {
    tag: 'FEATURE 1',
    icon: '🍽️',
    title: 'Room Service',
    eyebrow: 'CULINARY EXCELLENCE DELIVERED',
    body:
      'Explore curated signature entrees, fresh light options, and desserts. Add items to your cart and enjoy in-room dining at your leisure.',
  },
  {
    tag: 'FEATURE 2 & 3',
    icon: '🔔',
    title: 'Guest Requests',
    eyebrow: 'PERSONALIZED SERVICE, ANYTIME',
    body:
      'Request housekeeping, amenities, transportation, concierge services, and more. Track every request from submission to completion.',
  },
  {
    tag: 'FEATURE 4',
    icon: '🌡️',
    title: 'Room Climate',
    eyebrow: 'YOUR COMFORT, PERFECTLY CALIBRATED',
    body:
      'Fine-tune your room temperature, select cooling or heating mode, adjust fan speed, and enable sleep mode through an elegant control panel.',
  },
  {
    tag: 'FEATURES 5 & 6',
    icon: '📍',
    title: 'Richmond City Guide',
    eyebrow: 'DISCOVER THE DESTINATION',
    body:
      "Explore Richmond, BC's waterfront walks, parks, cultural landmarks, and hidden gems. Save favorite spots and view them on the interactive city map.",
  },
];

export function OnboardingScreen({onComplete}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height} = useWindowDimensions();
  const page = pages[index];
  const compact = height < 740;
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

      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{page.tag}</Text>
        </View>
        <View style={[styles.iconRing, compact && styles.iconRingCompact]}>
          <Text style={styles.icon}>{page.icon}</Text>
        </View>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.eyebrow}>{page.eyebrow}</Text>
        <Text style={[styles.body, compact && styles.bodyCompact]}>{page.body}</Text>

        {page.notice ? (
          <View style={styles.notice}>
            <Text style={styles.noticeIcon}>❕</Text>
            <Text style={styles.noticeText}>{page.notice}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.bottom, {paddingBottom: navBottomOffset + 20}]}>
        <View style={styles.dots}>
          {pages.map((_, dotIndex) => (
            <View key={dotIndex} style={[styles.dot, dotIndex === index && styles.activeDot]} />
          ))}
        </View>
        <PrimaryButton label={last ? 'Enter the Experience ›' : 'Continue ›'} onPress={next} />
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
  tagText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
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
  icon: {
    fontSize: 34,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
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
    lineHeight: 22,
  },
  notice: {
    marginTop: 28,
    width: '100%',
    minHeight: 78,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  noticeIcon: {
    marginRight: 12,
    fontSize: 15,
  },
  noticeText: {
    flex: 1,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 12,
    lineHeight: 19,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingTop: 14,
  },
  dots: {
    height: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
