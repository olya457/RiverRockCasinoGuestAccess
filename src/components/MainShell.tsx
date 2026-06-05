import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {BottomNav} from './BottomNav';
import {GuestPassModal} from './GuestPassModal';
import {Header} from './Header';
import {colors} from '../theme/colors';
import type {GuestProfile, TabKey} from '../types/app';
import {androidEdge, isAndroid} from '../utils/layout';

type Props = {
  activeTab: TabKey;
  profile: GuestProfile;
  children: React.ReactNode;
  onTabChange: (tab: TabKey) => void;
  onProfileSave: (profile: GuestProfile) => void;
};

export function MainShell({
  activeTab,
  profile,
  children,
  onTabChange,
  onProfileSave,
}: Props): React.JSX.Element {
  const [qrVisible, setQrVisible] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar hidden={false} barStyle="light-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safe}>
        {isAndroid ? <View style={styles.androidTop} /> : null}
        <Header profile={profile} onQrPress={() => setQrVisible(true)} />
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
      <BottomNav activeTab={activeTab} onChange={onTabChange} />
      <GuestPassModal
        visible={qrVisible}
        profile={profile}
        onClose={() => setQrVisible(false)}
        onSave={onProfileSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  androidTop: {
    height: androidEdge,
  },
  content: {
    flex: 1,
  },
});
