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


function getCreationAgeInDays (values) {
  var created = moment(values["createdAt"]);
  var now = moment();

  let creationAge = now.diff(created, 'days') + 1; //+1 to include the start day
  return `${creationAge} days`;
}



class Forms extends Component {
  constructor(props) {
    super(props);

    this.apiKeys = this.loadData.bind(this);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.onViewApiBtnClick = this.onViewApiBtnClick.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      apiKeyList: []
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

  }

   onViewApiBtnClick() {
    alert('TRYING TO VIEW API KEY');
  }

  componentDidMount = async () => {
    await this.loadData();
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
                  <th>Created By</th>
                  <th>Age</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="apiKeyTableData">
              {this.state.apiKeyList.map(function(key, index){
                
                    return  <tr key={key.id}>
                        <td style={{fontFamily: "Courier New"}}>{key.apiKey}</td>
                        <td style={{fontFamily: "Courier New"}}>{key.apiId}</td>
                        <td style={{fontFamily: "Courier New"}}>{key.apiSecret}</td>
                        <td>{key.createdBy}</td>
                        <td>{getCreationAgeInDays(key)}</td>
                        <td><Button size="sm" block color="primary" onClick={() => this.onViewApiBtnClick()}>View</Button></td>
                        <td><Button onClick={() => this.toggle(0)}size="sm" block color="danger">Delete</Button></td>
                        </tr>;
                  })}
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
