import React, { Component } from 'react';
import { NetVoteAdmin } from '../../../lib';
import { Auth } from 'aws-amplify';
import * as moment from 'moment';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';


function getCreationAgeInDays(values) {
  var created = moment(values["createdAt"]);
  var now = moment();

  let creationAge = now.diff(created, 'days') + 1; //+1 to include the start day
  return `${creationAge} days`;
}

class NetrosaAPIKeys extends Component {
  constructor(props) {
    super(props);

    this.apiKeys = this.loadData.bind(this);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.toggleViewApiModal = this.toggleViewApiModal.bind(this);
    this.toggleDeleteApiModal = this.toggleDeleteApiModal.bind(this);

    this.deleteApiKeyAction = this.deleteApiKeyAction.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      apiKeyList: [],
      clippedApiData: {},

    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  toggleViewApiModal() {
    this.setState({
      primary: !this.state.primary,
    });
  }

  toggleDeleteApiModal() {
    this.setState({
      delModal: !this.state.delModal,
    });
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }

  loadData = async () => {
    await Auth.currentSession()
    let NetrosaAdmin = new NetVoteAdmin();

    //Retrieve API Keys
    let apiKeyList = await NetrosaAdmin.getNetrosaApiKeys();

    let keyList = [];
    keyList = apiKeyList["keyList"];

    //Store details
    this.setState({
      apiKeyList: keyList,
      NetrosaAdmin: NetrosaAdmin
    });
  }

  onViewApiBtnClick = async (id) => {

    let NetrosaAdmin = this.state.NetrosaAdmin;

    //Get Unmasked API Key values
    let response = await NetrosaAdmin.getNetrosaApiKey(id);

    //Show Modal
    this.toggleViewApiModal();

    //Store elements to clipboard text area
    let clippedApiData = {
      apiId: `${response["apiId"]}`,
      apiKey: `${response["apiKey"]}`,
      apiSecret: `${response["apiSecret"]}`
    };

    this.setState({
      clipContent: clippedApiData,
      apiKey: `${response["apiKey"]}`,
      apiId: `${response["apiId"]}`,
      apiSecret: `${response["apiSecret"]}`
    });

    //Get new API List
    await this.loadData();
  }

  copyToClipboard = (key) => {
    //Add selected data to clipboard
    let content = this.state.clipContent[key];

    const hiddenTxtArea = document.createElement('textarea');

    hiddenTxtArea.value = content;
    hiddenTxtArea.setAttribute('readonly', '');
    hiddenTxtArea.style.position = 'absolute';
    hiddenTxtArea.style.left = '-9999px';

    document.body.appendChild(hiddenTxtArea);
    hiddenTxtArea.select();

    document.execCommand('copy');

    //Show copy confirmation
    this.setState({
      successTitle: `Copy Complete`,
      successMessage: `${key} copied to your clipboard`
    });

    this.toggleSuccess();

    document.body.removeChild(hiddenTxtArea);
  };

  onDeleteApiBtnClick = async (id) => {

    //Show Modal
    this.toggleDeleteApiModal();

    //Store api key id for deletion
    this.setState({ deleteKeyId: id });
  }

  deleteApiKeyAction = async () => {

    //Get stored api key id for deletion
    let id = this.state.deleteKeyId;

    console.log(`deleteApiKey() Deleting Netrosa API ID: ${id}`);

    let NetrosaAdmin = this.state.NetrosaAdmin;

    //Delete API Key
    let response = await NetrosaAdmin.deleteNetrosaApiKey(id);
    console.log("deleteNetrosaApiKey() Response: " + response);

    //Clear api key id for deletion
    this.setState({ deleteKeyId: "" });

    //Get new API List
    await this.loadData();

    //dismiss Delete Modal
    this.toggleDeleteApiModal();
  }

  onCreateApiBtnClick = async () => {

    let NetrosaAdmin = this.state.NetrosaAdmin;

    //Create API Key
    let response = await NetrosaAdmin.addNetrosaApiKey();
    console.log("addNetrosaApiKey() Response: " + response);

    //Get new API List
    await this.loadData();
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  resetApiKeyTableData(tbody) {
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Button className="float-right" color="primary" onClick={() => this.onCreateApiBtnClick()}><i className="fa fa-plus-circle"></i>&nbsp;Create API Key</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              <CardHeader>
                Netrosa API Keys
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
                    {this.state.apiKeyList.map(function (key, index) {
                      return <tr key={key.id}>
                        <td style={{ fontFamily: "Courier New" }}>{key.apiKey}</td>
                        <td style={{ fontFamily: "Courier New" }}>{key.apiId}</td>
                        <td style={{ fontFamily: "Courier New" }}>{key.apiSecret}</td>
                        <td>{key.createdBy}</td>
                        <td>{getCreationAgeInDays(key)}</td>
                        <td><Button size="sm" block color="primary" onClick={() => this.onViewApiBtnClick(key.id)}>View</Button></td>
                        <td><Button size="sm" block color="danger" onClick={() => this.onDeleteApiBtnClick(key.id)}>Delete</Button></td>
                      </tr>;
                    }, this)}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={this.state.delModal} centered={true} toggle={this.toggleDeleteApiModal}
          className={'modal-danger ' + this.props.className} size="mid" color="danger">
          <ModalHeader toggle={this.toggleDeleteApiModal}>Delete API Key</ModalHeader>
          <ModalBody id="deleteBodyText" style={{ fontWeight: "bold", color: "red" }}>
            Are you sure you want to delete this API Key?
                  </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteApiKeyAction}>Delete</Button>{' '}
            <Button color="secondary" onClick={this.toggleDeleteApiModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.primary} centered={true} toggle={this.toggleViewApiModal}
          className={'modal-primary ' + this.props.className} size="lg" color="primary">
          <ModalHeader toggle={this.toggleViewApiModal}>Netrosa API Key Details</ModalHeader>
          <ModalBody id="modalBodyText" style={{ margin: "20px" }} >
            <Row>
              <Col >
                <Card>
                  <CardHeader style={{ fontWeight: "bold", color: "#1985ac" }}>
                    API Key
                  <Button color="secondary" onClick={() => this.copyToClipboard('apiKey')} size="sm" className="float-right btn-primary"><i style={{ color: "#1985ac" }} className="fa fa-clipboard"></i></Button>
                  </CardHeader>
                  <CardBody style={{ fontFamily: "Courier New", backgroundColor: "black", color: "aqua" }}>
                    {this.state.apiKey}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader style={{ fontWeight: "bold", color: "#1985ac" }}>
                    API ID
                  <Button color="secondary" onClick={() => this.copyToClipboard('apiId')} size="sm" className="float-right btn-primary"><i style={{ color: "#1985ac" }} className="fa fa-clipboard"></i></Button>
                  </CardHeader>
                  <CardBody style={{ fontFamily: "Courier New", backgroundColor: "black", color: "aqua" }}>
                    {this.state.apiId}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader style={{ fontWeight: "bold", color: "#1985ac" }}>
                    API Secret
                  <Button color="secondary" onClick={() => this.copyToClipboard('apiSecret')} size="sm" className="float-right btn-primary"><i style={{ color: "#1985ac" }} className="fa fa-clipboard"></i></Button>
                  </CardHeader>
                  <CardBody style={{ fontFamily: "Courier New", backgroundColor: "black", color: "aqua" }}>
                    {this.state.apiSecret}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleViewApiModal}>Close</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.success} centered={true} toggle={this.toggleSuccess}
          className={'modal-success ' + this.props.className}>
          <ModalHeader toggle={this.toggleSuccess}>{this.state.successTitle}</ModalHeader>
          <ModalBody style={{ fontWeight: "bold", color: "green", backgroundColor: "#90ee9057" }}>
            {this.state.successMessage}
          </ModalBody>
        </Modal>

      </div>
    );
  }
}

export default NetrosaAPIKeys;
