import React, { Component } from 'react';
import { Auth, Logger } from 'aws-amplify';
import { BDiv } from 'bootstrap-4-react';

// import "react-tabulator/lib/styles.css"; // default theme

// import "../../node_modules/react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)

import "../../node_modules/react-tabulator/lib/css/tabulator_midnight.css"; // use Theme(s)

// for React 16.4.x use: import { ReactTabulator }
import { React15Tabulator } from "react-tabulator"; // for React 15.x

import { NetVoteAdmin } from '../lib';

const logger = new Logger('MainTable');

const columns = [
  { title: "Company", field: "company", align: "left", headerFilter: "input" }, //width: xxx, formatter: xxxx
  { title: "EventName", field: "eventName", align: "left" },
  { title: "EventId", field: "eventId" },
  { title: "ElectionId", field: "electionId", align: "left" },
  { title: "Mode", field: "mode", align: "left" },
  { title: "CreatedAt", field: "createdAt", align: "left" },
  { title: "Network", field: "details.network", align: "left" },
  { title: "Owner", field: "details.owner", align: "left" },
  { title: "voteId", field: "details.voteId", align: "left" },
];
const data = [];

export default class MainTable extends Component {
  constructor(props) {
    super(props);

    this.data = this.loadData.bind(this);

  }

  state = {
    data: []
  };
  ref = null;

  rowClick = (e, row) => {
    logger.info("ref table: ", this.ref.table); // this is the Tabulator table instance
    logger.info(`rowClick id: ${row.getData().id}`, row, e);
  };

  setData = () => {
    this.loadData();
    this.setState({ data });
  };

  clearData = () => {
    this.setState({ data: [] });
  };

  componentDidMount() {
    const { user } = this.props;
    this.loadData();
    this.setState({ data });
  }

  loadData() {
    Auth.currentSession()
      .then(async data => {

        let netVoteAdmin = new NetVoteAdmin();

        let usageDetails = await netVoteAdmin.getElectionUsageDetails();

        this.setState({ data: usageDetails.results })

      }).catch(err => console.log(err));
  }

  render() {
    const options = {
      height: "100%",
      movableRows: true,
      placeholder: "No Election Data Available",
      layout: "fitColumns", //"fitDataFill"
      pagination: "local",
      paginationSize: 20,
    };

    return (
      <div>
        <div>
          <h3>Election Usage Details</h3>
          <BDiv
            display="flex"
            flex="wrap md-nowrap"
            justifyContent="between"
            alignItems="center"
            pt="3"
            pb="2"
            mb="3"
            border="bottom"
          >
          </BDiv>

          <React15Tabulator
            ref={ref => (this.ref = ref)}
            columns={columns}
            data={this.state.data}
            rowClick={this.rowClick}
            options={options}
            data-custom-attr="test-custom-attribute"
            className="custom-css-class"
          />
        </div>
      </div>
    );
  }
}
