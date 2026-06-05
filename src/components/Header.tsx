import React from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import type {GuestProfile} from '../types/app';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

type Props = {
  profile: GuestProfile;
  onQrPress: () => void;
};

export function Header({profile, onQrPress}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  return (
    <View style={[styles.header, compact && styles.compactHeader]}>
      <View style={[styles.sideSlot, compact && styles.compactSideSlot]}>
        <View style={styles.guestBlock}>
          <View style={[styles.avatar, compact && styles.compactAvatar]}>
            <Text style={[styles.avatarIcon, compact && styles.compactAvatarIcon]}>👤</Text>
          </View>
          <View style={styles.guestCopy}>
            <Text style={[styles.guestName, compact && styles.compactGuestName]} numberOfLines={1}>
              {profile.name}
            </Text>
            <Text style={[styles.guestRoom, compact && styles.compactGuestRoom]} numberOfLines={1}>
              {profile.room}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.brand, compact && styles.compactBrand]}>
        <Text style={styles.brandIcon}>♛</Text>
        <Text style={[styles.brandText, compact && styles.compactBrandText]} numberOfLines={1}>
          RICHMOND GRAND
        </Text>
      </View>

      <View style={[styles.sideSlot, styles.rightSlot, compact && styles.compactSideSlot]}>
        <Pressable
          onPress={onQrPress}
          style={({pressed}) => [
            styles.qrButton,
            compact && styles.compactQrButton,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.qrIcon}>🔳</Text>
          <Text style={[styles.qrText, compact && styles.compactQrText]}>My QR</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  compactHeader: {
    minHeight: 62,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  sideSlot: {
    width: 118,
    minWidth: 0,
    justifyContent: 'flex-end',
  },
  compactSideSlot: {
    width: 104,
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  guestBlock: {
    width: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  compactAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 7,
  },
  avatarIcon: {
    fontSize: 15,
  },
  compactAvatarIcon: {
    fontSize: 13,
  },
  guestCopy: {
    minWidth: 0,
    flex: 1,
  },
  guestName: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  compactGuestName: {
    fontSize: 12,
  },
  guestRoom: {
    marginTop: 2,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  compactGuestRoom: {
    fontSize: 10,
  },
  brand: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
  },
  compactBrand: {
    paddingHorizontal: 5,
  },
  brandIcon: {
    color: colors.gold,
    fontSize: 16,
    lineHeight: 18,
  },
  brandText: {
    marginTop: 3,
    color: colors.goldMuted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 8,
    letterSpacing: 2.1,
  },
  compactBrandText: {
    fontSize: 7,
    letterSpacing: 1.45,
  },
  qrButton: {
    minWidth: 88,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.panelStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    shadowColor: colors.gold,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  compactQrButton: {
    minWidth: 76,
    height: 36,
    paddingHorizontal: 10,
  },
  pressed: {
    opacity: 0.82,
  },
  qrIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  qrText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  compactQrText: {
    fontSize: 11,
  },
});
