import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

function MapView({ selectedOption, lat, lng, name }) {

  // state to store places from Overpass API
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // center of map
  const center = (lat && lng) ? [lat, lng] : [13.0827, 80.2707];
  const zoom = (lat && lng) ? 15 : 13;

  // custom marker icon
  const createCustomIcon = () => {
    const iconMarkup = renderToStaticMarkup(
      <MapPin color="#ef4444" size={32} fill="white" />
    );

    return divIcon({
      html: iconMarkup,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // fetch places from backend (Overpass API)
  useEffect(() => {

    if (!selectedOption) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    let type = "attraction";

    // Map category slugs to Overpass API types
    if (selectedOption === "hotels")
      type = "hotel";

    else if (selectedOption === "restaurants")
      type = "restaurant";

    else if (selectedOption === "tourist-attractions" || selectedOption === "tourist-places" || selectedOption === "famous")
      type = "attraction";

    else if (selectedOption === "car-rentals" || selectedOption === "bus-timings") {
      // For car rentals and bus timings, we don't have specific Overpass tags
      // So we'll skip the API call and just show the selected location marker
      setPlaces([]);
      setLoading(false);
      return;
    }

    else {
      // Default to attraction for unknown types
      type = "attraction";
    }

    setLoading(true);

    fetch(`http://127.0.0.1:5000/api/places?lat=${center[0]}&lon=${center[1]}&type=${type}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {

        if (!data.elements || data.elements.length === 0) {
          console.log("No places found in this area");
          setPlaces([]);
          return;
        }

        const formattedPlaces = data.elements
          .filter(place => place.lat && place.lon)
          .map(place => ({
            lat: place.lat,
            lon: place.lon,
            name: place.tags?.name || type
          }));

        setPlaces(formattedPlaces);

      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setPlaces([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [selectedOption, lat, lng]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: "100%",
          minHeight: "300px",
          width: "100%"
        }}
      >

        {/* OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Selected location marker */}
        {lat && lng && (
          <Marker
            position={[lat, lng]}
            icon={createCustomIcon()}
          >
            <Popup>{name || "Selected Location"}</Popup>
          </Marker>
        )}

        {/* Dynamic places from Overpass API */}
        {places.map((place, index) => (

          <Marker
            key={index}
            position={[place.lat, place.lon]}
            icon={createCustomIcon()}
          >
            <Popup>{place.name}</Popup>
          </Marker>

        ))}

      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '16px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '1.5rem 2rem',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(99, 102, 241, 0.2)',
              borderTop: '4px solid rgb(99, 102, 241)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              color: 'rgb(99, 102, 241)',
              fontWeight: 600,
              margin: 0
            }}>Loading nearby places...</p>
          </div>
        </div>
      )}
    </div>

  );
}

export default MapView;
