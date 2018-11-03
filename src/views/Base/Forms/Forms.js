import React, { Component } from 'react';
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
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    return (
      <div className="animated fadeIn">
 <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> API Keys
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
                  <tbody>
                  <tr>
                    <td>itDasdfasdfIaxIPJf6EGGSasdfasdfqNd6cyS8d</td>
                    <td>abc********************</td>
                    <td>def********************</td>
                    <td>steven@netvote.io</td>
                    <td>32 days</td>
                    <td><Button size="sm" block color="primary">View</Button></td>
                    <td><Button size="sm" block color="danger">Delete</Button></td>
                  </tr>
                  <tr>
                    <td>itDasdfasdfIaxIPJf6EGGSasdfasdfqNd6cyS8d</td>
                    <td>abc********************</td>
                    <td>def********************</td>
                    <td>steven@netvote.io</td>
                    <td>32 days</td>
                    <td><Button size="sm" block color="primary">View</Button></td>
                    <td><Button size="sm" block color="danger">Delete</Button></td>
                  </tr>
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Button block color="primary">Create API Key</Button>
              </CardFooter>
            </Card>

      </div>
    );
  }
}

export default Forms;
