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
    // this.handleSubmit = this.handleSubmit.bind(this);

  }

  state = {
    bar: {}
  };
  ref = null;

  listOfDates = () => {

    let result = [];
    let startDate = moment().startOf('year');
    let currentDate = moment().clone();
    let endDate = moment().endOf('year');

    while (currentDate.isBefore(endDate) && currentDate.isAfter(startDate)) {
      result.push(currentDate.format("MM/YYYY"));
      currentDate.subtract(1, 'month');
    }

    console.log(result);
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
    var usageDetails = this.state.usageDetails;
    var bar = this.state.bar;

    // this.setState({ value: event.target.value });
    alert('Chosen Month: ' + event.target.value);

    bar.labels = usageDetails.monthLabels;
    bar.datasets = [{
      label: 'Votes',
      backgroundColor: '#b9d7e8',
      borderColor: '#2C5062',
      borderWidth: 1,
      hoverBackgroundColor: '#c4deed',
      hoverBorderColor: '#4d84a0',
      data: usageDetails.monthChartData
    }];

    this.setState({ bar: bar });


  }

  // handleSubmit(event) {
  //   alert('Chosen Month: ' + this.state.value);
  //   event.preventDefault();
  // }


  loadData = async () => {
    this.addDatesToDropdown();

    // var usageDetails = this.state.usageDetails;
    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    let usageDetails = await netVoteAdmin.getElectionUsageTimes();

    this.setState({
      usageDetails: usageDetails
    });

    bar.labels = usageDetails.dayLabels;
    bar.datasets = [{
      label: 'Votes',
      backgroundColor: '#b9d7e8',
      borderColor: '#2C5062',
      borderWidth: 1,
      hoverBackgroundColor: '#c4deed',
      hoverBorderColor: '#4d84a0',
      data: usageDetails.dayChartData
    }];
    this.setState({ bar: bar });
    console.log(bar);

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

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <FormGroup className="float-right">
              <select name="ccmonth" id="ccmonth" value={this.state.value} onChange={this.handleChange}/>
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
            <Table responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Real Votes</th>
                  <th>Test Votes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10/01/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/02/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/03/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/04/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/05/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/06/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/07/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/08/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/01/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/02/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/03/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/04/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/05/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/06/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/07/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/08/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/01/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/02/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/03/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/04/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/05/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/06/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/07/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/08/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/01/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/02/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/03/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/04/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/05/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/06/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/07/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
                <tr>
                  <td>10/08/2018</td>
                  <td>100</td>
                  <td>53</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

      </div>
    );
  }
}

export default Charts;
