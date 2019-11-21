import React, { useState, Fragment } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useLocation } from "react-router";
import { useDashboardType, useDashboardID } from "../utils/useDashboardInfo";

import { makeStyles } from "@material-ui/core/styles";
import formatInteger from "../utils/formatInteger";

const useStyles = makeStyles(theme => ({
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main + " !important"
    }
  },
  mergedDashboardCell: {
    color: "black",
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    fontWeight: "bold"
  },
  metadataCell: {
    color: "black",
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    fontWeight: "bold",
    textAlign: "center"
  },
  dropdown: {
    transition: "all .5s ease-in-out"
  },
  dropdownOpen: {
    transform: "rotate(0)"
  },
  dropdownClosed: {
    transform: "rotate(-90deg)"
  }
}));

const QUERY = gql`
  query($dashboardType: String!, $filters: [filterInput]!) {
    dashboardClusters(type: $dashboardType, filters: $filters) {
      dashboards {
        id
        samples {
          id
          name
          metadata {
            name
            value
          }
          stats {
            name
            value
          }
        }
      }
      metadata {
        name
      }
      stats
    }
  }
`;

const MetadataTable = ({ filters, onSelect }) => {
  const location = useLocation();
  const dashboardType = useDashboardType(location);
  const dashboardID = useDashboardID(location);

  const { data, loading, error } = useQuery(QUERY, {
    variables: { dashboardType, filters }
  });

  if (!data && (loading || error)) {
    return null;
  }

  const { dashboards, metadata, stats } = data["dashboardClusters"];

  const metadataHeaders = metadata.map(datum => datum["name"]);

  return (
    <div style={{ maxHeight: 400, overflow: "auto", marginTop: "20px" }}>
      <Table size="small">
        <TableHeader columns={[...metadataHeaders, ...stats]} />
        <TableBody>
          {dashboardType === "sample"
            ? dashboards.map(row => (
                <SampleRow
                  key={`sampleRow_${row["id"]}`}
                  metadata={metadataHeaders}
                  stats={stats}
                  data={collapseMetadataAndStats(row["samples"][0])}
                  onClick={onSelect}
                  selectedID={dashboardID}
                />
              ))
            : dashboards.map(dashboard => (
                <DashboardTable
                  id={`dashboardTable_${dashboard["id"]}`}
                  dashboard={dashboard}
                  metadata={metadataHeaders}
                  stats={stats}
                  onClick={onSelect}
                  selectedID={dashboardID}
                />
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

const TableHeader = ({ columns }) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell
          align="center"
          key={column}
          style={{
            backgroundColor: "#fff",
            position: "sticky",
            top: 0
          }}
        >
          {column}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const DashboardTable = ({
  dashboard,
  metadata,
  stats,
  onClick,
  selectedID
}) => {
  const [expanded, setExpanded] = useState(true);
  const classes = useStyles();
  return (
    <Fragment>
      <TableRow
        hover={onClick}
        className={classes.tableRow}
        onClick={_ => onClick(dashboard["id"])}
        selected={selectedID === dashboard["id"]}
      >
        <TableCell
          colSpan={metadata.length + stats.length}
          className={classes.mergedDashboardCell}
        >
          <IconButton
            className={[
              classes.dropdown,
              expanded ? classes.dropdownOpen : classes.dropdownClosed
            ]}
            size="small"
            onClick={event => {
              setExpanded(!expanded);
              event.stopPropagation();
            }}
          >
            <ExpandMoreIcon />
          </IconButton>{" "}
          {dashboard["id"]}
        </TableCell>
      </TableRow>
      {expanded
        ? dashboard["samples"].map(sample => (
            <SampleRow
              id={`dashboardTable_${sample["id"]}`}
              data={collapseMetadataAndStats(sample)}
              metadata={metadata}
              stats={stats}
            />
          ))
        : null}
    </Fragment>
  );
};

const SampleRow = ({ metadata, stats, data, onClick, selectedID }) => {
  const classes = useStyles();
  return (
    <TableRow
      className={onClick ? classes.tableRow : null}
      hover={onClick}
      onClick={onClick ? _ => onClick(data["id"]) : null}
      selected={selectedID === data["id"]}
    >
      {[
        ...metadata.map(column => (
          <TableCell
            className={classes.metadataCell}
            key={`${data["id"]}_metadata_${column}`}
          >
            {data["metadata"][column]}
          </TableCell>
        )),
        ...stats.map(column => (
          <TableCell align="center" key={`${data["id"]}_stats_${column}`}>
            {formatInteger(data["stats"][column])}
          </TableCell>
        ))
      ]}
    </TableRow>
  );
};

const collapseMetadataAndStats = sample => ({
  ...sample,
  metadata: sample["metadata"].reduce(
    (mapping, datum) => ({
      ...mapping,
      [datum["name"]]: datum["value"]
    }),
    {}
  ),
  stats: sample["stats"].reduce(
    (mapping, datum) => ({
      ...mapping,
      [datum["name"]]: datum["value"]
    }),
    {}
  )
});

export default MetadataTable;
