import './App.css'

import React from "react";
import { useStops } from "./useStops";
import { Trip, useRoutes } from "./useRoutes";

const App: React.FC = () => {
  const { data: routes, loading: routesLoading, error: routesError } = useRoutes('A48', 5);
  const { data: stops, loading: stopsLoading, error: stopsError } = useStops();

  if (routesLoading || stopsLoading) return <p>Loading...</p>;
  if (routesError || stopsError) return <p>Error</p>;

  return (
    <div>
      <h1>{routes?.name}</h1>
      {Object.entries(routes?.upcoming_trips || {}).map(([direction, trips]) =>
        <><h2>{direction}</h2>
          <table cellPadding={5} border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Route</th>
                <th>Arrival Time</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              {trips.slice(0, 5).map((trip: Trip) => (
                <tr key={trip.id}>
                  <td>{trip.route_id}</td>
                  <td>{new Date(trip.estimated_current_stop_arrival_time * 1000).toLocaleTimeString()}</td>
                  <td>{stops[trip.destination_stop]?.name || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table></>
      )}
    </div>
  );
};

export default App;
