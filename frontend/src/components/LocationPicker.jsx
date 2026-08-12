import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// This helper lets us programmatically move the map when a search result comes in
function MapFlyTo({ position }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 14);
  }
  return null;
}

function LocationPicker({ latitude, longitude, onChange }) {
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const defaultPosition = [26.9124, 75.7873];
  const position =
    latitude && longitude ? [latitude, longitude] : defaultPosition;

  const handlePick = (lat, lng) => {
    onChange(lat, lng);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchText.trim()) return;

    setSearching(true);
    setSearchError("");

    try {
      // Photon (by Komoot) — free geocoder, often better for specific named places
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}&limit=1`,
      );
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        setSearchError(
          "Exact place not found. Try searching just the area or city name, then click the map to pinpoint the precise spot.",
        );
        return;
      }

      // Photon returns coordinates as [longitude, latitude] inside GeoJSON geometry
      const [lon, lat] = data.features[0].geometry.coordinates;
      onChange(lat, lon);
    } catch (error) {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200">
      <div className="flex gap-2 p-2 bg-slate-50 border-b border-slate-200">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // stops Enter from bubbling up to the outer form
              handleSearch(e);
            }
          }}
          placeholder="Search for an address or city..."
          className="flex-1 text-sm px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="text-sm px-3 py-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {searching ? "..." : "Search"}
        </button>
      </div>
      {searchError && (
        <p className="text-xs text-red-600 px-2 pt-2 bg-slate-50">
          {searchError}
        </p>
      )}

      <MapContainer
        center={position}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {latitude && longitude && <Marker position={[latitude, longitude]} />}
        <ClickHandler onPick={handlePick} />
        {latitude && longitude && <MapFlyTo position={[latitude, longitude]} />}
      </MapContainer>

      <p className="text-xs text-slate-400 p-2 bg-slate-50">
        Search an address above, or click anywhere on the map to set your
        location precisely
      </p>
    </div>
  );
}

export default LocationPicker;
