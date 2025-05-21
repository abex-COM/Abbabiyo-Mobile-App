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

  const fetchFarmLocations = async (controller) => {
    if (!user?._id || !token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/farm-locations/all/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,
          signal: controller?.signal,
        }
      );
      setFarmLocations(res.data?.farmLocations || []);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return;
      }

      if (__DEV__) {
        console.log("Failed to fetch farm locations:", err);
      }

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
    const controller = new AbortController();

    if (token && user?._id) {
      fetchFarmLocations(controller);
    }

    return () => controller.abort();
  }, [token, user]);

  return {
    farmLocations,
    loading,
    refetch: () => fetchFarmLocations(),
    setFarmLocations,
  };
};

export default useFarmLocations;
