import React, { Component } from 'react';
import { NetVoteAdmin } from '../../../lib';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Table,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.apiKeys = this.loadData.bind(this);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  loadData = async () => {
    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    //Retrieve API Keys
    let apiKeyList = await netVoteAdmin.getApiKeys();

    let keyList = [];
    keyList = apiKeyList["keyList"];

    //Store details
    this.setState({
      apiKeyList: keyList,
      netVoteAdmin: netVoteAdmin
    });

    //Add API Keys to table
    this.setApiKeyTableData();
  }


  componentDidMount = async () => {
    await this.loadData();
  }

  setApiKeyTableData() {
    let apiKeyList = this.state.apiKeyList;

    let tbody = document.getElementById("apiKeyTableData");

    let tr, td;

    //Clear Table Data
    this.resetApiKeyTableData(tbody);

    const entries = Object.entries(apiKeyList);

    for (const [index, values] of entries) {
  
      tr = tbody.insertRow(tbody.rows.length);

      //Add API Key
      td = tr.insertCell(tr.cells.length);
      td.style = "font-family: Courier New;"
      td.innerHTML = values["apiKey"];

      //Add API ID
      td = tr.insertCell(tr.cells.length);
      td.style = "font-family: Courier New"
      td.innerHTML = values["apiId"];

      //Add API Secret
      td = tr.insertCell(tr.cells.length);
      td.style = "font-family: Courier New"
      td.innerHTML = values["apiSecret"];

      //Add API Owner
      td = tr.insertCell(tr.cells.length);
      td.innerHTML = values["createdBy"];

      //Add API Key Age
      let creationAge = this.getCreationAgeInDays(values);  
      
      td = tr.insertCell(tr.cells.length);
      td.innerHTML = creationAge;


      //TODO: ADD FUNCTIONAL BUTTONS
      // <td><Button size="sm" block color="primary">View</Button></td>
      // <td><Button size="sm" block color="danger">Delete</Button></td>

    }
  }

  getCreationAgeInDays(values) {
    var created = moment(values["createdAt"]);
    var now = moment();

    let creationAge = now.diff(created, 'days') + 1; //+1 to include the start day
    return `${creationAge} days`;
  }

  resetApiKeyTableData(tbody) {
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
  }

  //TODO: Add support for Create API Key Button

  render() {
    return (
      <div className="animated fadeIn">
      <Row>
        <Col>
        <Button className="float-right" color="primary"><i className="fa fa-plus-circle"></i>&nbsp;Create API Key</Button>
        </Col>
      </Row>
      <Row>
        <Col>
        <Card style={{ marginTop: 30 + 'px' }}>
          <CardHeader>
            API Keys
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr>
                  <th>API Key</th>
                  <th>API ID</th>
                  <th>API Secret</th>
                  <th>Owner</th>
                  <th>Age</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="apiKeyTableData">
              </tbody>
            </Table>
          </CardBody>
        </Card>
        </Col>
        </Row>


      </div>
    );
  }
}

export default Forms;
