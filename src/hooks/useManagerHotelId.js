import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

export function useManagerHotelId() {
  const { user } = useAuth();
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    axiosClient
      .get(`/api/user/manager/${user.userId}/hotel`)
      .then((res) => setHotelId(res.data.data))
      .finally(() => setLoading(false));
  }, [user?.userId]);

  return { hotelId, loading };
}
