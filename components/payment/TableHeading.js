import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IconButton, Input, Option, Select } from "@material-tailwind/react";
import React from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { toast } from "sonner";

const TableHeading = ({
  serviceProvider = false,
  setSearchQuery,
  setStatus,
  fetchingData,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border flex gap-2 justify-between flex-col md:flex-row">
      <h1 className="text-2xl font-bold text-blue-gray-500 text-center md:text-left">
        All Bookings
      </h1>
      {serviceProvider ? (
        <div className="w-full md:w-2/3 lg:w-1/5 flex gap-4 flex-row">
          <Select
            color="teal"
            label="Status"
            onChange={(val) => setStatus(val)}
          >
            <Option value="both">Both</Option>
            <Option value={true}>Paid</Option>
            <Option value={false}>Not Paid</Option>
          </Select>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => {
              fetchingData();
              toast.success("Payments Updated!");
            }}
            fullWidth
          >
            <MdOutlineRefresh size={25} />
          </IconButton>
        </div>
      ) : (
        <div className="w-full md:w-2/3 lg:w-1/2 flex gap-4 flex-col lg:flex-row">
          <Input
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            label="Search By Service Provider, Phone number"
            icon={<MagnifyingGlassIcon className="w-4 h-4" />}
          />
          <div className="w-full md:w-1/2 flex items-center gap-4">
            <Select
              color="teal"
              label="Status"
              onChange={(val) => setStatus(val)}
            >
              <Option value="both">Both</Option>
              <Option value={true}>Paid</Option>
              <Option value={false}>Not Paid</Option>
            </Select>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => {
                fetchingData();
                toast.success("Payments Updated!");
              }}
              fullWidth
            >
              <MdOutlineRefresh size={25} />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableHeading;
