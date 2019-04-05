import React from "react";
import SampleSelect from "./SampleSelect";
import { withRouter } from "react-router";
import ReDimPlot from "./ReDim/ReDimPlot";

const App = ({ location }) => {
  const sampleID = location.pathname.substr(1);
  return (
    <div className="App" style={AppStyles}>
      <SampleSelect sampleID={sampleID} />
      <ReDimPlot sampleID={sampleID} />
    </div>
  );
};

const AppStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  padding: "25px",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexDirection: "column"
};

export default withRouter(App);
