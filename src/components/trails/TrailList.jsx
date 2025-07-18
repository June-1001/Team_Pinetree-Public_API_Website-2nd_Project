import React, { useState, useEffect, useRef } from "react";
import TrailCard from "./TrailCard";

function SortOptionSelector({ value, onChange }) {
  return (
    <div className="list-attribute">
      <span>정렬순 : </span>
      <select value={value} onChange={onChange}>
        <option value="0">거리순</option>
        <option value="1">가나다순</option>
        <option value="2">짧은 등산로순</option>
        <option value="3">긴 등산로순</option>
      </select>
    </div>
  );
}

function TrailList(props) {
  const [expandedMountain, setExpandedMountain] = useState(null);
  const [sortOption, setSortOption] = useState("0");

  useEffect(() => {
    setExpandedMountain(null);
  }, [props.collapseAllTrigger]);

  useEffect(() => {
    if (props.selectedTrail) {
      const mountain = props.selectedTrail.properties.mntn_nm;
      setExpandedMountain(mountain);
    }
  }, [props.selectedTrail]);

  const cardRefs = useRef({});
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (props.selectedTrail && !isMobile) {
      const mountain = props.selectedTrail.properties.mntn_nm;
      setExpandedMountain(mountain);

      setTimeout(() => {
        const ref = cardRefs.current[props.selectedTrail.id];
        if (ref && ref.current) {
          ref.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  }, [props.selectedTrail]);

  if (!Array.isArray(props.trailData)) {
    return null;
  }

  const filteredGroupedByMountain = props.trailData.reduce((acc, trail) => {
    const len = parseFloat(trail.properties.sec_len || 0);
    const diff = trail.properties.cat_nam;

    const minOk = props.minRange === "" || len >= parseFloat(props.minRange);
    const maxOk = props.maxRange === "" || len <= parseFloat(props.maxRange);
    const diffOk =
      props.difficulty === "" || props.difficulty === "전체" || diff === props.difficulty;

    if (!minOk || !maxOk || !diffOk) {
      return acc;
    }

    const mountain = trail.properties.mntn_nm || "Unknown";
    if (!acc[mountain]) {
      acc[mountain] = [];
    }
    acc[mountain].push(trail);
    return acc;
  }, {});

  const mountainNames = Object.keys(filteredGroupedByMountain);

  function toggleMountain(mountain) {
    setExpandedMountain((prev) => {
      if (prev === mountain) {
        return null;
      }
      return mountain;
    });
  }

  function handleSortChange(e) {
    setSortOption(e.target.value);
  }

  let sortedMountainNames = [...mountainNames];

  if (sortOption === "1") {
    sortedMountainNames.sort((a, b) => a.localeCompare(b));
  } else if (sortOption === "2") {
    sortedMountainNames.sort((a, b) => {
      const minA = Math.min(
        ...filteredGroupedByMountain[a].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      const minB = Math.min(
        ...filteredGroupedByMountain[b].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      return minA - minB;
    });
  } else if (sortOption === "3") {
    sortedMountainNames.sort((a, b) => {
      const maxA = Math.max(
        ...filteredGroupedByMountain[a].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      const maxB = Math.max(
        ...filteredGroupedByMountain[b].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      return maxB - maxA;
    });
  }

  function getTotalDistance(trails) {
    const totalMeter = trails.reduce((sum, trail) => {
      const len = parseFloat(trail.properties.sec_len);
      return sum + (isNaN(len) ? 0 : len);
    }, 0);
    return (totalMeter / 1000).toFixed(2);
  }

  return (
    <div className="trail-list">
      {Object.keys(filteredGroupedByMountain).length === 0 ? (
        <div className="no-info">산 정보 없음</div>
      ) : (
        <>
          <SortOptionSelector value={sortOption} onChange={handleSortChange} />
          {sortedMountainNames.map((name) => {
            const trails = filteredGroupedByMountain[name];
            if (!trails) {
              return null;
            }
            const isExpanded = expandedMountain === name;
            return (
              <div key={name} style={{ marginBottom: "12px" }}>
                <div className="trail-list-item" onClick={() => toggleMountain(name)}>
                  {name} (총 등산로 길이 : {getTotalDistance(trails)} km){" "}
                  {isExpanded ? (
                    <div className="right up">▲</div>
                  ) : (
                    <div className="right down">▼</div>
                  )}
                </div>
                {isExpanded && (
                  <div className="trail-card-list">
                    {trails.map((trail) => {
                      if (!cardRefs.current[trail.id]) {
                        cardRefs.current[trail.id] = React.createRef();
                      }
                      return (
                        <TrailCard
                          key={trail.id}
                          trail={trail}
                          selectedTrail={props.selectedTrail}
                          setSelectedTrail={props.setSelectedTrail}
                          ref={cardRefs.current[trail.id]}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default TrailList;
