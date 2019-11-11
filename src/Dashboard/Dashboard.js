import React, { useState, useEffect } from "react";

import ReDimChart from "./ReDimChart";

import Grid from "@material-ui/core/Grid";

import CellAssignTable from "./CellAssignTable";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return width;
}

const Dashboard = () => {
  const [highlightedLabel, setHighlightedLabel] = useState(null);
  const [labels, setLabels] = useState([
    { label: "celltype", type: "CELL" },
    { label: "celltype", type: "CELL" },
    { label: "celltype", type: "CELL" }
  ]);

  const windowWidth = useWindowWidth();
  const chartWidth = Math.floor((windowWidth - 150) / labels.length);

  return (
    <Grid container direction="column">
      <Grid container direction="row">
        {labels.map((label, index) => (
          <Grid
            key={`grid_redim_${index}`}
            item
            xs={4}
            style={{ minHeight: 500 }}
          >
            <ReDimChart
              key={`redim_${index}`}
              width={chartWidth}
              labels={labels}
              index={index}
              highlightedGroup={highlightedLabel}
              onLegendHover={setHighlightedLabel}
              onSelect={label =>
                setLabels(
                  labels.map((oldLabel, oldLabelIndex) =>
                    oldLabelIndex === index ? label : oldLabel
                  )
                )
              }
            />
          </Grid>
        ))}
      </Grid>
      <Grid item>
        <CellAssignTable
          selectedGene={labels[1]["label"]}
          setSelectedGene={label => {
            const [firstLabel, ...restLabels] = labels;
            setLabels([{ label, type: "GENE" }, ...restLabels]);
          }}
          setSelectedCelltype={celltype =>
            setHighlightedLabel({ label: "celltype", value: celltype })
          }
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
