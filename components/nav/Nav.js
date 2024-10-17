"use client";
import { Collapse, IconButton } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import NavList from "./NavList";
import Profile from "./user-profile/Profile";
import UserNavigation from "./user-profile/UserNavigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserLoading } from "@/redux/slice/userSlice";
import useFcmToken from "@/hook/useFcmToken";

export default function Nav() {
  const [openNav, setOpenNav] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const handleOpenLoginDialog = () => setOpenLoginDialog(!openLoginDialog);

  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.userLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const response = await fetch(`/api/users/check-authorization`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.message === "Unauthorized") {
          return;
        }
        if (!data.success) {
          return toast.error(data.message);
        }
        dispatch(setUser(data.user));
      } catch (err) {
        console.log(err);
        toast.error("Error fetching user");
      } finally {
        dispatch(setUserLoading(false));
      }
    };
    gettingUser();
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, [dispatch]);

  const { token, notificationPermissionStatus } = useFcmToken(!!user.name);

  const updateUserToken = async () => {
    if (user.name) {
      if (user.notificationToken == token) return;
      const res = await fetch(`/api/users/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          notificationToken: token,
        }),
      });

      const data = await res.json();

      dispatch(setUser(data));
    }
  };

  useEffect(() => {
    updateUserToken();
  }, [user, token, updateUserToken]);

  const handleTestNotification = async () => {
    if (!token) {
      console.error("No token available for notifications");
      return;
    }

    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification",
        link: "/contact",
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="mx-auto max-w-full px-4 py-2 rounded-none shadow-none border-none bg-transparent z-50">
      <div className="flex items-center justify-between text-blue-gray-900 bg-transparent">
        <Link
          href={"/"}
          className="mr-4 cursor-pointer font-extrabold py-1.5 lg:ml-2"
        >
          <Image
            onClick={handleTestNotification}
            width={500}
            height={500}
            src="/logo/logo.svg"
            alt="logo"
            className="cursor-pointer w-56 object-cover"
          />
        </Link>
        <div className="hidden gap-2 lg:flex lg:items-center lg:justify-end w-full">
          <NavList />
          <Profile
            openLoginDialog={openLoginDialog}
            handleOpenLoginDialog={handleOpenLoginDialog}
            setOpenLoginDialog={setOpenLoginDialog}
          />
        </div>
        <div className="flex items-center justify-end gap-1">
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>
          <div className="flex w-fit items-center gap-2 lg:hidden">
            <UserNavigation
              userLoading={userLoading}
              user={user}
              handleOpenLoginDialog={handleOpenLoginDialog}
            />
          </div>
        </div>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </div>
  );
}
