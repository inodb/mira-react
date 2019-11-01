import React from "react";
import Header from "@bit/viz.spectrum.spectrumheader";

import ExpansionPanel from "./components/ExpansionPanel";

import SelectionPanel from "./Select/SelectionPanel";
import Dashboard from "./Dashboard/Dashboard";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Grid from "@material-ui/core/Grid";
import { theme } from "./config/config.js";

import { useDashboardType, useDashboardID } from "./utils/useDashboardInfo";

// const ContentStyles = {
//     width: "70%",
//     display: "flex",
//     flexDirection: "row"
//   };

//   const useStyles = makeStyles({
//     summary: {
//       backgroundColor: "#ffffff"
//     },
//     title: {
//       color: "#8a939a",
//       fontSize: "25px",
//       fontWeight: "500"
//     }
//   });

const NAME = "Mira";
const DESCRIPTION =
  "An interactive visualization for single cell RNA QC data, as generated by the scRNA-seq pipeline (https://github.com/shahcompbio/SCRNApipeline).";

const App = () => {
  const [dashboardType, dashboardID] = [useDashboardType(), useDashboardID()];

  return (
    <MuiThemeProvider theme={theme}>
      <Header name={NAME} description={DESCRIPTION} />
      <Grid
        container
        direction="column"
        width="95%"
        spacing={2}
        style={{
          padding: "40px 20px"
        }}
      >
        <Grid item>
          <ExpansionPanel title={"Dashboard Selection"}>
            <SelectionPanel />
          </ExpansionPanel>
        </Grid>
        {dashboardType && dashboardID ? (
          <Grid item>
            <ExpansionPanel title={"Dashboard"}>
              <Dashboard />
            </ExpansionPanel>
          </Grid>
        ) : null}
      </Grid>
    </MuiThemeProvider>
  );
};

export default App;
