import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View} from 'react-native';
import {CompactKeyboard} from '../components/CompactKeyboard';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenScroll} from '../components/ScreenScroll';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {navBottomOffset, navHeight} from '../utils/layout';

type RequestRoute = 'home' | 'form' | 'submitted' | 'track';

type RequestType = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  quick: string[];
};

const requestTypes: RequestType[] = [
  {
    id: 'housekeeping',
    icon: '🛏️',
    title: 'Housekeeping',
    subtitle: 'Cleaning & linen',
    quick: ['Fresh towels', 'Room cleaning', 'Bed turn-down service', 'Extra pillows', 'Change bed linens'],
  },
  {
    id: 'bathroom',
    icon: '🧴',
    title: 'Bathroom Essentials',
    subtitle: 'Toiletries & robes',
    quick: ['Shampoo', 'Dental kit', 'Bath robes', 'Soap refill'],
  },
  {
    id: 'amenities',
    icon: '☕',
    title: 'Room Amenities',
    subtitle: 'Coffee & minibar',
    quick: ['Coffee pods', 'Bottled water', 'Minibar refill', 'Glassware'],
  },
  {
    id: 'assistance',
    icon: '🛎️',
    title: 'Guest Assistance',
    subtitle: 'Luggage & wake-up',
    quick: ['Luggage help', 'Wake-up call', 'Bell service', 'Late checkout'],
  },
  {
    id: 'maintenance',
    icon: '🔧',
    title: 'Maintenance',
    subtitle: 'Room repairs',
    quick: ['Light issue', 'TV support', 'Temperature issue', 'Bathroom repair'],
  },
  {
    id: 'transportation',
    icon: '🚕',
    title: 'Transportation',
    subtitle: 'Taxi & transfers',
    quick: ['Taxi request', 'Airport transfer', 'Valet pickup', 'Ride estimate'],
  },
  {
    id: 'concierge',
    icon: '☎️',
    title: 'Concierge',
    subtitle: 'Reservations & tours',
    quick: ['Restaurant reservation', 'Tour advice', 'Event tickets', 'City tips'],
  },
];

const activeRequests = [
  {icon: '🛏️', title: 'Housekeeping', detail: 'Fresh towels and room cleaning', time: '12:30 PM', status: 'In Progress'},
  {icon: '☎️', title: 'Concierge', detail: 'Restaurant reservation for 2 tonight', time: '11:45 AM', status: 'Accepted'},
  {icon: '☕', title: 'Room Amenities', detail: 'Coffee pod refill', time: '10:00 AM', status: 'Completed'},
];

