import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, Col, Table, Badge, Row, CardBody, FormGroup, Input, Label, CardColumns, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NetVoteAdmin } from '../../lib';
import * as moment from 'moment';
import { Auth } from 'aws-amplify';

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

    let startDate = currentDate.clone().startOf('year');
    let endDate = currentDate.clone().endOf('year');

    //Add previous months for current calendar year only
    while (currentDate.isBefore(endDate) && currentDate.isAfter(startDate)) {
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
    let usageDetails = this.state.usageDetails;
    let bar = this.state.bar;

    //Convert chosen month string to monthly data index (MM/YYYY)
    let monthIndex = +event.target.value.substring(0, 2);

    //Set Monthly Data
    let chartData = this.setMontlyChartData(usageDetails, monthIndex);

    //Set Month Label
    let chartLabels = [];
    chartLabels[0] = event.target.value;

    //Add daily data to table by month
    this.setMonthlyTableData(monthIndex);

    //Add monthly Chart
    this.renderChart(bar, chartLabels, chartData);
  }

  loadData = async () => {
    this.addDatesToDropdown();

    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    let currentDate = moment();
    let startDate = currentDate.clone().startOf('year').valueOf();
    let endDate = currentDate.clone().endOf('month').valueOf();

    //Retrieve ALL data for current year up to end of current month
    let usageDetails = await netVoteAdmin.getElectionUsageTimes(startDate, endDate);

    this.setState({
      usageDetails: usageDetails
    });

    //Set Monthly Data
    let currMonthIndex = +currentDate.format("MM");
    let chartData = this.setMontlyChartData(usageDetails, currMonthIndex);

    //Set Month Label
    let chartLabels = [];
    chartLabels[0] = currentDate.format("MM/YYYY")

    this.renderChart(bar, chartLabels, chartData);

    //Add daily data to table by month
    this.setMonthlyTableData(+currentDate.format("MM"));

  }

  setMonthlyTableData(month) {
    let usageDetails = this.state.usageDetails;
    let tbody = document.getElementById("monthlyTableData");

    let tr, td;

    let jsData = [];

    jsData = usageDetails.days;

    //Clear Table Data
    this.resetMonthlyTableData(tbody);

    const entries = Object.entries(jsData)
    for (const [date, values] of entries) {

      //Determine current data rows month
      let rowMonth = moment(date, "YYYY-MM-DD").month() + 1;

      //Only add chosen months data to table
      if (parseInt(rowMonth, 10) === parseInt(month, 10)) {

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
        <Row>
          <Col>
            <FormGroup className="float-right">
              <select name="ccmonth" id="ccmonth" value={this.state.value} onChange={this.handleChange} />
            </FormGroup>
          </Col>
        </Row>
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

        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Day Counts
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
