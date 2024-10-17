import React from "react";
import UserDetail from "./UserDetail";

const AvailableServiceProviders = ({availableServiceProviders}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Available Service providers
      </h3>
      <span className="text-sm text-gray-600">
        {availableServiceProviders.length === 0 ? (
          "No service provider available"
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {availableServiceProviders.map((sp, index) => {
              return (
                <div key={index}>
                  <UserDetail
                    name={sp.name}
                    profileImage={sp.image}
                    email={sp.email}
                    phoneNumber={sp.phoneNumber}
                  />
                </div>
              );
            })}
          </div>
        )}
      </span>
    </div>
  );
};

export default AvailableServiceProviders;