export function RequestsScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const [route, setRoute] = useState<RequestRoute>('home');
  const [selectedId, setSelectedId] = useState('housekeeping');
  const [selectedQuick, setSelectedQuick] = useState<string[]>([]);
  const [details, setDetails] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const selected = useMemo(
    () => requestTypes.find(item => item.id === selectedId) ?? requestTypes[0],
    [selectedId],
  );
  const canSubmit = selectedQuick.length > 0 || details.trim().length > 0;

  function openForm(type: RequestType) {
    setSelectedId(type.id);
    setSelectedQuick([]);
    setDetails('');
    setKeyboardVisible(false);
    setRoute('form');
  }

  function toggleQuick(value: string) {
    setSelectedQuick(current =>
      current.includes(value) ? current.filter(item => item !== value) : [...current, value],
    );
  }

  if (route === 'submitted') {
    return (
      <View style={[styles.submitted, compact && styles.submittedCompact]}>
        <View style={[styles.successCircle, compact && styles.successCircleCompact]}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={[styles.successTitle, compact && styles.successTitleCompact]}>Request Submitted</Text>
        <Text style={[styles.successSubtitle, compact && styles.successSubtitleCompact]}>
          Our team will attend to your request shortly
        </Text>
        <PrimaryButton label="Track Request" onPress={() => setRoute('track')} style={styles.successButton} />
        <PrimaryButton label="New Request" onPress={() => setRoute('home')} variant="outline" style={styles.outlineButton} />
      </View>
    );
  }

  if (route === 'form') {
    return (
      <ScreenScroll>
        <View style={[styles.formHeader, compact && styles.formHeaderCompact]}>
          <Pressable onPress={() => setRoute('home')} style={styles.backHit}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <View style={styles.formTitleBlock}>
            <Text style={styles.caption}>Request</Text>
            <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
              {selected.icon} {selected.title}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Quick Select</Text>
        <View style={[styles.quickWrap, compact && styles.quickWrapCompact]}>
          {selected.quick.map(item => {
            const active = selectedQuick.includes(item);

            return (
              <Pressable key={item} onPress={() => toggleQuick(item)} style={[styles.quick, compact && styles.quickCompact, active && styles.quickActive]}>
                <Text style={[styles.quickText, compact && styles.quickTextCompact, active && styles.quickTextActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Or describe your request</Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          onFocus={() => setKeyboardVisible(true)}
          showSoftInputOnFocus={false}
          multiline
          placeholder={`Describe your ${selected.title.toLowerCase()} request...`}
          placeholderTextColor={colors.mutedDark}
          selectionColor={colors.gold}
          style={[styles.detailsInput, compact && styles.detailsInputCompact]}
        />

        <CompactKeyboard
          visible={keyboardVisible}
          value={details}
          onChange={setDetails}
          onDone={() => setKeyboardVisible(false)}
        />

        <PrimaryButton
          label="✈ Submit Request"
          onPress={() => {
            setKeyboardVisible(false);
            setRoute('submitted');
          }}
          disabled={!canSubmit}
        />
      </ScreenScroll>
    );
  }

  if (route === 'track') {
    return (
      <ScreenScroll>
        <View style={[styles.formHeader, compact && styles.formHeaderCompact]}>
          <Pressable onPress={() => setRoute('home')} style={styles.backHit}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={[styles.title, compact && styles.titleCompact]}>Active Requests</Text>
        </View>
        {activeRequests.map(item => (
          <ActiveRequestCard key={`${item.title}-${item.time}`} item={item} large />
        ))}
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <View style={[styles.homeHeader, compact && styles.homeHeaderCompact]}>
        <View>
          <Text style={[styles.title, compact && styles.titleCompact]}>Guest Requests</Text>
          <Text style={styles.subtitle}>How may we assist you?</Text>
        </View>
        <Pressable onPress={() => setRoute('track')} style={styles.trackButton}>
          <Text style={styles.trackText}>◷ Track</Text>
        </Pressable>
      </View>

      <View style={[styles.grid, compact && styles.gridCompact]}>
        {requestTypes.map(type => (
          <Pressable key={type.id} onPress={() => openForm(type)} style={[styles.requestCard, compact && styles.requestCardCompact]}>
            <Text style={[styles.requestIcon, compact && styles.requestIconCompact]}>{type.icon}</Text>
            <Text style={[styles.requestTitle, compact && styles.requestTitleCompact]}>{type.title}</Text>
            <Text style={styles.requestSubtitle}>{type.subtitle}</Text>
            <Text style={styles.requestArrow}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.activeHeader}>
        <Text style={styles.sectionLabel}>Active Requests</Text>
        <Pressable onPress={() => setRoute('track')}>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>
      {activeRequests.slice(0, 2).map(item => (
        <ActiveRequestCard key={`${item.title}-${item.time}`} item={item} />
      ))}
    </ScreenScroll>
  );
}

type ActiveRequestCardProps = {
  item: (typeof activeRequests)[number];
  large?: boolean;
};

function ActiveRequestCard({item, large}: ActiveRequestCardProps): React.JSX.Element {
  const complete = item.status === 'Completed';

  return (
    <View style={[styles.activeCard, large && styles.activeCardLarge]}>
      <View style={styles.activeTop}>
        <Text style={styles.activeIcon}>{item.icon}</Text>
        <View style={styles.activeCopy}>
          <Text style={styles.activeTitle}>{item.title}</Text>
          <Text style={styles.activeDetail}>{item.detail}</Text>
        </View>
        <Text style={styles.activeTime}>{item.time}</Text>
      </View>
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map(step => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              step < (complete ? 4 : item.status === 'In Progress' ? 2 : 3) && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>
      <View style={[styles.status, complete && styles.statusComplete]}>
        <Text style={[styles.statusText, complete && styles.statusTextComplete]}>{item.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  homeHeaderCompact: {
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  titleCompact: {
    fontSize: 24,
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  caption: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  trackButton: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: colors.card,
  },
  trackText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCompact: {
    gap: 8,
  },
  requestCard: {
    width: '48.5%',
    minHeight: 116,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 14,
  },
  requestCardCompact: {
    width: '48%',
    minHeight: 96,
    borderRadius: 13,
    padding: 12,
  },
  requestIcon: {
    fontSize: 25,
    marginBottom: 18,
  },
  requestIconCompact: {
    fontSize: 21,
    marginBottom: 12,
  },
  requestTitle: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '900',
  },
  requestTitleCompact: {
    fontSize: 12,
  },
  requestSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 10,
  },
  requestArrow: {
    position: 'absolute',
    top: 16,
    right: 14,
    color: colors.mutedDark,
    fontSize: 20,
  },
  activeHeader: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  viewAll: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  formHeaderCompact: {
    marginBottom: 12,
  },
  formTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  backHit: {
    width: 28,
    height: 36,
    justifyContent: 'center',
  },
  back: {
    color: colors.gold,
    fontSize: 36,
    lineHeight: 36,
  },
  quickWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  quickWrapCompact: {
    gap: 8,
    marginTop: 9,
    marginBottom: 14,
  },
  quick: {
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  quickCompact: {
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  quickActive: {
    backgroundColor: colors.goldDeep,
    borderColor: colors.lineStrong,
  },
  quickText: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
    fontWeight: '800',
  },
  quickTextCompact: {
    fontSize: 11,
  },
  quickTextActive: {
    color: colors.gold,
  },
  detailsInput: {
    minHeight: 118,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
    color: colors.text,
    textAlignVertical: 'top',
    fontFamily: typography.sans,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 24,
  },
  detailsInputCompact: {
    minHeight: 92,
    padding: 13,
    marginTop: 8,
    marginBottom: 14,
  },
  submitted: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: navHeight + navBottomOffset,
  },
  submittedCompact: {
    paddingHorizontal: 16,
    paddingBottom: navHeight + navBottomOffset - 6,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircleCompact: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  successIcon: {
    color: colors.black,
    fontSize: 36,
    fontWeight: '900',
  },
  successTitle: {
    marginTop: 24,
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 24,
    fontWeight: '700',
  },
  successTitleCompact: {
    marginTop: 18,
    fontSize: 22,
  },
  successSubtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 13,
  },
  successSubtitleCompact: {
    marginBottom: 20,
    fontSize: 12,
  },
  successButton: {
    alignSelf: 'stretch',
  },
  outlineButton: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  activeCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 14,
    marginBottom: 10,
  },
  activeCardLarge: {
    minHeight: 118,
  },
  activeTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activeCopy: {
    flex: 1,
    minWidth: 0,
  },
  activeTitle: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '900',
  },
  activeDetail: {
    marginTop: 4,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 11,
  },
  activeTime: {
    color: colors.mutedDark,
    fontFamily: typography.sans,
    fontSize: 10,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 14,
    marginBottom: 10,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.goldDeep,
  },
  progressSegmentActive: {
    backgroundColor: colors.gold,
  },
  status: {
    alignSelf: 'flex-end',
    minHeight: 22,
    borderRadius: 11,
    backgroundColor: colors.goldDeep,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  statusComplete: {
    backgroundColor: 'rgba(120, 201, 108, 0.22)',
  },
  statusText: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 10,
    fontWeight: '900',
  },
  statusTextComplete: {
    color: colors.success,
  },
});
