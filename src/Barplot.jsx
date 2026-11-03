import { useState } from "react";
import { scaleBand, scaleLinear } from "d3";
import "./Barplot.css";

export default function Barplot({ data, selectedCountry, onSelectCountry }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const width = 500;
  const height = 400;

  const margin = {
    top: 10,
    right: 35,
    bottom: 10,
    left: 100,
  };

  const sortedData = [...data].sort((a, b) => b.students - a.students);

  const yScale = scaleBand()
    .domain(sortedData.map((d) => d.country))
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  const xScale = scaleLinear()
    .domain([0, Math.max(0, ...data.map((d) => d.students))])
    .range([margin.left, width - margin.right]);

  return (
    <div className="chart-container">
      <header className="chart-header">
        <h1>D3 React Course: student numbers </h1>
        <p>Number of students in the first cohort, by country.</p>
      </header>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="Horizontal bar chart showing students by country"
      >
        {sortedData.map((d) => (
          <g
            key={d.country}
            onMouseEnter={() => setHoveredCountry(d.country)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <rect
              x={margin.left}
              y={yScale(d.country)}
              width={xScale(d.students) - xScale(0)}
              height={yScale.bandwidth()}
              rx={3}
              role="button"
              tabIndex={0}
              aria-label={`Select ${d.country}, ${d.students} students`}
              aria-pressed={selectedCountry === d.country}
              onClick={() => onSelectCountry(d.country)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectCountry(d.country);
                }
              }}
              className={
                selectedCountry === d.country
                  ? "bar bar-selected"
                  : hoveredCountry === d.country
                    ? "bar bar-hovered"
                    : "bar"
              }
            />

            <text
              x={margin.left - 10}
              y={yScale(d.country) + yScale.bandwidth() / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="country-label"
            >
              {d.country}
            </text>

            <text
              x={xScale(d.students) + 5}
              y={yScale(d.country) + yScale.bandwidth() / 2}
              dominantBaseline="middle"
              className="value-label"
            >
              {d.students}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
