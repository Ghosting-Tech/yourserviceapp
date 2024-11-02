import { useState, useEffect } from "react";
import { Card, CardHeader, Button } from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import TopServices from "./TopServices";
import locationData from "@/assets/location.json";
import { useSelector } from "react-redux";
import Services from "@/components/Services";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function ShowServices({
  topServices,
  selectedState,
  selectedCity,
  setSelectedState,
  setSelectedCity,
  handleLocationChange,
  forAllService = false,
}) {
  const [cities, setCities] = useState([]);

  const geolocationDenied = useSelector(
    (state) => state.location.geolocationDenied
  );

  useEffect(() => {
    if (selectedState) {
      setCities(locationData[selectedState] || []);
      setSelectedCity(locationData[selectedState]?.[0] || "");
    } else {
      setCities([]);
    }
  }, [selectedState]);

  return (
    <div>
      {!geolocationDenied && topServices?.length !== 0 ? (
        forAllService ? (
          <div className="container mx-auto lg:p-6 p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {topServices.map((service, index) => (
              <Services
                key={index}
                iconSrc={service.icon?.url}
                title={service.name}
                services={service.subServices}
                link={service._id}
                reviews={service.reviews}
              />
            ))}
          </div>
        ) : (
          <TopServices topServices={topServices} />
        )
      ) : (
        <Card className="w-11/12 md:w-3/5 shadow-lg mt-8 p-6 pt-0 mx-auto">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <div className="text-7xl font-cookie">Select City</div>
          </CardHeader>
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 w-full sm:w-4/6">
              <div className="relative w-full">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full md:w-64"
                  name="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  {Object.keys(locationData).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>

              <div className="relative w-full">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full md:w-64"
                  name="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Button
              variant="gradient"
              fullWidth
              size="md"
              onClick={handleLocationChange}
              disabled={!selectedState || !selectedCity}
              className="flex items-center justify-center gap-2"
            >
              <MapPinIcon className="h-5 w-5" />
              Confirm Location
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
