import React, {useEffect, useMemo, useState} from 'react';
import {Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View} from 'react-native';
import {CompactKeyboard} from './CompactKeyboard';
import type {GuestProfile} from '../types/app';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

const qrColumns = 21;

function isFinder(row: number, col: number, startRow: number, startCol: number): boolean {
  const r = row - startRow;
  const c = col - startCol;

  if (r < 0 || c < 0 || r > 6 || c > 6) {
    return false;
  }

  return r === 0 || c === 0 || r === 6 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
}

function makeQrCells(seed: string): boolean[] {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  }

  return Array.from({length: qrColumns * qrColumns}, (_, index) => {
    const row = Math.floor(index / qrColumns);
    const col = index % qrColumns;

    if (isFinder(row, col, 1, 1) || isFinder(row, col, 1, 14) || isFinder(row, col, 14, 1)) {
      return true;
    }

    if ((row + col) % 8 === 0 || (row * 3 + col * 5 + hash) % 11 < 4) {
      return true;
    }

    return (row * row + col * 7 + hash) % 17 < 6;
  });
}

type Props = {
  visible: boolean;
  profile: GuestProfile;
  onClose: () => void;
  onSave: (profile: GuestProfile) => void;
};

export function GuestPassModal({visible, profile, onClose, onSave}: Props): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [activeField, setActiveField] = useState<'name' | 'room' | null>(null);
  const cells = useMemo(() => makeQrCells(`${profile.name}-${profile.room}`), [profile.name, profile.room]);
  const qrSize = Math.max(compact ? 160 : 190, Math.min(compact ? 178 : 218, width - 116));
  const qrFramePadding = compact ? 16 : 24;
  const cellSize = qrSize / qrColumns;
  const topSafeOffset = Platform.OS === 'android'
    ? Math.max(StatusBar.currentHeight ?? 0, 30)
    : height >= 780
      ? 48
      : 28;
  const modalTopOffset = topSafeOffset + (compact ? 8 : 12);
  const modalBottomOffset = compact ? 14 : 24;

  useEffect(() => {
    if (visible) {
      setDraft(profile);
      setEditing(false);
      setActiveField(null);
    }
  }, [profile, visible]);

  function save() {
    onSave(draft);
    setEditing(false);
    setActiveField(null);
  }

  function close() {
    setActiveField(null);
    onClose();
  }

  function updateActiveField(value: string) {
    if (activeField === 'name') {
      setDraft(current => ({...current, name: value}));
    }

    if (activeField === 'room') {
      setDraft(current => ({...current, room: value}));
    }
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={close}>
      <View
        style={[
          styles.overlay,
          compact && styles.compactOverlay,
          {paddingTop: modalTopOffset, paddingBottom: modalBottomOffset},
        ]}>
        <View
          style={[
            styles.sheet,
            compact && styles.compactSheet,
            {maxHeight: height - modalTopOffset - modalBottomOffset},
          ]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.sheetContent, compact && styles.compactSheetContent]}>
            <View style={styles.handle} />
            <View style={styles.topRow}>
              <View style={styles.titleBlock}>
                <Text style={[styles.title, compact && styles.compactTitle]}>Guest Pass</Text>
                <Text style={styles.subtitle}>Present at reception for identification</Text>
              </View>
              <Pressable onPress={close} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <View style={[styles.divider, compact && styles.compactDivider]} />

            <View
              style={[
                styles.qrBox,
                {
                  width: qrSize + qrFramePadding,
                  height: qrSize + qrFramePadding,
                },
              ]}>
              <View style={[styles.qr, {width: qrSize, height: qrSize}]}>
                {cells.map((filled, index) => (
                  <View
                    key={index}
                    style={[
                      styles.qrCell,
                      {width: cellSize, height: cellSize},
                      filled && styles.qrCellFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={[styles.qrCaption, compact && styles.compactQrCaption]}>SCAN AT HOTEL RECEPTION</Text>

            <View style={[styles.infoCard, compact && styles.compactInfoCard]}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>GUEST INFORMATION</Text>
                <Pressable onPress={editing ? save : () => setEditing(true)} style={styles.editButton}>
                  <Text style={styles.editText}>{editing ? '✓ Save' : '✎ Edit'}</Text>
                </Pressable>
              </View>
              <InfoRow
                label="Guest Name"
                value={draft.name}
                editable={editing}
                onFocus={() => setActiveField('name')}
                onChange={name => setDraft(current => ({...current, name}))}
              />
              <InfoRow
                label="Room"
                value={draft.room}
                editable={editing}
                onFocus={() => setActiveField('room')}
                onChange={room => setDraft(current => ({...current, room}))}
              />
              <InfoRow label="Check-in" value={draft.checkIn} editable={false} />
              <InfoRow label="Check-out" value={draft.checkOut} editable={false} />
            </View>

            <CompactKeyboard
              visible={editing && activeField !== null}
              value={activeField === 'room' ? draft.room : draft.name}
              onChange={updateActiveField}
              onDone={() => setActiveField(null)}
            />

            <Text style={[styles.hotel, compact && styles.compactHotel]}>RICHMOND GRAND HOTEL</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
};

function InfoRow({label, value, editable, onChange, onFocus}: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {editable ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          showSoftInputOnFocus={false}
          style={styles.infoInput}
          placeholderTextColor={colors.mutedDark}
          selectionColor={colors.gold}
        />
      ) : (
        <Text style={styles.infoValue} numberOfLines={1}>
          {value}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-start',
    paddingTop: 28,
    paddingHorizontal: 14,
    paddingBottom: 26,
  },
  compactOverlay: {
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 14,
  },
  sheet: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  compactSheet: {
    borderRadius: 24,
  },
  sheetContent: {
    paddingHorizontal: 22,
    paddingTop: 11,
    paddingBottom: 24,
  },
  compactSheetContent: {
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 18,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.goldDeep,
    marginBottom: 18,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 24,
    fontWeight: '700',
  },
  compactTitle: {
    fontSize: 22,
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.goldDeep,
  },
  closeText: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginTop: 16,
    marginBottom: 22,
  },
  compactDivider: {
    marginTop: 12,
    marginBottom: 14,
  },
  qrBox: {
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    backgroundColor: colors.white,
  },
  qrCellFilled: {
    backgroundColor: '#21160d',
  },
  qrCaption: {
    marginTop: 14,
    marginBottom: 18,
    color: colors.mutedDark,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 10,
    letterSpacing: 2.4,
  },
  compactQrCaption: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 9,
    letterSpacing: 1.8,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
  },
  compactInfoCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoTitle: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 11,
    letterSpacing: 2,
  },
  editButton: {
    paddingVertical: 4,
    paddingLeft: 12,
  },
  editText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  infoRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    width: 104,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  infoValue: {
    flex: 1,
    color: colors.text,
    textAlign: 'right',
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  infoInput: {
    flex: 1,
    minHeight: 32,
    paddingVertical: 0,
    color: colors.text,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderColor: colors.lineStrong,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '800',
  },
  hotel: {
    marginTop: 20,
    color: colors.gold,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 10,
    letterSpacing: 2.4,
  },
  compactHotel: {
    marginTop: 14,
    fontSize: 9,
    letterSpacing: 1.8,
  },
});
