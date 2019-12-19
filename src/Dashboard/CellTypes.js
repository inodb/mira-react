import React from "react";

import OrdinalFrame from "semiotic/lib/OrdinalFrame";

import {getCelltypeColors} from "./getColors";

const CellTypes = ({ data, width }) => {
//   const dataNames =
//     label["label"] === "celltype" ? data : data.map(datum => datum["label"]);

//   console.log(dataNames)
//   console.log(dataNames.map(name => ({ type: "legend", name: name["name"], value: 5 })))

  console.log(data)
  console.log(data.map(record => record["key"]))
  const colorScale = getCelltypeColors(data.map(record => record["key"]))
  console.log(data.map(name => ({ type: "legend", name: name["key"], value: name["doc_count"] })))

//   return "test"

  const frameProps = {
    data: data.map(name => ({ type: "legend", name: name["key"], value: name["doc_count"] })),
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
    // customHoverBehavior: d => {
    //   onHover(d ? { label: label["label"], value: d["name"] } : null);
    // }
  };

  return <OrdinalFrame {...frameProps} />;
};

export default CellTypes;
