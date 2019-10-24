import React, { useRef, useState, useEffect } from "react";
import Header from "@bit/viz.spectrum.spectrumheader";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import SelectionPanel from "./Select/SelectionPanel_old";

import { theme } from "./config/config.js";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/styles";

import LabelSelectQuery from "./Select/LabelSelectQuery";
import QCTable from "./QCTable/QCTable";
import Dashboard from "./ReDim/Dashboard.js";

const name = "Mira";
const description =
  "An interactive visualization for single cell RNA (scRNA) QC data, as generated by the scRNA-seq pipeline (https://github.com/shahcompbio/SCRNApipeline).";

const ContentStyles = {
  width: "70%",
  display: "flex",
  flexDirection: "row"
};

const useStyles = makeStyles({
  summary: {
    backgroundColor: "#ffffff"
  },
  title: {
    color: "#8a939a",
    fontSize: "25px",
    fontWeight: "500"
  }
});

const App = ({ location, history }) => {
  const [patientID] = location.pathname.substr(1).split("/");
  const [screenWidth, setWidth] = useState(0);
  const [screenHeight, setHeight] = useState(0);
  const [label, setLabel] = useState({
    id: "A1BG",
    type: "gene",
    title: "A1BG"
  });
  const [sampleLabel, setSampleLabel] = useState(
    location.pathname ? location.pathname.substr(2).split("/")[1] : 0
  );
  const [patientPanelState, setPatientPanelState] = useState(true);
  const [samplePanelState, setSamplePanelState] = useState(true);

  const widthRef = useRef(0);

  const updateDimensions = () => {
    setWidth(widthRef.current.clientWidth);
    setHeight(500);
  };

  const handlePatientChange = e => {
    patientID.length > 0 && patientPanelState
      ? setPatientPanelState(false)
      : setPatientPanelState(true);
    history.push("/" + patientID);
  };

  const handleSampleChange = e => {
    patientID.length > 0 && samplePanelState
      ? setSamplePanelState(false)
      : setSamplePanelState(true);
  };

  window.addEventListener("resize", updateDimensions);

  useEffect(() => {
    updateDimensions();
  });

  const InputLabelStyle = { padding: "19px" };

  const SelectionStyles = {
    width: 225,
    padding: "15px"
  };

  const handleSampleClick = sampleLabel => {
    setSampleLabel(sampleLabel);
    history.push("/" + patientID + "/" + sampleLabel);
  };

  const handleReClick = e => {
    setSampleLabel(undefined);
    history.push("/" + patientID);
  };

  const handleDemoButtonClick = e => {
    const url = "https://youtu.be/ctMJMiQADiM";
    window.open(url, "_blank");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Header name={name} description={description} />
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
          <SelectionPanel
            handlePatientClick={handlePatientChange}
            handleSampleClick={handleSampleClick}
            sampleLabel={sampleLabel}
            setSampleLabel={label => setSampleLabel(label)}
            widthRef={widthRef}
            patientID={patientID}
            name={"Patient ID : "}
            styles={{
              width: screenWidth * 0.99,
              padding: "0px"
            }}
          />
          {!patientID ? null : (
            <ExpansionPanelComponent
              handleChange={handlePatientChange}
              shouldExpand={patientID.length === 0 ? false : patientPanelState}
              widthRef={widthRef}
              patientID={patientID}
              styles={{
                width: screenWidth * 0.99,
                marginRight: 0
              }}
              label={"QC Table"}
            >
              <QCTable
                label={sampleLabel}
                onClick={handleSampleClick}
                patientID={patientID}
                onReClick={handleReClick}
              />
            </ExpansionPanelComponent>
          )}
        </Grid>
        <Grid item>
          {!sampleLabel ? (
            !patientID ? null : (
              <ExpansionPanelComponent
                handleChange={handleSampleChange}
                shouldExpand={patientID.length === 0 ? false : samplePanelState}
                patientID={patientID}
                label={"Dashboard"}
                SelectionStyles={SelectionStyles}
                InputLabelStyle={InputLabelStyle}
                sampleLabel={sampleLabel}
                setSampleLabel={label => setSampleLabel(label)}
                name={"Dashboard : "}
                styles={{
                  width: screenWidth * 0.99,
                  paddingLeft: screenWidth / 50,
                  paddingTop: 30
                }}
              >
                <LabelSelectQuery
                  updateLabel={label => setLabel(label)}
                  patientID={patientID}
                  sampleID={sampleLabel}
                  dashboard={1}
                  labelTitle={
                    label === null || label === undefined
                      ? "Cell Type"
                      : label.title
                  }
                />
                <Dashboard
                  screenHeight={screenHeight}
                  screenWidth={screenWidth}
                  patientID={patientID}
                  dashboard={true}
                  label={label}
                  onClick={label => setLabel(label)}
                />
              </ExpansionPanelComponent>
            )
          ) : (
            <ExpansionPanelComponent
              handleChange={handleSampleChange}
              shouldExpand={patientID.length === 0 ? false : samplePanelState}
              patientID={patientID}
              label={"Dashboard"}
              SelectionStyles={SelectionStyles}
              InputLabelStyle={InputLabelStyle}
              sampleLabel={sampleLabel}
              setSampleLabel={label => setSampleLabel(label)}
              name={"Dashboard : "}
              styles={{
                width: screenWidth * 0.99,
                paddingLeft: screenWidth / 50,
                paddingTop: 30
              }}
            >
              {" "}
              <LabelSelectQuery
                updateLabel={label => setLabel(label)}
                patientID={patientID}
                sampleID={sampleLabel}
                labelTitle={
                  label === null || label === undefined
                    ? "Cell Type"
                    : label.title
                }
              />
              <div style={ContentStyles}>
                <Dashboard
                  screenHeight={screenHeight}
                  screenWidth={screenWidth}
                  patientID={patientID}
                  dashboard={false}
                  sampleID={sampleLabel}
                  label={label}
                  onClick={label => setLabel(label)}
                />
              </div>
            </ExpansionPanelComponent>
          )}
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
};

const ExpansionPanelComponent = ({
  children,
  handleChange,
  shouldExpand,
  widthRef,
  name,
  handleDemoButtonClick,
  patientID,
  SelectionStyles,
  InputLabelStyle,
  sampleLabel,
  styles,
  screenWidth,
  setSampleLabel,
  label
}) => (
  <ExpansionPanel onChange={handleChange} expanded={shouldExpand}>
    <ExpansionPanelSummary
      className={useStyles().summary}
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <div
        style={{
          color: "#797979",
          paddingLeft: "0px",
          paddingTop: "10px"
        }}
      >
        <Typography variant="h4" className={useStyles().title}>
          {label}
        </Typography>
      </div>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails style={{ padding: "0px" }}>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        spacing={2}
        ref={widthRef}
        style={{
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
          padding: "0px 0px"
        }}
      >
        <Grid item style={styles}>
          {children}
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default withRouter(App);