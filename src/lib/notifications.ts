import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function getMedNotificationId(medId: string): string {
  return `med-${medId}`;
}

export async function scheduleMedNotification(med: Medication): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) return;

  await cancelMedNotification(med.id);

  const [hours, minutes] = med.time.substring(0, 5).split(':').map(Number);

  await Notifications.scheduleNotificationAsync({
    identifier: getMedNotificationId(med.id),
    content: {
      title: `Hora do remédio! 💊`,
      body: `${med.name} - ${med.dose}`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  });
}

export async function cancelMedNotification(medId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(getMedNotificationId(medId));
}

export async function syncAllNotifications(meds: Medication[]): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const med of meds) {
    if (med.active) {
      await scheduleMedNotification(med);
    }
  }
}
