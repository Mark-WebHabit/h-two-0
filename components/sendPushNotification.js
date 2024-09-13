import axios from "axios";

export const sendPushNotification = async (expoPushToken, title, body) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { title, body },
  };

  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      message
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
