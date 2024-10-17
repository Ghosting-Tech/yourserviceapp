import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "10px",
};

const LocationDetails = ({ booking }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Service Location</h3>
      <div className="flex items-center gap-2 mb-4">
        <FaMapMarkerAlt className="text-gray-600" />
        <span className="text-sm text-gray-600">{booking.address}</span>
      </div>
      <LoadScriptNext
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        loading="lazy"
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={booking?.location}
        >
          <Marker position={booking?.location} />
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default LocationDetails;
