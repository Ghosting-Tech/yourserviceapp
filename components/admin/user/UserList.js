import { MdOpenInNew } from "react-icons/md";
import {
  Button,
  Dialog,
  DialogFooter,
  ListItem,
  ListItemSuffix,
} from "@material-tailwind/react";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaUserAltSlash } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { TiMediaFastForward } from "react-icons/ti";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
}
const UserList = ({
  allUsers,
  userDeleting,
  userDeactivating,
  serviceProvider = false,
}) => {
  const [openDialogId, setOpenDialogId] = useState(null);

  const handleOpen = (userId) => {
    setOpenDialogId(userId);
  };

  const handleClose = () => {
    setOpenDialogId(null);
  };
  return (
    <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-10 mt-8">
      {allUsers.map((user) => (
        <div
          className="border p-4 bg-white shadow flex flex-col gap-4 rounded-lg"
          key={user._id}
        >
          <div className="flex gap-2 items-center">
            {user?.image?.url ? (
              <Image
                src={user.image.url}
                alt={user.name}
                width={100}
                height={100}
                className="w-16 h-16 object-cover rounded-full"
              />
            ) : (
              <div className="w-16 h-16 text-2xl rounded-full flex justify-center text-black font-junge items-center bg-gray-400 cursor-pointer">
                {user.name && Array.from(user.name)[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div>
                <span
                  className={`border ${
                    user.active ? "bg-teal-100" : "bg-red-100"
                  }  text-xs ${
                    user.active ? "text-teal-700" : "text-red-700"
                  }  px-2 py-1 rounded-full`}
                >
                  {user.active ? "active" : "Inactive"}
                </span>
              </div>
              <div className="font-bold text-indigo-500 text-xl">
                {user.name}
              </div>
              <div className="text-red-700 text-xs">
                {user.lastVisit ? (
                  <>
                    Last visit:{" "}
                    {new Date(user.lastVisit).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </>
                ) : (
                  <>
                    Account created on:{" "}
                    {new Date(user.createdAt).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-center gap-4">
              {serviceProvider && (
                <Link
                  href={`/admin/service-providers/login-history/${user._id}`}
                  className="w-full"
                >
                  <Button
                    size="sm"
                    variant="gradient"
                    color="teal"
                    className="flex items-center gap-1 w-full justify-center rounded"
                  >
                    Login history <TiMediaFastForward />
                  </Button>
                </Link>
              )}
              <Button
                size="sm"
                variant="gradient"
                color="indigo"
                onClick={() => handleOpen(user._id)}
                className="flex items-center gap-1 w-full justify-center rounded"
              >
                View <MdOpenInNew />
              </Button>
            </div>

            {openDialogId === user._id && (
              <Dialog
                size="lg"
                open={openDialogId}
                handler={handleClose}
                className="bg-gray-200 px-4 md:px-10"
              >
                <div>
                  <div className="flex justify-between items-center py-6">
                    <h1 className="text-2xl font-bold text-indigo-500 font-lato text-center">
                      {serviceProvider
                        ? "Service Provider Details"
                        : "User Details"}
                    </h1>
                    <button
                      onClick={handleClose}
                      title="Close"
                      className="hover:scale-125 transition-all duration-500 ease-in-out "
                    >
                      <RxCross2 size={25} />
                    </button>
                  </div>
                  <div>
                    {/* Dialog content */}
                    <div className="flex gap-4">
                      {user?.image?.url ? (
                        <Image
                          src={user.image.url}
                          alt={user.name}
                          width={500}
                          height={500}
                          className=" max-w-28 aspect-square h-full rounded-md object-cover drop-shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 text-6xl text-black rounded-full flex justify-center items-center font-junge bg-gray-400 cursor-pointer">
                          {user.name && Array.from(user.name)[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col gap-1 justify-center">
                        <div>
                          <span
                            className={`border ${
                              user.active ? "bg-teal-100" : "bg-red-100"
                            }  text-xs ${
                              user.active ? "text-teal-700" : "text-red-700"
                            }  px-2 py-1 rounded-full`}
                          >
                            {user.active ? "active" : "Inactive"}
                          </span>
                        </div>
                        <h1 className="font-bold text-5xl text-gray-700">
                          {user.name}
                        </h1>
                        <div className="text-red-700 text-sm">
                          Last visit:{" "}
                          {new Date(
                            user.lastVisit ? user.lastVisit : user.createdAt
                          ).toLocaleDateString("en-US", options)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 grid grid-cols-1 gap-4 rounded-lg shadow-md mt-6">
                      <ListItem>
                        Phone Number
                        <ListItemSuffix>{user.phoneNumber}</ListItemSuffix>
                      </ListItem>
                      <ListItem>
                        E-mail
                        <ListItemSuffix>{user.email}</ListItemSuffix>
                      </ListItem>
                      <ListItem>
                        Gender
                        <ListItemSuffix>{user.gender}</ListItemSuffix>
                      </ListItem>
                      <ListItem>
                        City
                        <ListItemSuffix>{user.city}</ListItemSuffix>
                      </ListItem>
                      <ListItem>
                        Account Created at
                        <ListItemSuffix>
                          {formatDate(user.createdAt)}
                        </ListItemSuffix>
                      </ListItem>
                    </div>
                  </div>
                  {/* Dialog Footer */}
                  <DialogFooter className="flex items-center gap-2 justify-end p-0 py-5">
                    <Button
                      variant="gradient"
                      size="sm"
                      color="deep-orange"
                      onClick={() => {
                        userDeleting(user);
                      }}
                      className="flex items-center gap-1 rounded"
                    >
                      {serviceProvider ? "Delete Service Provider" : "Delete User"}
                      <AiOutlineUserDelete />
                    </Button>
                    <Button
                      variant="gradient"
                      color="blue"
                      size="sm"
                      onClick={() => userDeactivating(user)}
                      className="flex items-center gap-1 rounded"
                    >
                      <span>
                        {user.active ? "Deactivate" : "Activate"}
                      </span>
                      <FaUserAltSlash />
                    </Button>
                  </DialogFooter>
                </div>
              </Dialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
