import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    ["fetchHotelById", hotelId], // Unique query key for caching
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      {/* Hotel Name & Rating */}
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar key={index} className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image, index) => (
          <div key={index} className="h-48">
            <img
              src={image}
              alt={hotel.name}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Facilities Section */}
      <div className="flex flex-wrap gap-2">
        {hotel.facilities.map((facility, index) => (
          <div key={index} className="border border-gray-300 rounded-md p-2 text-sm">
            {facility}
          </div>
        ))}
      </div>

      {/* Description & Booking Form */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <p className="whitespace-pre-line">{hotel.description}</p>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
