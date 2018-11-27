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

function getFormattedDate(created) {
  let createDate = moment(created).format('MM-DD-YYYY');

  return createDate;
}

class Profile extends Component {
  constructor(props) {
    super(props);

    this.accountType = this.loadData.bind(this);
    this.toggleChangePasswordModal = this.toggleChangePasswordModal.bind(this);

    this.state = {
      accountType: '',
    };
  };

  loadData = async () => {
    await Auth.currentSession()
    let netVoteAdmin = new NetVoteAdmin();

    //Retrieve Tenant Info
    let tenantInfo = await netVoteAdmin.getTentantInfo();

    //Set Tenant Account Message
    this.setState({
      accountType: tenantInfo["accountType"],
      accountOwner: tenantInfo["owner"],
      maxApiKeys: tenantInfo["maxApiKeys"],
      createdAt: tenantInfo["createdAt"],
    });

    console.log('Account Type: ' + this.state.accountType);
    console.log('CreatedAt: ' + this.state.createdAt);
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  toggleChangePasswordModal() {
    this.setState({
      primary: !this.state.primary,
    });
  }

  onChangePasswordBtnClick = async (id) => {
    console.log('CLICKED Change Password!');

    //Show Modal
    this.toggleChangePasswordModal();

  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Button className="float-right" color="primary" onClick={() => this.onChangePasswordBtnClick()}><i className="fa fa-lock"></i>&nbsp;Change Password</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={{ marginTop: 30 + 'px' }}>
              {/* <CardHeader>
                Current User Profile
              </CardHeader> */}
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Owner</th>
                      <th>Max API Keys</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody id="userProfileTableData">
                    <tr>
                      <td>{this.state.accountType}</td>
                      <td>{this.state.accountOwner}</td>
                      <td>{this.state.maxApiKeys}</td>
                      <td>{getFormattedDate(this.state.createdAt)}</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>


        <Modal isOpen={this.state.primary} centered={true} toggle={this.toggleChangePasswordModal}
          className={'modal-primary ' + this.props.className} size="lg" color="primary">
          <ModalHeader toggle={this.toggleChangePasswordModal}>Change Password</ModalHeader>
          <ModalBody id="modalBodyText" style={{ margin: "20px" }} >
            <Row>
              <Col >
                <Card>
                  <CardBody>
                    AWS LOGIC COMING SOON...
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleChangePasswordModal}>Submit</Button>
            <Button color="secondary" onClick={this.toggleChangePasswordModal}>Close</Button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default Profile;
