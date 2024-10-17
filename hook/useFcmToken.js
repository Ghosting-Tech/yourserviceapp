"use client";
import { useEffect, useRef, useState } from "react";
import { onMessage } from "firebase/messaging";
import { fetchToken, messaging } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = (shouldFetchToken) => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState(null);
  const [token, setToken] = useState(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;
    const token = await getNotificationPermissionAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        toast.error("Unable to load token, refresh the browser");
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;
  };

  useEffect(() => {
    if (shouldFetchToken && "Notification" in window) {
      loadToken();
    }
  }, [shouldFetchToken]);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return;

      const m = await messaging();
      if (!m) return;

      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        const link = payload.fcmOptions?.link || payload.data?.link;

        if (link) {
          toast.info(`${payload.notification?.title}: ${payload.notification?.body}`, {
            action: {
              label: "Visit",
              onClick: () => router.push(link),
            },
          });
        } else {
          toast.info(`${payload.notification?.title}: ${payload.notification?.body}`);
        }

        const n = new Notification(payload.notification?.title || "New message", {
          body: payload.notification?.body || "This is a new message",
          data: link ? { url: link } : undefined,
        });

        n.onclick = (event) => {
          event.preventDefault();
          const link = event.target?.data?.url;
          if (link) {
            router.push(link);
          }
        };
      });

      return unsubscribe;
    };

    let unsubscribe = null;
    if (token) {
      setupListener().then((unsub) => {
        unsubscribe = unsub;
      });
    }

    return () => unsubscribe?.();
  }, [token, router]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
