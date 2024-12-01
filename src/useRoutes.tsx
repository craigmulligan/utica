import { useEffect, useState } from "react";

export interface Trip {
  id: string;
  route_id: string;
  direction: string;
  estimated_current_stop_arrival_time: number;
  destination_stop: string;
}

interface UpcomingTrips {
  north: Trip[];
  south: Trip[];
}

interface Route {
  id: string;
  name: string;
  secondary_name: string | null;
  upcoming_trips: UpcomingTrips;
}

export function useRoutes(stationId: string, refreshInterval: number) {
  const [data, setData] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStopData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://www.goodservice.io/api/stops/${stationId}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data: Route = await response.json();
        setData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStopData(); // Fetch immediately on mount

    if (refreshInterval > 0) {
      intervalId = setInterval(fetchStopData, refreshInterval * 1000); // Set interval
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [stationId, refreshInterval]);

  return { data, loading, error };
}
