import { useState } from "react";
import Barplot from "./Barplot";
import WorldMap from "./WorldMap";
import "./AppLayout.css";

const data = [
  { country: "United States", students: 68 },
  { country: "France", students: 21 },
  { country: "United Kingdom", students: 21 },
  { country: "Germany", students: 20 },
  { country: "Switzerland", students: 13 },
  { country: "Spain", students: 10 },
  { country: "Netherlands", students: 9 },
  { country: "India", students: 9 },
  { country: "Singapore", students: 8 },
  { country: "Ireland", students: 8 },
  { country: "Sweden", students: 7 },
  { country: "Australia", students: 7 },
  { country: "Canada", students: 6 },
  { country: "Finland", students: 5 },
  { country: "Mexico", students: 4 },
  { country: "Brazil", students: 4 },
  { country: "Saudi Arabia", students: 3 },
  { country: "Romania", students: 3 },
  { country: "Philippines", students: 3 },
  { country: "New Zealand", students: 3 },
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelectCountry = (country) => {
    setSelectedCountry((current) => (current === country ? null : country));
  };

  return (
    <main className="dashboard">
      <div className="visualization-layout">
        <Barplot
          data={data}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
        />

        <WorldMap selectedCountry={selectedCountry} />
      </div>
    </main>
  );
}
