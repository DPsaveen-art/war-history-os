"use client";

import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { CountryIntel } from "@/types/war";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type TacticalMapProps = {
  involvedCountries?: string[];
  invadedCountries?: string[];
  geographicalData?: CountryIntel[];
};

const TacticalMap = ({ involvedCountries = [], invadedCountries = [], geographicalData = [] }: TacticalMapProps) => {
  // Normalize arrays for case-insensitive matching
  const involved = involvedCountries.map((c) => c.toLowerCase().trim());
  const invaded = invadedCountries.map((c) => c.toLowerCase().trim());

  return (
    <div className="w-full h-[400px] bg-military-950 border border-military-700 rounded-2xl overflow-hidden shadow-inner relative">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(30, 40, 30, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 40, 30, 0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-military-900/90 border border-military-700 p-3 rounded-xl backdrop-blur-sm shadow-lg">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 border-b border-military-700 pb-1">Map Legend</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-orange-600 border border-orange-400"></span>
            <span className="text-[10px] font-mono font-bold text-slate-400">Involved/Aggressor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red-600 border border-red-400"></span>
            <span className="text-[10px] font-mono font-bold text-slate-400">Invaded/Occupied</span>
          </div>
        </div>
      </div>

      <ComposableMap
        projectionConfig={{
          scale: 140,
        }}
        width={800}
        height={400}
      >
        <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const countryName = geo.properties.name.toLowerCase();
                
                let fillColor = "#1c241d"; // default --color-military-800
                let borderColor = "#38463a"; // default --color-military-600
                
                // Structured match
                const intel = geographicalData.find(g => g.name.toLowerCase() === countryName);
                
                if (intel) {
                  if (intel.role === 'invader' || intel.role === 'aggressor') {
                    fillColor = "#ea580c"; // orange-600
                    borderColor = "#fb923c"; // orange-400
                  } else if (intel.role === 'occupied') {
                    fillColor = "#dc2626"; // red-600
                    borderColor = "#f87171"; // red-400
                  } else if (intel.role === 'ally') {
                    fillColor = "#2563eb"; // blue-600
                    borderColor = "#60a5fa"; // blue-400
                  } else {
                    fillColor = "#4b5563"; // gray-600
                    borderColor = "#9ca3af"; // gray-400
                  }
                } else if (invaded.includes(countryName)) {
                  // Legacy fallback
                  fillColor = "#dc2626"; // red-600
                  borderColor = "#f87171"; // red-400
                } else if (involved.includes(countryName)) {
                  fillColor = "#ea580c"; // orange-600
                  borderColor = "#fb923c"; // orange-400
                }

                // Compile intelligence tooltip
                const tooltipHtml = intel ? 
                  `<div class="flex flex-col gap-1 p-1 min-w-[140px]">
                    <span class="text-xs font-black uppercase text-white border-b border-gray-600 pb-1">${intel.name}</span>
                    ${intel.role ? `<span class="text-[10px] uppercase font-bold text-gray-300">ROLE: <span class="text-orange-400">${intel.role}</span></span>` : ''}
                    ${intel.side ? `<span class="text-[10px] uppercase font-bold text-gray-300">FACTION: ${intel.side}</span>` : ''}
                    ${intel.leader ? `<span class="text-[10px] uppercase font-bold text-gray-300">LEAD: ${intel.leader}</span>` : ''}
                  </div>` 
                  : `<div><span class="text-xs font-black uppercase">${geo.properties.name}</span></div>`;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={borderColor}
                    strokeWidth={0.5}
                    data-tooltip-id="tactical-tooltip"
                    data-tooltip-html={(intel || invaded.includes(countryName) || involved.includes(countryName)) ? tooltipHtml : undefined}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#495a4b", outline: "none", cursor: "crosshair" }, // hover --color-military-500
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip 
        id="tactical-tooltip" 
        className="z-50 bg-military-900 border border-military-600 font-mono shadow-xl rounded-sm"
        classNameArrow="hidden"
      />
    </div>
  );
};

export default memo(TacticalMap);
