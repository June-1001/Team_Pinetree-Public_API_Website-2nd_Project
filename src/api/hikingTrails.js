const vworldApiKey = `31198BF5-179E-3380-947F-F97448ED7D34`;

const hiking = {
  url: "https://api.vworld.kr/req/data",
  domain: "localhost:3000",
  service: "data",
  request: "getfeature",
  format: "json",
  data: "LT_L_FRSTCLIMB",
  size: 1000,
  page: 1,
  geomFilter: lat !== null && lon !== null ? setHikingGeomFilter({ x: lon, y: lat }, 3) : null,
  attrFilter: setAttrFilter(),
};

function setHikingGeomFilter(point, bufferKm) {
  const bufferLat = bufferKm / 111;
  const bufferLon = bufferKm / (111 * Math.cos((point.y * Math.PI) / 180));

  function round(num) {
    Math.round(num * 1000) / 1000;
  }

  const minx = round(point.x - bufferLon);
  const maxx = round(point.x + bufferLon);
  const miny = round(point.y - bufferLat);
  const maxy = round(point.y + bufferLat);

  return `BOX(${minx},${miny},${maxx},${maxy})`;
}

function setAttrFilter() {
  const filters = [];

  return filters.join("|");
}
