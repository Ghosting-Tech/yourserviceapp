import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton, Input, Option, Select } from "@material-tailwind/react";
import React from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { toast } from "sonner";

const TableHeading = ({ setSearchQuery, setStatus, fetchBookings }) => {
  return (
    <div className="bg-white p-4 rounded-lg border flex gap-2 justify-between flex-col md:flex-row">
      <h1 className="text-2xl font-bold text-blue-gray-500 text-center md:text-left">All Bookings</h1>
      <div className="w-full md:w-2/3 lg:w-1/2 flex gap-4 flex-col lg:flex-row">
        <Input
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          label="Search By ID, Name, Phone number"
          icon={<MagnifyingGlassIcon className="w-4 h-4" />}
        />
        <div className="w-full md:w-1/2 flex items-center gap-4">
          <Select
            color="teal"
            label="Status"
            onChange={(val) => setStatus(val)}
          >
            <Option value="all">All</Option>
            <Option value="completed">Completed</Option>
            <Option value="notCompleted">Not completed</Option>
          </Select>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => {
              fetchBookings();
              toast.success("Bookings Updated!");
            }}
            fullWidth
          >
            <MdOutlineRefresh size={25} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TableHeading;
