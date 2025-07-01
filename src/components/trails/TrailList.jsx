import React, { useState, useEffect } from "react";
import TrailCard from "./TrailCard";

function TrailList(props) {
  const [expandedMountains, setExpandedMountains] = useState({});

  useEffect(() => {
    setExpandedMountains({}); // collapse all when trigger changes
  }, [props.collapseAllTrigger]);

  if (!Array.isArray(props.trailData)) {
    return null;
  }

  const groupedByMountain = props.trailData.reduce((acc, trail) => {
    const mountain = trail?.properties?.mntn_nm || "Unknown";
    if (!acc[mountain]) {
      acc[mountain] = [];
    }
    acc[mountain].push(trail);
    return acc;
  }, {});

  const mountainNames = Object.keys(groupedByMountain);

  function toggleMountain(mountain) {
    setExpandedMountains((prev) => {
      const newState = { ...prev };
      if (newState[mountain]) {
        delete newState[mountain];
      } else {
        newState[mountain] = true;
      }
      return newState;
    });
  }

  return (
    <div>
      {mountainNames.map((name) => {
        const trails = groupedByMountain[name];
        if (!trails) {
          return null;
        }
        const isExpanded = !!expandedMountains[name];
        return (
          <div key={name} style={{ marginBottom: "12px" }}>
            <div
              style={{
                cursor: "pointer",
                backgroundColor: "#eee",
                padding: "8px",
                fontWeight: "bold",
                userSelect: "none",
              }}
              onClick={() => toggleMountain(name)}
            >
              {name} {isExpanded ? "▲" : "▼"}
            </div>
            {isExpanded && (
              <div style={{ paddingLeft: "16px", marginTop: "8px" }}>
                {trails.map((trail) => {
                  return (
                    <TrailCard
                      key={trail.id}
                      trail={trail}
                      selectedTrail={props.selectedTrail}
                      setSelectedTrail={props.setSelectedTrail}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TrailList;
