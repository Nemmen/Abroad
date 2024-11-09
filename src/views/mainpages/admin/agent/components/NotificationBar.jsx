import React, { useState } from "react";
import { IoRemoveCircle, IoSettings, IoAlert } from "react-icons/io5";

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "John Doe",
      position: "Software Engineer",
      description: "John Doe applied for the Software Engineer position.",
      date: "Nov 5, 2024",
      time: "10:30 AM",
      viewed: false,
    },
    {
      id: 2,
      name: "Jane Doe",
      position: "Data Analyst",
      description: "Jane Doe applied for the Data Analyst position.",
      date: "Nov 5, 2024",
      time: "11:00 AM",
      viewed: false,
    },
    {
      id: 3,
      name: "John Smith",
      position: "Project Manager",
      description: "John Smith applied for the Project Manager position.",
      date: "Nov 5, 2024",
      time: "12:15 PM",
      viewed: false,
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleView = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleMarkAsViewed = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, viewed: true } : notif
      )
    );
    setSelectedNotification(null);
  };

  return (
    <div className="rounded-md shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Notifications ({notifications.length})
        </h1>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full hover:bg-slate-300 duration-200 flex items-center justify-center">
            <IoSettings className="text-gray-600" />
          </div>
          <div className="w-6 h-6 rounded-full hover:bg-slate-300 duration-200 flex items-center justify-center">
            <IoRemoveCircle className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="my-4"></div>

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center justify-between bg-gray-100 p-3 rounded-md mb-2 ${
            notif.viewed ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center">
            <IoAlert className="text-red-500" size={30} />
            <div className="ml-3">
              <h1 className="text-sm font-semibold">{notif.name}</h1>
              <p className="text-xs text-gray-500">
                Applied for the position of {notif.position}
              </p>
            </div>
          </div>
          <button
            className="text-xs text-blue-500"
            onClick={() => handleView(notif)}
          >
            View
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-2">
              {selectedNotification.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedNotification.description}
            </p>
            <p className="text-xs text-gray-500">
              Date: {selectedNotification.date}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Time: {selectedNotification.time}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-3 py-1 bg-black text-white rounded text-sm"
                onClick={() => handleMarkAsViewed(selectedNotification.id)}
              >
                Mark as Viewed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
