import React, {useEffect, useState} from 'react';
import {MainShell} from '../components/MainShell';
import {ClimateScreen} from '../screens/ClimateScreen';
import {DiningRoute, DiningScreen} from '../screens/DiningScreen';
import {GuideScreen} from '../screens/GuideScreen';
import {MapScreen} from '../screens/MapScreen';
import {RequestsScreen} from '../screens/RequestsScreen';
import {SavedScreen} from '../screens/SavedScreen';
import {
  defaultGuestProfile,
  loadGuestProfile,
  loadSavedPlaceIds,
  saveGuestProfile,
  saveSavedPlaceIds,
} from '../storage/persistence';
import type {GuestProfile, TabKey} from '../types/app';

export function AppNavigator(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('dining');
  const [profile, setProfile] = useState<GuestProfile>(defaultGuestProfile);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);
  const [mapFocusPlaceId, setMapFocusPlaceId] = useState<string | null>(null);
  const [diningRoute, setDiningRoute] = useState<DiningRoute>('menu');
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;

    Promise.all([loadGuestProfile(), loadSavedPlaceIds()]).then(([storedProfile, storedSavedIds]) => {
      if (alive) {
        setProfile(storedProfile);
        setSavedPlaceIds(storedSavedIds);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  function changeTab(tab: TabKey) {
    setActiveTab(tab);
  }

  function updateCart(id: string, delta: number) {
    setCart(current => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = {...current};

      if (nextQuantity === 0) {
        delete next[id];
      } else {
        next[id] = nextQuantity;
      }

      return next;
    });
  }

  async function toggleSave(id: string) {
    const next = savedPlaceIds.includes(id)
      ? savedPlaceIds.filter(savedId => savedId !== id)
      : [...savedPlaceIds, id];

    setSavedPlaceIds(next);
    await saveSavedPlaceIds(next);
  }

  async function updateProfile(nextProfile: GuestProfile) {
    setProfile(nextProfile);
    await saveGuestProfile(nextProfile);
  }

  function viewOnMap(id: string) {
    setMapFocusPlaceId(id);
    setActiveTab('map');
  }

  function backToMenu() {
    setDiningRoute('menu');

    if (Object.keys(cart).length > 0 && diningRoute === 'confirmed') {
      setCart({});
    }
  }

  let screen: React.ReactNode;

  if (activeTab === 'dining') {
    screen = (
      <DiningScreen
        profile={profile}
        route={diningRoute}
        cart={cart}
        onAdd={id => updateCart(id, 1)}
        onIncrement={id => updateCart(id, 1)}
        onDecrement={id => updateCart(id, -1)}
        onViewOrder={() => setDiningRoute('summary')}
        onPlaceOrder={() => setDiningRoute('confirmed')}
        onBackToMenu={backToMenu}
      />
    );
  } else if (activeTab === 'requests') {
    screen = <RequestsScreen />;
  } else if (activeTab === 'climate') {
    screen = <ClimateScreen />;
  } else if (activeTab === 'guide') {
    screen = <GuideScreen savedPlaceIds={savedPlaceIds} onToggleSave={toggleSave} />;
  } else if (activeTab === 'saved') {
    screen = (
      <SavedScreen
        savedPlaceIds={savedPlaceIds}
        onToggleSave={toggleSave}
        onViewOnMap={viewOnMap}
      />
    );
  } else {
    screen = (
      <MapScreen
        savedPlaceIds={savedPlaceIds}
        focusPlaceId={mapFocusPlaceId}
        onToggleSave={toggleSave}
      />
    );
  }

  return (
    <MainShell
      activeTab={activeTab}
      profile={profile}
      onTabChange={changeTab}
      onProfileSave={updateProfile}>
      {screen}
    </MainShell>
  );
}
