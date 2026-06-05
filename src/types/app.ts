import type {ImageSourcePropType} from 'react-native';

export type TabKey = 'dining' | 'requests' | 'climate' | 'guide' | 'saved' | 'map';

export type MenuCategoryKey = 'signature' | 'light' | 'desserts';

export type PlaceCategoryKey = 'waterfront' | 'parks' | 'landmarks';

export type MenuItem = {
  id: string;
  category: MenuCategoryKey;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  image: ImageSourcePropType;
};

export type Place = {
  id: string;
  category: PlaceCategoryKey;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  address: string;
  rating: number;
  distance: string;
  image: ImageSourcePropType;
};

export type GuestProfile = {
  name: string;
  room: string;
  checkIn: string;
  checkOut: string;
};
