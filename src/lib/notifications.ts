import Constants, { ExecutionEnvironment } from 'expo-constants';
import type * as NotificationsType from 'expo-notifications';
import { Medication } from '@/types';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: typeof NotificationsType | null = null;

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function requestPermissions(): Promise<boolean> {
  if (isExpoGo) return false;
  const { status: existing } = await Notifications!.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications!.requestPermissionsAsync();
  return status === 'granted';
}

function getMedNotificationId(medId: string): string {
  return `med-${medId}`;
}

export async function scheduleMedNotification(med: Medication): Promise<void> {
  if (isExpoGo) return;
  const granted = await requestPermissions();
  if (!granted) return;

  await cancelMedNotification(med.id);

  const [hours, minutes] = med.time.substring(0, 5).split(':').map(Number);

  await Notifications!.scheduleNotificationAsync({
    identifier: getMedNotificationId(med.id),
    content: {
      title: `Hora do remédio! 💊`,
      body: `${med.name} - ${med.dose}`,
      sound: true,
    },
    trigger: {
      type: Notifications!.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });
}

export async function cancelMedNotification(medId: string): Promise<void> {
  if (isExpoGo) return;
  await Notifications!.cancelScheduledNotificationAsync(getMedNotificationId(medId));
}

export async function syncAllNotifications(meds: Medication[]): Promise<void> {
  if (isExpoGo) return;
  const granted = await requestPermissions();
  if (!granted) return;

  await Notifications!.cancelAllScheduledNotificationsAsync();

  for (const med of meds) {
    if (med.active) {
      await scheduleMedNotification(med);
    }
  }
}
