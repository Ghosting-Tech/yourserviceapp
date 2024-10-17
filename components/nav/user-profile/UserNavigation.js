import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  FaCalendarCheck,
  FaHistory,
  FaMicroblog,
  FaUser,
} from "react-icons/fa";
import { FaBoxesStacked, FaUsersGear } from "react-icons/fa6";
import Link from "next/link";
import {
  MdDashboardCustomize,
  MdManageAccounts,
  MdOutlineManageHistory,
  MdOutlinePayment,
} from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slice/userSlice";
import Image from "next/image";

const UserNavigation = ({ handleOpenLoginDialog }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.userLoading);

  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "GET",
    });
    toast.success("Logged out successfully!");
    router.push("/");
    dispatch(setUser(null));
  };

  return (
    <>
      {userLoading ? (
        <div className="animate-pulse">
          <Avatar
            as="div"
            variant="circular"
            size="md"
            alt="Profile"
            color="blue-gray"
            className=" p-0.5 cursor-progress"
            src={"/profile.svg"}
          />
        </div>
      ) : user?.role ? (
        <Menu allowHover={true} placement="bottom-start">
          <MenuHandler>
            {user?.image?.url ? (
              <Image
                width={200}
                height={200}
                src={user.image.url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex justify-center items-center font-junge bg-gray-400 cursor-pointer">
                {user.name && Array.from(user.name)[0].toUpperCase()}
              </div>
            )}
          </MenuHandler>
          {user.role === "user" ? (
            <MenuList>
              <Link href={`/user`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Profile <FaUser size={12} />
                </MenuItem>
              </Link>
              <Link href={`/user/bookings?page=1`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Booking <FaCalendarCheck />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
            </MenuList>
          ) : user.role === "service-provider" ? (
            <MenuList
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <Link href={`/service-provider`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Profile <FaUser size={12} />
                </MenuItem>
              </Link>
              <Link
                href={`/service-provider/booking?page=1`}
                className="outline-none"
              >
                <MenuItem className="justify-center flex items-center gap-1">
                  Booking <FaCalendarCheck />
                </MenuItem>
              </Link>
              <Link
                href={`/service-provider/payment?page=1`}
                className="outline-none"
              >
                <MenuItem className="justify-center flex items-center gap-1">
                  Payment History <MdOutlinePayment />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
            </MenuList>
          ) : (
            <MenuList>
              <Link href={`/admin`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Dashboard <MdDashboardCustomize />
                </MenuItem>
              </Link>
              <Link href={`/admin/services`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Manage Services <MdOutlineManageHistory />
                </MenuItem>
              </Link>
              <Link href={`/admin/bookings?page=1`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Manage Bookings <FaBoxesStacked />
                </MenuItem>
              </Link>
              <Link href={`/admin/users?page=1`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Manage Users <MdManageAccounts />
                </MenuItem>
              </Link>
              <Link href={`/admin/service-providers`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Service Provider <FaUsersGear />
                </MenuItem>
              </Link>
              <Link href={`/admin/payments`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Manage Payments <MdOutlinePayment />
                </MenuItem>
              </Link>
              <Link href={`/admin/blogs`} className="outline-none">
                <MenuItem className="justify-center flex items-center gap-1">
                  Blogs <FaMicroblog />
                </MenuItem>
              </Link>
              <MenuItem
                className="text-red-400 justify-center flex items-center gap-1"
                onClick={handleLogout}
              >
                Logout <IoLogOut />
              </MenuItem>
            </MenuList>
          )}
        </Menu>
      ) : (
        <Button
          variant="gradient"
          size="md"
          className="rounded h-full"
          onClick={handleOpenLoginDialog}
        >
          Log In
        </Button>
      )}
    </>
  );
};

export default UserNavigation;
