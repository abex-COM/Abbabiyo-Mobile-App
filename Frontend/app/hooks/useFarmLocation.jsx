// hooks/useFarmLocations.js
import { useEffect, useState } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserContext";
import baseUrl from "@/baseUrl/baseUrl";

const useFarmLocations = () => {
  const { user, token } = useUser();
  const [farmLocations, setFarmLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchFarmLocations = async () => {
    if (!user?._id || !token) {
      setFarmLocations([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/farm-locations/all/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
        }
      );
      setFarmLocations(res.data?.farmLocations || []);
    } catch (err) {
      console.log(
        "Failed to fetch farm locations:",
        JSON.stringify(err, null, 2)
      );

      const message =
        typeof err?.response?.data?.error === "string"
          ? err.response.data.error
          : err?.response?.data?.error?.message ||
            err.message ||
            "Could not load farm locations";

      if (err.response?.status !== 401) {
        Toast.show({
          type: "error",
          text1: message,
        });
      }
      setFarmLocations([]); // fallback to empty
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token && user?._id) {
      fetchFarmLocations();
    }
  }, [user, token]);

  return {
    farmLocations,
    loading,
    refetch: fetchFarmLocations,
    setFarmLocations,
  };
};

export default useFarmLocations;
