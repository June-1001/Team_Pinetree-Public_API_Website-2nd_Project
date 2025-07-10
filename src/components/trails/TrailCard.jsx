// 등산로 카드
import React from "react";

const TrailCard = React.forwardRef((props, ref) => {
  // 클릭 시 이벤트
  function handleClick() {
    // trailCard 클릭 시 카테고리 초기화
    if (typeof window.setSelectedCategory === 'function') {
      window.setSelectedCategory("");
      document.querySelectorAll("#category li.on").forEach((el) => {
        el.classList.remove("on");
      });
    }
    if (props.selectedTrail && props.selectedTrail.id === props.trail.id) {
      props.setSelectedTrail(null);
      setTimeout(() => {
        props.setSelectedTrail(props.trail);
      }, 0);
    } else {
      props.setSelectedTrail(props.trail);
    }
  }

  // 카드 생성
  return (
    <div
      ref={ref}
      id={`trail-card-${props.trail.id}`}
      className="trail-card"
      style={{
        border:
          props.selectedTrail && props.selectedTrail.id === props.trail.id
            ? "4px solid #2cc532"
            : "1px solid gray",
        padding: "8px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <div>산명칭 : {props.trail.properties.mntn_nm}</div>
      <div>길이 : {props.trail.properties.sec_len}m</div>
      <div>난이도 : {props.trail.properties.cat_nam}</div>
      <div>상행속도 : {props.trail.properties.up_min}분</div>
      <div>하행속도 : {props.trail.properties.down_min}분</div>      
    </div>
  );
});

export default TrailCard;
