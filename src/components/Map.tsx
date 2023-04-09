import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvents,
  Tooltip,
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

const SelectPopout = ({
  id,
  text,
  onSelect,
}: {
  id: number;
  text: string;
  onSelect?: (id: number) => void;
}) => {
  return (
    <Popup>
      <Stack direction="column">
        <Typography variant="subtitle2"> {text} </Typography>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => onSelect && onSelect(id)}
        >
          Wybierz
        </Button>
      </Stack>
    </Popup>
  );
};

const MapControl = ({ onClick }: { onClick: (gps: LatLng) => void }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });

  return null;
};

export interface MapProps {
  center?: [number, number];
  zoom?: number;
  doubleClick?: boolean;
  scrollWhell?: boolean;
  routes?: {
    label?: string;
    color?: string;
    stops: BusStop[];
  }[];
  selectedPos?: [number, number];
  markers?: {
    id: number;
    text: string;
    pos: [number, number];
    selected?: boolean;
  }[];
  onClick?: (gps: [number, number]) => void;
  onMarkerSelect?: (id: number) => void;
}

const Map = ({
  center,
  zoom,
  scrollWhell,
  doubleClick,
  routes,
  selectedPos,
  markers,
  onClick,
  onMarkerSelect,
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
      {markers?.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.pos}
          icon={marker.selected ? SelectedMarkerIcon : MarkerIcon}
        >
          <SelectPopout
            id={marker.id}
            text={marker.text}
            onSelect={onMarkerSelect}
          />
        </Marker>
      ))}

      {selectedPos && (
        <Marker position={selectedPos} icon={SelectedMarkerIcon}>
          <Popup>
            <Typography>Wybrana pozycja</Typography>
          </Popup>
        </Marker>
      )}

      {polyLines?.map((polyLine, key) => (
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
      ))}

      <MapControl onClick={handleOnClick} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
export default Map;
