import ElectronStore from 'electron-store';
import { FormValues } from './screens/create-project/form-schema';

export const store = new ElectronStore<{ values: FormValues }>();
