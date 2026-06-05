import React from 'react';
import {ScrollView, StyleProp, StyleSheet, useWindowDimensions, ViewStyle} from 'react-native';
import {contentBottomPadding, horizontalPadding} from '../utils/layout';

type Props = {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenScroll({children, contentStyle}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;

  return (
    <ScrollView
      style={styles.root}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        compact && styles.compactContent,
        contentStyle,
      ]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: horizontalPadding,
    paddingTop: 22,
    paddingBottom: contentBottomPadding,
  },
  compactContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: contentBottomPadding + 10,
  },
});
