import React, { useState, useEffect } from "react";
import TrailCard from "./TrailCard";

function TrailList(props) {
  const [expandedMountain, setExpandedMountain] = useState(null);

  useEffect(() => {
    setExpandedMountain(null);
  }, [props.collapseAllTrigger]);

  if (!Array.isArray(props.trailData)) {
    return null;
  }

  // 산 이름 별로 하나의 그룹 생성
  const groupedByMountain = props.trailData.reduce((acc, trail) => {
    const mountain = trail.properties.mntn_nm || "Unknown";
    if (!acc[mountain]) {
      acc[mountain] = [];
    }
    acc[mountain].push(trail);
    return acc;
  }, {});

  const mountainNames = Object.keys(groupedByMountain);

  // 클릭 시 카드 목록 열고 닫기
  function toggleMountain(mountain) {
    setExpandedMountain((prev) => {
      if (prev === mountain) {
        return null;
      }
      return mountain;
    });
  }

  return (
    <div className="trailList">
      {mountainNames.map((name) => {
        const trails = groupedByMountain[name];
        if (!trails) {
          return null;
        }
        const isExpanded = expandedMountain === name;
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
              <div
                style={{
                  paddingLeft: "16px",
                  marginTop: "8px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "12px",
                }}
              >
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
