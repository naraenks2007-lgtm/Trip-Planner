import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

function MapView({ selectedOption, lat, lng, name }) {

  // Custom icon for generic markers (if you want to use Lucide icons as markers)
  const createCustomIcon = () => {
    const iconMarkup = renderToStaticMarkup(<MapPin color="#ef4444" size={32} fill="white" />);
    return divIcon({
      html: iconMarkup,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const famousPlaces = [
    [13.0827, 80.2707],
    [13.0500, 80.2121],
    [13.0674, 80.2376]
  ];

  const busStops = [
    [13.0900, 80.2800],
    [13.0700, 80.2600]
  ];

  const restaurants = [
    [13.0850, 80.2750],
    [13.0520, 80.2150],
    [13.0690, 80.2400]
  ];

  const hotels = [
    [13.0800, 80.2650],
    [13.0550, 80.2200],
    [13.0720, 80.2450]
  ];

  const carRentals = [
    [13.0870, 80.2720],
    [13.0480, 80.2180]
  ];

  const touristAttractions = [
    [13.0810, 80.2690],
    [13.0530, 80.2130],
    [13.0700, 80.2420]
  ];

  const center = (lat && lng) ? [lat, lng] : [13.0827, 80.2707];
  const zoom = (lat && lng) ? 15 : 13;

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", minHeight: "300px", width: "100%" }}>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {lat && lng && (
        <Marker position={[lat, lng]}>
          <Popup>{name || "Location"}</Popup>
        </Marker>
      )}

      {!lat && selectedOption === "famous" &&
        famousPlaces.map((place, index) => (
          <Marker key={index} position={place}>
            <Popup>Famous Place</Popup>
          </Marker>
        ))
      }

      {!lat && selectedOption === "bus" &&
        busStops.map((stop, index) => (
          <Marker key={index} position={stop}>
            <Popup>Bus Stop</Popup>
          </Marker>
        ))
      }

      {!lat && selectedOption === "restaurants" &&
        restaurants.map((restaurant, index) => (
          <Marker key={index} position={restaurant}>
            <Popup>Restaurant</Popup>
          </Marker>
        ))
      }

      {!lat && selectedOption === "hotels" &&
        hotels.map((hotel, index) => (
          <Marker key={index} position={hotel}>
            <Popup>Hotel</Popup>
          </Marker>
        ))
      }

      {!lat && selectedOption === "car-rentals" &&
        carRentals.map((rental, index) => (
          <Marker key={index} position={rental}>
            <Popup>Car Rental</Popup>
          </Marker>
        ))
      }

      {!lat && selectedOption === "tourist-attractions" &&
        touristAttractions.map((attraction, index) => (
          <Marker key={index} position={attraction}>
            <Popup>Tourist Attraction</Popup>
          </Marker>
        ))
      }

    </MapContainer>
  );
}

export default MapView;
