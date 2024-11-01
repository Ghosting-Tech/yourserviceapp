import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import TopServices from "./TopServices";
import locationData from "@/assets/location.json";
import { useSelector } from "react-redux";

export default function ShowServices({
  topServices,
  selectedState,
  setSelectedState,
  setSelectedCity,
  handleLocationChange,
  selectedCity,
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
      {!geolocationDenied ? (
        <TopServices topServices={topServices} />
      ) : (
        <Card className="w-3/5 shadow-lg mt-8 p-6 pt-0 mx-auto">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <div className="text-7xl font-cookie">Select City</div>
          </CardHeader>
          <div className="flex gap-4">
            <Select
              label="State"
              className="bg-white"
              name="state"
              color="indigo"
              value={selectedState}
              onChange={(e) => setSelectedState(e)}
              required
            >
              {Object.keys(locationData).map((state) => (
                <Option key={state} value={state}>
                  {state}
                </Option>
              ))}
            </Select>
            <Select
              className="bg-white"
              label="City"
              name="city"
              color="indigo"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e)}
              required
            >
              {cities?.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
            <Button
              variant="gradient"
              fullWidth
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
