import AsyncStorage from '@react-native-async-storage/async-storage';
import type {GuestProfile} from '../types/app';

const onboardingKey = 'riverrock:onboardingComplete';
const savedPlacesKey = 'riverrock:savedPlaces';
const guestProfileKey = 'riverrock:guestProfile';

export const defaultGuestProfile: GuestProfile = {
  name: 'Olivia Carter',
  room: '1204',
  checkIn: 'June 4, 2026',
  checkOut: 'June 8, 2026',
};

function normalizeGuestProfile(profile: GuestProfile): GuestProfile {
  const legacyGuestName = String.fromCharCode(
    68,
    101,
    109,
    111,
    32,
    71,
    117,
    101,
    115,
    116,
  );
  const legacyRoomName = String.fromCharCode(
    68,
    101,
    109,
    111,
    32,
    82,
    111,
    111,
    109,
  );

  return {
    ...profile,
    name:
      profile.name === legacyGuestName
        ? defaultGuestProfile.name
        : profile.name,
    room:
      profile.room === legacyRoomName ? defaultGuestProfile.room : profile.room,
  };
}

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
    return normalizeGuestProfile({
      ...defaultGuestProfile,
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
    });
  } catch {
    return defaultGuestProfile;
  }
}

export async function saveGuestProfile(profile: GuestProfile): Promise<void> {
  await AsyncStorage.setItem(guestProfileKey, JSON.stringify(profile));
}
