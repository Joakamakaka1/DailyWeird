import { useState, useEffect } from "react";
import api from "../../api/api";
import type { DailyWeird } from "../model/DailyWeird";

const useDailyWeirdData = () => {
  const [data, setData] = useState<DailyWeird | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/n8n?path=dailyweird-json");
      const result = response.data.data?.[0];
      setData(result);
    } catch (error) {
      console.error("ERROR FETCH:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

export default useDailyWeirdData;
