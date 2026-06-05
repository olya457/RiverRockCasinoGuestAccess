import AsyncStorage from '@react-native-async-storage/async-storage';
import type {GuestProfile} from '../types/app';

const onboardingKey = 'riverrock:onboardingComplete';
const savedPlacesKey = 'riverrock:savedPlaces';
const guestProfileKey = 'riverrock:guestProfile';

export const defaultGuestProfile: GuestProfile = {
  name: 'Demo Guest',
  room: 'Demo Room',
  checkIn: 'June 4, 2026',
  checkOut: 'June 8, 2026',
};

export async function loadOnboardingComplete(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(onboardingKey)) === 'true';
  } catch {
    return false;
  }
}

export async function saveOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(onboardingKey, 'true');
}

export async function loadSavedPlaceIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(savedPlacesKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export async function saveSavedPlaceIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(savedPlacesKey, JSON.stringify(ids));
}

export async function loadGuestProfile(): Promise<GuestProfile> {
  try {
    const raw = await AsyncStorage.getItem(guestProfileKey);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      ...defaultGuestProfile,
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
    };
  } catch {
    return defaultGuestProfile;
  }
}

export async function saveGuestProfile(profile: GuestProfile): Promise<void> {
  await AsyncStorage.setItem(guestProfileKey, JSON.stringify(profile));
}
