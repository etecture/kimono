import ElectronStore from 'electron-store';
import { FormValues } from './form-schema';

export const store = new ElectronStore<{ values: FormValues; detailsCollapsed: boolean }>({
  name: 'kimono-create-electron-app'
});
