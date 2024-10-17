import React from 'react';

const ProfileInfo = ({ user }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex flex-col shadow-lg gap-6 w-full h-full bg-white rounded-md px-6 py-4">
      <div className="flex justify-between w-full">
        <div>Phone Number</div>
        <div>{user?.phoneNumber}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Email</div>
        <div>{user?.email}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Gender</div>
        <div>{user?.gender}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>City</div>
        <div>{user?.city}</div>
      </div>
      <div className="bg-gray-300 h-px w-full"></div>
      <div className="flex justify-between w-full">
        <div>Account Created on</div>
        <div>{formatDate(user?.createdAt)}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;