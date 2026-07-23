import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { prisma } from '../../prisma/prismaClient.js';

// Create a new Expo SDK client
const expo = new Expo();

export const sendPushNotificationToUser = async (
  userId: number,
  title: string,
  body: string,
  data?: object,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { expoPushToken: true },
  });

  if (!user || !user.expoPushToken) {
    console.log(`No push token found for user ${userId}`);
    return;
  }

  if (!Expo.isExpoPushToken(user.expoPushToken)) {
    console.error(`Push token ${user.expoPushToken} is not a valid Expo push token`);
    return;
  }

  const messages: ExpoPushMessage[] = [
    {
      to: user.expoPushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  return tickets;
};
