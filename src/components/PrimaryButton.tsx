import React from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, ViewStyle} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'filled',
  style,
}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        styles.base,
        compact && styles.compactBase,
        variant === 'outline' ? styles.outline : styles.filled,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  compactBase: {
    height: 50,
    borderRadius: 14,
  },
  filled: {
    backgroundColor: colors.gold,
  },
  outline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  disabled: {
    opacity: 0.34,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.86,
  },
  label: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '800',
  },
  outlineLabel: {
    color: colors.gold,
  },
});
