import React, { useState, useEffect, useRef } from "react";
import TrailCard from "./TrailCard";

// 정렬 옵션 선택 컴포넌트
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

  // 카드 선택 시 해당 위치로 스크롤
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
      }, 100); // 렌더링 후 DOM이 보장될 수 있도록 약간 딜레이
    }
  }, [props.selectedTrail]);

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

  function handleSortChange(e) {
    setSortOption(e.target.value);
  }

  let sortedMountainNames = [...mountainNames];

  if (sortOption === "1") {
    // 가나다순: 산 이름 오름차순
    sortedMountainNames.sort((a, b) => a.localeCompare(b));
  } else if (sortOption === "2") {
    // 짧은 등산로순: 각 산의 등산로 중 가장 짧은 거리 기준 오름차순
    sortedMountainNames.sort((a, b) => {
      const minA = Math.min(
        ...groupedByMountain[a].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      const minB = Math.min(
        ...groupedByMountain[b].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      return minA - minB;
    });
  } else if (sortOption === "3") {
    // 긴 등산로순: 각 산의 등산로 중 가장 긴 거리 기준 내림차순
    sortedMountainNames.sort((a, b) => {
      const maxA = Math.max(
        ...groupedByMountain[a].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      const maxB = Math.max(
        ...groupedByMountain[b].map((trail) => parseFloat(trail.properties.sec_len || 0))
      );
      return maxB - maxA;
    });
  }

  function getTotalDistance(trails) {
    // sec_len이 m(미터) 단위이므로 km로 변환
    const totalMeter = trails.reduce((sum, trail) => {
      const len = parseFloat(trail.properties.sec_len);
      return sum + (isNaN(len) ? 0 : len);
    }, 0);
    return (totalMeter / 1000).toFixed(2); // km 단위, 소수점 2자리
  }

  return (
    <div className="trail-list">
      {sortedMountainNames.length > 0 && (
        <>
          <SortOptionSelector value={sortOption} onChange={handleSortChange} />
          {sortedMountainNames.map((name) => {
            const trails = groupedByMountain[name];
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
