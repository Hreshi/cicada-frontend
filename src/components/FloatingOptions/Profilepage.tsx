import React, { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";

const ProfilePage = ({ name, email, avatarImage }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Send Invite", read: false },
    { id: 2, text: "See All Invites", read: true },
  ]);

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true };
        } else {
          return { ...notification, read: false };
        }
      })
    );
  };

  return (
    <div className="relative flex flex-col mt-10 ">
      <div className="absolute right-0 z-10 w-56 bg-black rounded-md shadow-lg">
        <div className="py-1">
          <div className="flex items-center">
            <Avatar src={avatarImage} />
            <div className="ml-4 text-lg font-medium text-white">{name}</div>
          </div>
          <div className="flex items-center mt-2 text-sm font-medium text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M10 0a10 10 0 100 20 10 10 0 000-20zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"
                clipRule="evenodd"
              />
            </svg>
            {email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
