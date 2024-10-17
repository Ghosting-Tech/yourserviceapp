import { messaging } from "@/firebase";
import { getToken } from "firebase/messaging";

export default async function requestNotification() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    // Generate Token
    const token = await getToken(messaging, {
      vapidKey:
        "BOgpr-kDAezvqe4NBwg713HNE7wjhLpuYmfQxprV6yj1glWlOW4a4RSRMb_w4wpGyIrYYvmtzj-X5gPcBolRuIw",
    });
    console.log("Token: ", token);
    // Send this token  to server ( db)
    return { success: true, token, messaging: "Token generated successfully" };
  } else if (permission === "denied") {
    return { success: false, messaging: "Denied notification request" };
  }
}
