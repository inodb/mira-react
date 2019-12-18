import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

const CellTypes = ({ label, data, colorScale, width, onHover }) => {
  const dataNames =
    label["label"] === "celltype" ? data : data.map(datum => datum["label"]);

//   console.log(dataNames)
//   console.log(dataNames.map(name => ({ type: "legend", name: name["name"], value: 5 })))

  const frameProps = {
    data: dataNames.map(name => ({ type: "legend", name: name["name"], value: name["count"] })),
    size: [width * 0.9, 15],
    type: "bar",
    projection: "horizontal",

    oAccessor: "type",
    rAccessor: "value",

    style: d => ({ fill: colorScale(d["data"].name), stroke: "white" }),

    pieceHoverAnnotation: true,
    tooltipContent: d => (
      <div className="tooltip-content">
        <p>{d.name}</p>
      </div>
    ),
    customHoverBehavior: d => {
      onHover(d ? { label: label["label"], value: d["name"] } : null);
    }
  };

  return <OrdinalFrame {...frameProps} />;
};

export default CellTypes;
