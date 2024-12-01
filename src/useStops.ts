import { useState, useEffect } from "react";

interface StopsResponse {
  stops: Stop[];
}

interface Stop {
  id: string;
  name: string;
  secondary_name: string | null;
  latitude: number;
  longitude: number;
}

export const useStops = () => {
  const [data, setData] = useState<Record<string, Stop>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch("https://www.goodservice.io/api/stops");
        if (!response.ok) {
          throw new Error(`Error fetching stops: ${response.statusText}`);
        }
        const data: StopsResponse = await response.json();
        const stopsMap = data.stops.reduce<Record<string, Stop>>(
          (acc, stop) => {
            acc[stop.id] = stop;
            return acc;
          },
          {},
        );
        setData(stopsMap);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  return { data, loading, error };
};
