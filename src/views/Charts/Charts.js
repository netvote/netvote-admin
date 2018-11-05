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
  }

  state = {
    bar: {}
  };
  ref = null;

  listOfDates = () => {

    let result = [];
    let currentDate = moment().clone();
    let endDate = moment().endOf('year');

    while (currentDate.isBefore(endDate)) {
      result.push(currentDate.format("MM/YYYY"));
      currentDate.add(1, 'month');
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
      } else {
        option.text = dates[date];
      }

      option.value = dates[date];
      mthDropdown.add(option);
    }
  }

  loadData = async () => {
    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    let usageDetails = await netVoteAdmin.getElectionUsageTimes();
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

    this.addDatesToDropdown();
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
              <Input type="select" name="ccmonth" id="ccmonth">
                {/* <option value="1">Current Month</option> */}
              </Input>
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
