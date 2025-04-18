import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useAppContext } from "../contexts/AppContext";  // Import the context to show toast

const MyHotels = () => {
  const { showToast } = useAppContext();  // Access showToast from the context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

  const { data: hotelData, refetch } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

  const deleteHotelMutation = useMutation(apiClient.deleteHotel, {
    onSuccess: () => {
      refetch(); // Refetch the data to update the list after deletion
      setIsModalOpen(false); // Close modal after successful deletion
      showToast({ message: "Hotel Deleted!", type: "SUCCESS" });  // Show success toast
    },
    onError: () => {
      showToast({ message: "Error Deleting Hotel", type: "ERROR" });  // Show error toast
    },
  });

  const handleDelete = (hotelId) => {
    setSelectedHotelId(hotelId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedHotelId) {
      deleteHotelMutation.mutate(selectedHotelId);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedHotelId(null);
  };

  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link to="/add-hotel" className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500">
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end gap-4">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
              <button
                onClick={() => handleDelete(hotel._id)}
                className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500"
              >
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>

      {/* Modal for deletion confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this hotel?</p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHotels;
