import {Platform} from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const androidEdge = 30;
export const navBottomOffset = isAndroid ? 30 : 20;
export const navHeight = 78;
export const contentBottomPadding = navHeight + navBottomOffset + 28;
export const horizontalPadding = 20;
