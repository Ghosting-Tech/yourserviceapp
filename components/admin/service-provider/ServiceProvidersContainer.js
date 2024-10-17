"use client";
import { FaUsers } from "react-icons/fa6";
import { Input, Select, Option } from "@material-tailwind/react";
import { IoIosSearch } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/firebase";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import UserList from "@/components/admin/user/UserList";
import PaginationBtn from "@/components/PaginationBtn";
import Loading from "@/components/Loading";

export default function ServiceProvidersContainer() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;

  const [allUsers, setAllUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [filterByStatus, setFilterByStatus] = useState("both");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for data fetch

  const fetchingServiceProviders = useCallback(async () => {
    const limit = 12;
    try {
      const response = await fetch(
        `/api/admin/service-providers?page=${page}&limit=${limit}&search=${searchQuery}&status=${filterByStatus}`
      );
      const data = await response.json();
      if (data.success) {
        setAllUsers(data.users);
        setMeta(data.meta);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, filterByStatus, searchQuery]);

  useEffect(() => {
    fetchingServiceProviders();
  }, [fetchingServiceProviders]);

  const userDeactivating = async (user) => {
    try {
      const updatedUser = { ...user, active: !user.active };
      const response = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        toast.success(
          `User ${
            updatedUser.active ? "activated" : "deactivated"
          } successfully`
        );
        setAllUsers((prev) =>
          prev.map((u) => (u._id === user._id ? updatedUser : u))
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const userDeleting = async (user) => {
    const confirmation = confirm(`Are you sure you want to delete this user?`);
    if (!confirmation) return;
    if (user.image?.url) {
      await deleteObject(ref(storage, user.image.name));
    }
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        fetchingServiceProviders();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row w-full py-4 justify-between px-10 items-center">
        <div className="flex gap-2 items-center text-gray-700">
          <FaUsers size={30} />
          <span className="text-3xl font-bold">All Service Provider</span>
        </div>
        <div className="flex md:w-fit w-full md:flex-row flex-col gap-3 items-center">
          <div className="md:w-72 w-full">
            <Input
              label="Search Service Provider"
              className="bg-white"
              icon={<IoIosSearch />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              color="indigo"
            />
          </div>
          <div className="md:w-60 w-full bg-white">
            <Select
              label="Filter By Status"
              value={filterByStatus}
              color="indigo"
              onChange={(value) => setFilterByStatus(value)}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="both">Both</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Show loader while fetching data */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <UserList
            allUsers={allUsers}
            userDeleting={userDeleting}
            userDeactivating={userDeactivating}
            serviceProvider={true}
          />
          <PaginationBtn totalPages={meta.totalPages} />
        </>
      )}
    </div>
  );
}
