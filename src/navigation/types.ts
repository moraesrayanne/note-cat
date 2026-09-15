import { Medication } from '../types';

export type RootStackParamList = {
  Tabs: undefined;
  AddMedication: { medication?: Medication };
};

export type TabParamList = {
  Hoje: undefined;
  'Remédios': undefined;
  Adicionar: undefined;
  'Histórico': undefined;
  Perfil: undefined;
};
