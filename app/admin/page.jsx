"use client";
import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import HorizontalBarChart from "@/components/admin/dashboard/HorizontalBarChart";
import PieChart from "@/components/admin/dashboard/PieChart";

const Admin = () => {
  const [data, setData] = useState({
    totalServices: 0,
    inactiveServices: 0,
    activeServices: 0,
    totalSubServices: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalServiceProviders: 0,
    activeServiceproviders: 0,
  });
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const response = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setData(data);
    } catch {
      console.error("Failed to get dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      {loading ? (
        <div className="grid place-items-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="loaction-loader"></div>
            <div className="text-2xl font-julius">Loading</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex lg:flex-row flex-col h-full items-start gap-10 px-8 my-4">
            <div className="grid grid-cols-1 gap-6 self-start w-full">
              <DashboardCard data={data} />
            </div>
            <div className="w-full flex flex-col items-start gap-6">
              <div className="w-full h-full p-4 bg-white shadow-lg rounded-lg">
                <HorizontalBarChart data={data} />
              </div>
              <div className="w-full h-full p-4 bg-white shadow-lg rounded-lg">
                <PieChart data={data} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
