import { Medication, DiaryEntry } from '@/types';

export type RootStackParamList = {
  Tabs: undefined;
  AddMedication: { medication?: Medication };
  Diary: undefined;
  AddDiaryEntry: { entry?: DiaryEntry };
};

export type TabParamList = {
  Hoje: undefined;
  Remédios: undefined;
  Adicionar: undefined;
  Histórico: undefined;
  Perfil: undefined;
};
