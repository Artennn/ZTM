import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L, { type LatLng } from "leaflet";

const MarkerIcon = L.icon({
  iconUrl: "/busStop.png",
  iconAnchor: [8, 8],
});
const SelectedMarkerIcon = L.icon({
  iconUrl: "/busStop2.png",
  iconAnchor: [8, 8],
});

L.Marker.prototype.options.icon = MarkerIcon;

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import type { BusStop } from "@prisma/client";

const MapControl = ({ onClick }: { onClick: (gps: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });

  return null;
};

import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useEffect } from "react";

const RouteControl = ({
  waypoints,
  color,
}: {
  waypoints: [number, number][];
  color: string;
}) => {
  const map = useMap();

  useEffect(() => {
    const route = L.Routing.control({
      show: false,
      addWaypoints: false,
      waypointMode: "connect",
      draggableWaypoints: false,
      //fitSelectedRoutes: true,
      /* createMarker: () => null, */

      lineOptions: {
        extendToWaypoints: true,
        missingRouteTolerance: 1.0,
        styles: [
          {
            color,
          },
        ],
      },
      waypoints: waypoints.map((waypoint) =>
        L.latLng(waypoint[0], waypoint[1])
      ),
    }).addTo(map);

    /* const route2 = L.Routing.line({
      waypoints: waypoints.map((waypoint) =>
        L.latLng(waypoint[0], waypoint[1])
      ),
    }); //.addTo(map); */

    return () => {
      console.log("remove");
      if (!map?.removeLayer) return;
      map.removeControl && map.removeControl(route);
      //map.removeLayer(route2);
    };
  }, [map, waypoints]);

  return null;
};

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  doubleClick?: boolean;
  scrollWhell?: boolean;
  busStops?: BusStop[];
  routes?: {
    label?: string;
    color?: string;
    stops: BusStop[];
  }[];
  selectedBusStop?: BusStop;
  selectedPos?: [number, number];
  onClick?: (gps: [number, number]) => void;
  onBusStopSelect?: (id: number) => void;
}

const Map = ({
  center,
  zoom,
  scrollWhell,
  doubleClick,
  busStops,
  routes,
  selectedBusStop,
  selectedPos,
  onClick,
  onBusStopSelect,
}: MapProps) => {
  const polyLines = routes?.map((route) => ({
    ...route,
    stops: route.stops.map(
      (busStop) => [busStop.gpsX, busStop.gpsY] as [number, number]
    ),
  }));

  const handleOnClick = (gps: LatLng) => {
    onClick && onClick([gps.lat, gps.lng]);
  };

  return (
    <MapContainer
      center={center || [51.25, 22.56]}
      zoom={zoom || 13}
      doubleClickZoom={doubleClick || false}
      scrollWheelZoom={scrollWhell || false}
      style={{
        height: "100%",
        width: "100%",
        cursor: onClick ? "crosshair" : "grab",
      }}
    >
      {busStops?.map((busStop, key) => (
        <Marker
          position={[busStop.gpsX, busStop.gpsY]}
          icon={
            selectedBusStop?.id === busStop.id ? SelectedMarkerIcon : MarkerIcon
          }
          key={key}
        >
          <Popup>
            <Stack direction="column">
              <Typography variant="subtitle2"> {busStop.name} </Typography>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => onBusStopSelect && onBusStopSelect(busStop.id)}
              >
                Wybierz
              </Button>
            </Stack>
          </Popup>
        </Marker>
      ))}

      {selectedPos && (
        <Marker position={selectedPos} icon={SelectedMarkerIcon}>
          <Popup>
            <Typography>Wybrana pozycja</Typography>
          </Popup>
        </Marker>
      )}

      {/* {polyLines?.map((polyLine, key) => (
        <Polyline
          key={key}
          positions={polyLine.stops}
          pathOptions={{ color: polyLine.color || "red" }}
        >
          {polyLine.label && (
            <Tooltip sticky direction="top">
              {polyLine.label}
            </Tooltip>
          )}
        </Polyline>
      ))} */}

      <MapControl onClick={handleOnClick} />

      {polyLines?.map((polyLine, key) => (
        <RouteControl
          key={key}
          waypoints={polyLine.stops}
          color={polyLine.color || "pink"}
        />
      ))}

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
export default Map;
