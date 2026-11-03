import { useEffect, useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3";
import "./WorldMap.css";

const width = 640;
const height = 360;

const countryCodes = {
  "United States": "USA",
  France: "FRA",
  "United Kingdom": "GBR",
  Germany: "DEU",
  Switzerland: "CHE",
  Spain: "ESP",
  Netherlands: "NLD",
  India: "IND",
  Singapore: "SGP",
  Ireland: "IRL",
  Sweden: "SWE",
  Australia: "AUS",
  Canada: "CAN",
  Finland: "FIN",
  Mexico: "MEX",
  Brazil: "BRA",
  "Saudi Arabia": "SAU",
  Romania: "ROU",
  Philippines: "PHL",
  "New Zealand": "NZL",
};

export default function WorldMap({ selectedCountry }) {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  // Load geographical data
  useEffect(() => {
    const controller = new AbortController();

    fetch(`${import.meta.env.BASE_URL}countries.geojson`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load map data: HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(setGeoData)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, []);

  // Remove Antarctica
  const filteredGeoData = useMemo(() => {
    if (!geoData) return null;

    return {
      ...geoData,
      features: geoData.features.filter(
        (feature) => feature.properties["ISO3166-1-Alpha-3"] !== "ATA",
      ),
    };
  }, [geoData]);

  // Create a projection fitted to the world
  const projection = useMemo(() => {
    const proj = geoNaturalEarth1();

    if (filteredGeoData) {
      proj.fitSize([width, height], filteredGeoData);
    }

    return proj;
  }, [filteredGeoData]);

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  const mapPaths = useMemo(() => {
    if (!filteredGeoData) return [];

    return filteredGeoData.features.map((feature, index) => ({
      id: index,
      code: feature.properties["ISO3166-1-Alpha-3"],
      path: pathGenerator(feature) || "",
    }));
  }, [filteredGeoData, pathGenerator]);

  // Highlight the selected country without moving the map.
  const selectedCode = countryCodes[selectedCountry];

  return (
    <div className="map-container">
      <header className="map-header">
        <h2>Student locations</h2>
        <p>
          {selectedCountry
            ? `Selected: ${selectedCountry}`
            : "Select a country from the bar chart."}
        </p>
      </header>

      {error && <p role="alert">{error}</p>}

      {!geoData && !error && <p>Loading map...</p>}

      {filteredGeoData && (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={
            selectedCountry
              ? `World map highlighting ${selectedCountry}`
              : "World map"
          }
        >
          {mapPaths.map((country) => {
            const isSelected =
              selectedCode != null && country.code === selectedCode;

            return (
              <path
                key={country.id}
                d={country.path}
                className={isSelected ? "map-country selected" : "map-country"}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
