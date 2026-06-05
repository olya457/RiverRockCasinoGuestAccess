import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View} from 'react-native';
import {CompactKeyboard} from '../components/CompactKeyboard';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenScroll} from '../components/ScreenScroll';
import {menuCategories, menuItems} from '../data/menu';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import type {GuestProfile, MenuCategoryKey, MenuItem} from '../types/app';
import {navBottomOffset, navHeight} from '../utils/layout';

export type DiningRoute = 'menu' | 'summary' | 'confirmed';

type Props = {
  profile: GuestProfile;
  route: DiningRoute;
  cart: Record<string, number>;
  onAdd: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onViewOrder: () => void;
  onPlaceOrder: () => void;
  onBackToMenu: () => void;
};

export function DiningScreen({
  profile,
  route,
  cart,
  onAdd,
  onIncrement,
  onDecrement,
  onViewOrder,
  onPlaceOrder,
  onBackToMenu,
}: Props): React.JSX.Element {
  const [category, setCategory] = useState<MenuCategoryKey>('signature');
  const [instructions, setInstructions] = useState('');
  const [instructionsKeyboardVisible, setInstructionsKeyboardVisible] = useState(false);
  const {height, width} = useWindowDimensions();
  const compact = height < 740 || width < 370;
  const menuImageHeight = compact
    ? Math.min(146, Math.max(118, (width - 32) * 0.36))
    : Math.min(178, Math.max(144, (width - 40) * 0.42));
  const selectedItems = useMemo(
    () =>
      menuItems
        .map(item => ({item, quantity: cart[item.id] ?? 0}))
        .filter(entry => entry.quantity > 0),
    [cart],
  );
  const subtotal = selectedItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const service = subtotal * 0.15;
  const total = subtotal + service;
  const filteredItems = menuItems.filter(item => item.category === category);

  function backToMenu() {
    setInstructionsKeyboardVisible(false);
    onBackToMenu();
  }

  if (route === 'confirmed') {
    return (
      <View style={[styles.confirmed, compact && styles.confirmedCompact]}>
        <View style={[styles.confirmIcon, compact && styles.confirmIconCompact]}>
          <Text style={styles.confirmIconText}>✓</Text>
        </View>
        <Text style={[styles.confirmTitle, compact && styles.confirmTitleCompact]}>Order Confirmed</Text>
        <Text style={[styles.confirmSubtitle, compact && styles.confirmSubtitleCompact]}>
          Your order will arrive in approximately 35 minutes
        </Text>

        <View style={styles.confirmCard}>
          <SummaryLine label="Guest" value={profile.name} />
          <SummaryLine label="Room" value={profile.room} />
          <SummaryLine label="ETA" value="35 min" highlight />
          <SummaryLine label="Total" value={`$${total.toFixed(2)}`} highlight />
        </View>

        <PrimaryButton label="Back to Menu" onPress={backToMenu} style={styles.confirmButton} />
      </View>
    );
  }

  if (route === 'summary') {
    return (
      <ScreenScroll>
        <View style={styles.titleRow}>
          <Pressable onPress={backToMenu} style={styles.backHit}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Order Summary</Text>
        </View>

        <View style={styles.guestCard}>
          <SummaryLine label="Guest" value={profile.name} />
          <SummaryLine label="Room" value={profile.room} />
        </View>

        {selectedItems.map(({item, quantity}) => (
          <View key={item.id} style={styles.summaryItem}>
            <Image source={item.image} style={styles.summaryImage} />
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.summaryQty}>x{quantity}</Text>
            </View>
            <Text style={styles.summaryPrice}>${(item.price * quantity).toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.formLabel}>Special Instructions</Text>
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          onFocus={() => setInstructionsKeyboardVisible(true)}
          showSoftInputOnFocus={false}
          multiline
          placeholder="Allergies, preferences, special requests..."
          placeholderTextColor={colors.mutedDark}
          selectionColor={colors.gold}
          style={styles.instructions}
        />

        <CompactKeyboard
          visible={instructionsKeyboardVisible}
          value={instructions}
          onChange={setInstructions}
          onDone={() => setInstructionsKeyboardVisible(false)}
        />

        <View style={styles.totalCard}>
          <SummaryLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <SummaryLine label="Service Charge (15%)" value={`$${service.toFixed(2)}`} />
          <View style={styles.totalDivider} />
          <SummaryLine label="Total" value={`$${total.toFixed(2)}`} highlight large />
          <Text style={styles.eta}>◷ Estimated delivery: 35 minutes</Text>
        </View>

        <PrimaryButton
          label={`Place Order · $${total.toFixed(2)}`}
          onPress={() => {
            setInstructionsKeyboardVisible(false);
            onPlaceOrder();
          }}
        />
      </ScreenScroll>
    );
  }

  return (
    <View style={styles.menuRoot}>
      <ScreenScroll contentStyle={selectedItems.length > 0 ? styles.menuContentWithBar : undefined}>
        <Text style={styles.title}>Room Service</Text>
        <Text style={styles.subtitle}>Delivered to your door</Text>

        <View style={[styles.categoryRow, compact && styles.categoryRowCompact]}>
          {menuCategories.map(item => {
            const active = category === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() => setCategory(item.key)}
                style={[styles.categoryCard, compact && styles.categoryCardCompact, active && styles.categoryActive]}>
                <Text style={[styles.categoryIcon, compact && styles.categoryIconCompact]}>{item.icon}</Text>
                <Text style={[styles.categoryLabel, compact && styles.categoryLabelCompact, active && styles.categoryLabelActive]} numberOfLines={2}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredItems.map(item => (
          <MenuCard
            key={item.id}
            item={item}
            quantity={cart[item.id] ?? 0}
            imageHeight={menuImageHeight}
            compact={compact}
            onAdd={() => onAdd(item.id)}
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id)}
          />
        ))}
      </ScreenScroll>

      {selectedItems.length > 0 ? (
        <View style={[styles.orderBar, compact && styles.orderBarCompact]}>
          <View style={styles.orderCount}>
            <Text style={styles.orderCountText}>{selectedItems.reduce((sum, entry) => sum + entry.quantity, 0)}</Text>
          </View>
          <Pressable onPress={onViewOrder} style={styles.orderButton}>
            <Text style={[styles.orderLabel, compact && styles.orderLabelCompact]}>🛒 View Order</Text>
          </Pressable>
          <Text style={[styles.orderPrice, compact && styles.orderPriceCompact]}>${subtotal.toFixed(2)}</Text>
        </View>
      ) : null}
    </View>
  );
}

type MenuCardProps = {
  item: MenuItem;
  quantity: number;
  imageHeight: number;
  compact: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

function MenuCard({
  item,
  quantity,
  imageHeight,
  compact,
  onAdd,
  onIncrement,
  onDecrement,
}: MenuCardProps): React.JSX.Element {
  return (
    <View style={[styles.menuCard, compact && styles.menuCardCompact]}>
      <Image source={item.image} resizeMode="cover" style={[styles.menuImage, {height: imageHeight}]} />
      <View style={[styles.menuInfo, compact && styles.menuInfoCompact]}>
        <View style={styles.menuTop}>
          <Text style={[styles.menuName, compact && styles.menuNameCompact]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.menuPrice, compact && styles.menuPriceCompact]}>${item.price}</Text>
        </View>
        <Text style={[styles.menuDescription, compact && styles.menuDescriptionCompact]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={[styles.menuBottom, compact && styles.menuBottomCompact]}>
          <Text style={styles.time}>◷ {item.prepTime} min</Text>
          {quantity === 0 ? (
            <Pressable onPress={onAdd} style={[styles.addButton, compact && styles.addButtonCompact]}>
              <Text style={[styles.addText, compact && styles.addTextCompact]}>＋ Add</Text>
            </Pressable>
          ) : (
            <View style={styles.qty}>
              <Pressable onPress={onDecrement} style={styles.qtyButton}>
                <Text style={styles.qtyText}>−</Text>
              </Pressable>
              <Text style={styles.qtyCount}>{quantity}</Text>
              <Pressable onPress={onIncrement} style={[styles.qtyButton, styles.qtyButtonActive]}>
                <Text style={styles.qtyTextActive}>＋</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

type SummaryLineProps = {
  label: string;
  value: string;
  highlight?: boolean;
  large?: boolean;
};

function SummaryLine({label, value, highlight, large}: SummaryLineProps): React.JSX.Element {
  return (
    <View style={styles.summaryLine}>
      <Text style={[styles.summaryLabel, large && styles.summaryLabelLarge]}>{label}</Text>
      <Text style={[styles.summaryValue, highlight && styles.summaryValueHighlight, large && styles.summaryValueLarge]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  menuRoot: {
    flex: 1,
  },
  menuContentWithBar: {
    paddingBottom: navHeight + navBottomOffset + 110,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backHit: {
    width: 28,
    height: 32,
    justifyContent: 'center',
  },
  back: {
    color: colors.gold,
    fontSize: 36,
    lineHeight: 36,
  },
  title: {
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    color: colors.goldMuted,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 14,
  },
  categoryRowCompact: {
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
  },
  categoryCard: {
    flex: 1,
    minHeight: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  categoryCardCompact: {
    minHeight: 66,
    borderRadius: 13,
    paddingHorizontal: 6,
  },
  categoryActive: {
    backgroundColor: colors.goldDeep,
    borderColor: colors.lineStrong,
  },
  categoryIcon: {
    fontSize: 21,
    marginBottom: 8,
  },
  categoryIconCompact: {
    fontSize: 18,
    marginBottom: 5,
  },
  categoryLabel: {
    color: colors.muted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 10,
    fontWeight: '800',
  },
  categoryLabelCompact: {
    fontSize: 9,
  },
  categoryLabelActive: {
    color: colors.text,
  },
  menuCard: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    marginBottom: 14,
  },
  menuCardCompact: {
    borderRadius: 14,
    marginBottom: 10,
  },
  menuImage: {
    width: '100%',
  },
  menuInfo: {
    padding: 16,
  },
  menuInfoCompact: {
    padding: 12,
  },
  menuTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuName: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 18,
    fontWeight: '700',
  },
  menuNameCompact: {
    fontSize: 16,
  },
  menuPrice: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 18,
    fontWeight: '900',
  },
  menuPriceCompact: {
    fontSize: 16,
  },
  menuDescription: {
    marginTop: 8,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
    lineHeight: 19,
  },
  menuDescriptionCompact: {
    fontSize: 11,
    lineHeight: 17,
  },
  menuBottom: {
    marginTop: 16,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBottomCompact: {
    marginTop: 10,
    minHeight: 36,
  },
  time: {
    color: colors.mutedDark,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  addButton: {
    height: 38,
    minWidth: 82,
    borderRadius: 19,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  addButtonCompact: {
    height: 34,
    minWidth: 72,
    borderRadius: 17,
    paddingHorizontal: 12,
  },
  addText: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 14,
    fontWeight: '900',
  },
  addTextCompact: {
    fontSize: 13,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardRaised,
  },
  qtyButtonActive: {
    backgroundColor: colors.gold,
  },
  qtyText: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '900',
  },
  qtyTextActive: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '900',
  },
  qtyCount: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '900',
  },
  orderBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: navHeight + navBottomOffset + 10,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: colors.black,
    shadowOpacity: 0.42,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  orderBarCompact: {
    left: 16,
    right: 16,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  orderCount: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCountText: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '900',
  },
  orderButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderLabel: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '900',
  },
  orderLabelCompact: {
    fontSize: 14,
  },
  orderPrice: {
    color: colors.black,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '900',
  },
  orderPriceCompact: {
    fontSize: 14,
  },
  guestCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  summaryImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 12,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryName: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 14,
    fontWeight: '900',
  },
  summaryQty: {
    marginTop: 4,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  summaryPrice: {
    color: colors.gold,
    fontFamily: typography.sans,
    fontSize: 16,
    fontWeight: '900',
  },
  formLabel: {
    marginTop: 4,
    marginBottom: 8,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  instructions: {
    minHeight: 86,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
    color: colors.text,
    textAlignVertical: 'top',
    fontFamily: typography.sans,
    fontSize: 13,
    marginBottom: 16,
  },
  totalCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 22,
  },
  summaryLine: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  summaryLabel: {
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 13,
  },
  summaryLabelLarge: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  summaryValue: {
    color: colors.text,
    fontFamily: typography.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryValueHighlight: {
    color: colors.gold,
  },
  summaryValueLarge: {
    fontSize: 17,
    fontWeight: '900',
  },
  totalDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 8,
  },
  eta: {
    marginTop: 8,
    color: colors.muted,
    fontFamily: typography.sans,
    fontSize: 12,
  },
  confirmed: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: navHeight + navBottomOffset,
  },
  confirmedCompact: {
    paddingHorizontal: 16,
    paddingBottom: navHeight + navBottomOffset - 6,
  },
  confirmIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.34,
    shadowRadius: 24,
  },
  confirmIconCompact: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  confirmIconText: {
    color: colors.white,
    fontSize: 38,
    fontWeight: '900',
  },
  confirmTitle: {
    marginTop: 28,
    color: colors.text,
    fontFamily: typography.serif,
    fontSize: 28,
    fontWeight: '700',
  },
  confirmTitleCompact: {
    marginTop: 20,
    fontSize: 24,
  },
  confirmSubtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: typography.sans,
    fontSize: 13,
  },
  confirmSubtitleCompact: {
    marginBottom: 18,
    fontSize: 12,
  },
  confirmCard: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
});
