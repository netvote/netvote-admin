import React, { Component } from 'react';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { Card, Col, Row, CardBody, FormGroup, Input, Label, CardColumns, CardHeader } from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NetVoteAdmin } from '../../lib';
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
    var date = new Date();
    var currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
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
    this.setState({bar: bar});
    console.log(bar);
  }

  setData = async () => {
    await this.loadData();
    this.setState({bar: bar});
  };

  clearData = async () => {
    this.setState({bar: bar});
  };

  componentDidMount = async () => {
    const { user } = this.props;
    await this.loadData();
    this.setState({bar: bar});
  }

  render() {
    return (
      <div className="animated fadeIn">
      <Row>
      <Col>
          <FormGroup className="float-right">
          <Input type="select" name="ccmonth" id="ccmonth">
            <option value="1">Current Month</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </Input>
        </FormGroup>
        </Col>
        </Row>
  <Row>
    <Col>
        <Card>
            <CardHeader>
              Votes
            </CardHeader>
            <CardBody>
              <div className="chart-wrapper">
                <Bar data={this.state.bar} options={options} />
              </div>
            </CardBody>
          </Card>
      </Col>
      </Row>
      </div>
    );
  }
}

export default Charts;
