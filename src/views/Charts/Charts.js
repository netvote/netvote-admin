import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, Col, Table, Badge, Row, CardBody, FormGroup, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NetVoteAdmin } from '../../lib';
import * as moment from 'moment';
import { Auth } from 'aws-amplify';
import Widget02 from './Widget02';

const ROLLING_WINDOW_IN_MONTHS = 12;

const bar = {
  labels: [],
  datasets: [
    {
      label: 'Votes',
      backgroundColor: '#b9d7e8',
      borderColor: '#2C5062',
      borderWidth: 1,
      hoverBackgroundColor: '#c4deed',
      hoverBorderColor: '#4d84a0',
      data: [],
    },
  ],
};

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}

class Charts extends Component {
  constructor(props) {
    super(props);

    this.data = this.loadData.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    bar: {}
  };
  ref = null;

  listOfDates = () => {

    let result = [];
    let currentDate = moment();

    //Rolling 12 Month Window
    let startDate = currentDate.clone().startOf('month').subtract(ROLLING_WINDOW_IN_MONTHS - 1, 'month');
    let endDate = currentDate.clone();

    //Add previous months for current calendar year only
    while (currentDate.isSameOrBefore(endDate) && currentDate.isSameOrAfter(startDate)) {
      result.push(currentDate.format("MM/YYYY"));
      currentDate.subtract(1, 'month');
    }

    return result;
  }

  addDatesToDropdown = () => {

    let dates = this.listOfDates();

    let mthDropdown = document.getElementById("ccmonth");

    for (let date in dates) {
      let option = document.createElement("option");

      if (mthDropdown.options.length === 0) {
        option.text = 'Current Month';
        option.selected = true;
      } else {
        option.text = dates[date];
      }

      option.value = dates[date];
      mthDropdown.add(option);
    }
  }

  handleChange(event) {
    // let usageDetails = this.state.usageDetails;
    // let bar = this.state.bar;

    //Convert event data
    let date = event.target.value.split("/");
    let monthIndex = date[0];
    let year = date[1];

    //Add daily data to table by month+year
    this.setMonthlyTableData(monthIndex, year);

    //Set Monthly Data
    // let currMonthIndex = +currentDate.format("MM");
    // let chartData = this.setMontlyChartData(usageDetails, currMonthIndex);

    // //Set Month Label
    // let chartLabels = [];
    // chartLabels[0] = currentDate.format("MM/YYYY")

    // this.renderChart(bar, chartLabels, chartData);

  }

  loadData = async () => {
    this.addDatesToDropdown();

    let currentDate = moment();
    let startDate = currentDate.clone().startOf('month').subtract(ROLLING_WINDOW_IN_MONTHS - 1, 'month').valueOf();
    let endDate = currentDate.clone().valueOf();

    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    //Retrieve rolling windows of data by X months
    let usageDetails = await netVoteAdmin.getElectionUsageTimes(startDate, endDate);
    console.log(usageDetails);

    //Store fetch details
    this.setState({
      usageDetails: usageDetails,
      totalVotes: 0,
      totalTestVotes: 0
    });
    
    //Add daily data to table by month+year - Default current month+year
    this.setMonthlyTableData(+currentDate.format("MM"), +currentDate.format("YYYY"));

    //Add Rolling Monthly Chart
    let chartData = [];
    chartData[0] = usageDetails.monthChartData;

    this.renderChart(bar, usageDetails.monthLabels, usageDetails.monthChartData);
  }

  setMonthlyTableData(month, year) {
    let usageDetails = this.state.usageDetails;
    let tbody = document.getElementById("monthlyTableData");

    let monthKey = `${year}-${month}`;
    

    this.setState({
      usageDetails: usageDetails,
      totalVotes: `${usageDetails.months[monthKey]["PROD"]}`,
      totalTestVotes: `${usageDetails.months[monthKey]["TEST"]}`
    });

    let tr, td;

    let jsData = [];

    jsData = usageDetails.days;

    //Clear Table Data
    this.resetMonthlyTableData(tbody);

    const entries = Object.entries(jsData)
    for (const [date, values] of entries) {

      //Determine current data rows month/year
      let rowDate = moment(date, "YYYY-MM-DD");
      let rowMonth = rowDate.month() + 1;
      let rowYear = rowDate.year();

      //Only add chosen months/year data to table
      if ((parseInt(rowMonth, 10) === parseInt(month, 10)) &&
        (parseInt(rowYear, 10) === parseInt(year, 10))) {

        //Add monthly data to table
        tr = tbody.insertRow(tbody.rows.length);

        //Add Date
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = date;

        //Add Prod
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = values["PROD"];

        //Adfd Test
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = values["TEST"];
      }
    }
  }

  setData = async () => {
    await this.loadData();
    this.setState({ bar: bar });
  };

  clearData = async () => {
    this.setState({ bar: bar });
  };

  componentDidMount = async () => {
    const { user } = this.props;
    await this.loadData();
    this.setState({ bar: bar });
  }

  resetMonthlyTableData(tbody) {
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
  }

  setMontlyChartData(usageDetails, currMonthIndex) {
    let chartData = [];
    chartData[0] = usageDetails.monthChartData[currMonthIndex - 1];
    return chartData;
  }

  renderChart(bar, chartLabels, chartData) {
    bar.labels = chartLabels;
    bar.datasets = [{
      label: 'Votes',
      backgroundColor: '#b9d7e8',
      borderColor: '#2C5062',
      borderWidth: 1,
      hoverBackgroundColor: '#c4deed',
      hoverBorderColor: '#4d84a0',
      data: chartData
    }];
    this.setState({ bar: bar });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            Votes
            </CardHeader>
          <CardBody>
            <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
              <Bar data={this.state.bar} options={options} />
            </div>
          </CardBody>
        </Card>
        <Row>
          <Col>
            <FormGroup className="float-right">
              <select name="ccmonth" id="ccmonth" value={this.state.value} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col><Widget02 header={this.state.totalVotes} mainText="Real Votes" icon="fa fa-check" color="primary" variant="1" /></Col>
          <Col><Widget02 header={this.state.totalTestVotes} mainText="Test Votes" icon="fa fa-check" color="primary" variant="1" /></Col>
        </Row>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Daily Counts
              </CardHeader>
          <CardBody>
            <Table responsive id="monthTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Real Votes</th>
                  <th>Test Votes</th>
                </tr>
              </thead>
              <tbody id="monthlyTableData"></tbody>
            </Table>
          </CardBody>
        </Card>

      </div>
    );
  }
}

export default Charts;
