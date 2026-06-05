import React from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {TabKey} from '../types/app';
import {navBottomOffset, navHeight} from '../utils/layout';

type TabItem = {
  key: TabKey;
  label: string;
  icon: string;
};

const tabs: TabItem[] = [
  {key: 'dining', label: 'Dining', icon: '🍽️'},
  {key: 'requests', label: 'Requests', icon: '🔔'},
  {key: 'climate', label: 'Climate', icon: '🌡️'},
  {key: 'guide', label: 'Guide', icon: '🧭'},
  {key: 'saved', label: 'Saved', icon: '🔖'},
  {key: 'map', label: 'Map', icon: '🗺️'},
];

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function BottomNav({activeTab, onChange}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  return (
    <View style={[styles.wrap, compact && styles.compactWrap]}>
      {tabs.map(tab => {
        const active = activeTab === tab.key;

        return (
          <Pressable key={tab.key} hitSlop={8} onPress={() => onChange(tab.key)} style={[styles.item, compact && styles.compactItem]}>
            <View style={[styles.iconBubble, compact && styles.compactIconBubble, active && styles.activeBubble]}>
              <Text style={[styles.icon, compact && styles.compactIcon, active && styles.activeIcon]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, compact && styles.compactLabel, active && styles.activeLabel]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: navBottomOffset,
    height: navHeight,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(6, 5, 3, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 7,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 8},
    elevation: 10,
    zIndex: 30,
  },
  compactWrap: {
    left: 10,
    right: 10,
    height: 68,
    borderRadius: 22,
  },
  item: {
    width: 54,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactItem: {
    height: 54,
    width: 50,
  },
  iconBubble: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIconBubble: {
    width: 29,
    height: 29,
    borderRadius: 14.5,
  },
  activeBubble: {
    backgroundColor: colors.goldDeep,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  compactIcon: {
    fontSize: 15,
  },
  icon: {
    fontSize: 17,
    opacity: 0.58,
  },
  compactLabel: {
    fontSize: 8,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    marginTop: 2,
    color: colors.mutedDark,
    fontFamily: typography.sans,
    fontSize: 9,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.gold,
  },
});
