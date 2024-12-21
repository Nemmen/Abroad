import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    organization: "",
    phoneNumber: "",
    state: "",
    city: "",
    joinedAt: "",
    businessDivision: "",
  });

  const [originalUser, setOriginalUser] = useState({}); // To track original data

  useEffect(() => {
    // Load user data from local storage
    const rootData = JSON.parse(localStorage.getItem("persist:root"));
    if (rootData && rootData.user) {
      const parsedUser = JSON.parse(rootData.user);
      const userData = {
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        organization: parsedUser.organization || "",
        phoneNumber: parsedUser.phoneNumber || "",
        state: parsedUser.state || "",
        city: parsedUser.city || "",
        joinedAt: parsedUser.createdAt || "",
        businessDivision: parsedUser.businessDivision || "",
      };
      setUser(userData);
      setOriginalUser(userData); // Save original data
    }
  }, []);

  const handleInputChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Check if data has changed
      if (JSON.stringify(user) === JSON.stringify(originalUser)) {
        setIsEditing(false);
        return;
      }

      // Create a shallow copy of the user object excluding `joinedAt`
      const { joinedAt, ...updatedUser } = user;

      // Send updated data to server
      const response = await axios.put("http://127.0.0.1:4000/auth/updateProfile", updatedUser);
      if (response.status === 200) {
        alert("Profile updated successfully!");
        setOriginalUser(user); // Update original data
        setIsEditing(false); // Exit editing mode
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="flex justify-end items-center w-11/12 mx-auto mt-5">
        <button
          className="hover:scale-95 transition-all duration-200 rounded-lg bg-[#f68c00] h-fit py-3 px-6 flex gap-x-2 align-middle text-white"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <FaEdit fontSize={20} />
          <div className="">{isEditing ? "Save" : "Edit"}</div>
        </button>
      </div>

      {/* User Info Section */}
      <div className="mt-7 rounded-lg border bg-white p-8 mx-auto w-11/12 min-h-max">
        <div className="flex gap-4 items-center">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-200 border rounded p-2 mb-2 w-full"
              />
            ) : (
              <p className="text-lg font-[500]">{user.name}</p>
            )}
            {isEditing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-200 border rounded p-2 mt-2 w-full"
              />
            ) : (
              <p className="font-[400] text-[#838894]">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="mt-10 rounded-lg border border-slate-200 bg-white p-8 mx-auto w-11/12">
        <p className="font-bold text-xl">Personal Details</p>
        <div className="mt-5 grid h-max lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
          {Object.entries({
            Organization: user.organization,
            PhoneNumber: user.phoneNumber,
            State: user.state,
            City: user.city,
            BusinessDivision: user.businessDivision,
          }).map(([key, value], index) => (
            <div key={index}>
              <p className="font-[400] text-[#838894]">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              {isEditing ? (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(key.toLowerCase(), e.target.value)}
                  className="bg-slate-200 border rounded p-2 w-full"
                />
              ) : (
                <p className="font-[500]">{value || `Add ${key}`}</p>
              )}
            </div>
          ))}

          {/* Non-editable Joined At Field */}
          <div>
            <p className="font-[400] text-[#838894]">Joined At</p>
            <p className="font-[500]">{user.joinedAt.slice(0, 9) || "Not Available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
