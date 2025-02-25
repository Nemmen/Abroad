import React, { useEffect, useState } from 'react';
import { IoRemoveCircle, IoSettings, IoAlert } from 'react-icons/io5';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {

        const usersResponse = await axios.get(
          'https://abroad-backend-gray.vercel.app/admin/getuser',
          { withCredentials: true },
        );
        const filteredNotifications = usersResponse.data.users
          .filter((user) => user.userStatus === 'pending')
          .sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt), // Sort descending
          );
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    // console.log(notifications);
    fetchNotifications();
  }, []);

  const handleView = (notification) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
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

      <div
        className="mt-4 overflow-y-auto max-h-48 pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#6b7280 #f3f4f6', // Thumb and track colors
        }}
      >
        {notifications.map((notif) => (
          <Link to={`/admin/agent/userdetail/${notif._id}`}>
            <div
              key={notif._id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-md mb-2"
            >
              <div className="flex items-center">
                <IoAlert className="text-red-500" size={30} />
                <div className="ml-3">
                  <h1 className="text-sm font-semibold">{notif.name}</h1>
                  <p className="text-xs text-gray-500">Email: {notif.email}</p>
                  <p className="text-xs text-gray-500">
                    Organization: {notif.organization}
                  </p>
                  <p className="text-xs text-gray-500">Role: {notif.role}</p>
                </div>
              </div>
              <button
                className="text-xs text-blue-500"
                onClick={() => handleView(notif)}
              >
                View
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-2">
              {selectedNotification.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Email: {selectedNotification.email}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Organization: {selectedNotification.organization}
            </p>
            <p className="text-xs text-gray-500">
              Role: {selectedNotification.role}
            </p>
            <p className="text-xs text-gray-500">
              Status: {selectedNotification.userStatus}
            </p>
            <p className="text-xs text-gray-500">
              Created At:{' '}
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-1 bg-gray-300 rounded text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
