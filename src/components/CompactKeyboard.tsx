import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

type Props = {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onDone: () => void;
};

const letterRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
];

const numberRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['.', ',', '?', '!', "'", 'backspace'],
];

export function CompactKeyboard({visible, value, onChange, onDone}: Props): React.JSX.Element | null {
  const [mode, setMode] = useState<'letters' | 'numbers'>('letters');
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  if (!visible) {
    return null;
  }

  function input(symbol: string) {
    if (symbol === 'backspace') {
      onChange(value.slice(0, -1));
      return;
    }

    if (symbol === 'space') {
      onChange(`${value} `);
      return;
    }

    if (symbol === 'mode') {
      setMode(current => (current === 'letters' ? 'numbers' : 'letters'));
      return;
    }

    if (symbol === 'done') {
      onDone();
      return;
    }

    const previous = value.slice(-1);
    const shouldCapitalize = mode === 'letters' && (value.length === 0 || previous === ' ');
    onChange(`${value}${shouldCapitalize ? symbol.toUpperCase() : symbol}`);
  }

  const rows = mode === 'letters' ? letterRows : numberRows;

  return (
    <View style={[styles.keyboard, compact && styles.compactKeyboard]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.row, compact && styles.compactRow]}>
          {row.map(key => (
            <Key key={key} value={key} onPress={input} />
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <Key value="mode" label={mode === 'letters' ? '123' : 'ABC'} onPress={input} wide />
        <Key value="space" label="Space" onPress={input} space />
        <Key value="." onPress={input} wide />
        <Key value="done" label="Done" onPress={input} done />
      </View>
    </View>
  );
}

type KeyProps = {
  value: string;
  label?: string;
  wide?: boolean;
  space?: boolean;
  done?: boolean;
  onPress: (value: string) => void;
};

function Key({value, label, wide, space, done, onPress}: KeyProps): React.JSX.Element {
  const text = label ?? (value === 'backspace' ? '⌫' : value.toUpperCase());

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={({pressed}) => [
        styles.key,
        wide && styles.wideKey,
        space && styles.spaceKey,
        done && styles.doneKey,
        pressed && styles.keyPressed,
      ]}>
      <Text style={[styles.keyText, done && styles.doneText]} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  compactKeyboard: {
    padding: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    minHeight: 34,
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },
  compactRow: {
    minHeight: 30,
    gap: 4,
    marginBottom: 4,
  },
  key: {
    flex: 1,
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideKey: {
    flex: 1.35,
  },
  spaceKey: {
    flex: 3.2,
  },
  doneKey: {
    flex: 1.55,
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  keyPressed: {
    opacity: 0.72,
    transform: [{scale: 0.97}],
  },
  keyText: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '900',
  },
  doneText: {
    color: colors.black,
  },
});
