import {Platform} from 'react-native';

export const typography = {
  serif: Platform.select({ios: 'Georgia', android: 'serif', default: 'serif'}),
  sans: Platform.select({ios: 'System', android: 'sans-serif', default: 'System'}),
};
