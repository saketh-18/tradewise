import React from "react";
import Navbar from "../Components/Navbar";
import { useEffect , useState } from "react";
import axios from "axios";

export default function Account() {
  const [userInfo , setUserInfo] = useState({});
  useEffect(() => {
    axios.get("http://localhost:3000/profile")
     .then((response) => {
        setUserInfo(response.data);
      })
     .catch((error) => {
        console.error("Error fetching user data: ", error);
      });
  });
  return (
    <div className="h-screen bg-black">
      <Navbar />
      <div className="w-full grid grid-cols-3 gap-4 h-44 top-24 relative px-4 ">
        <div className="widget-container flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <div className="flex flex-col justify-center ml-4">
            <p className="text-white text-2xl font-medium">{userInfo.nickname}</p>
            <p className="text-white text-xl font-light">{userInfo.name}</p>
          </div>
          
        </div>
        <div className="col-span-2  widget-container flex items-center justify-evenly">
          <div className="flex flex-col text-center">
            <p className="text-neutral text-2xl font-medium">Invested Margin</p>
            <p className="text-white text-2xl font-semibold">₹1,00,000</p>
          </div>
          <div className="flex flex-col text-center">
            <p className="text-neutral text-2xl font-medium">
              Available Margin
            </p>
            <p className="text-white text-2xl font-semibold">₹25,000</p>
          </div>
          <div className="flex flex-col text-center">
            <p className="text-neutral text-2xl font-medium">Unrealised P&L</p>
            <p className="text-success text-2xl font-semibold">₹1,00,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
