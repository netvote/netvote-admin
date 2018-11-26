import React, { Component } from 'react';
import { UncontrolledTooltip, Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';


import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/cd-full-logo.png'
import sygnet from '../../assets/img/brand/cd-logo.png'

import slackIcon from '../../assets/img/third_party/Slack.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  signOut() {
    Auth.signOut()
      .then(() => window.location.reload())
      .catch(err => console.info('sign out error', err));
  }


  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          className="navbar-brand-full"
          full={{ src: logo, width: 160, height: 31, alt: 'Citizen Data Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Citizen Data Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        {/* <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem>
        </Nav> */}
        <Nav className="ml-auto" navbar>
          <div>
            <span className="ml-auto">
              <a href="https://citizendata.slack.com/messages/dev-support/" id="slacktooltip" target="_blank" rel='noopener noreferrer'> <img src={slackIcon} alt="Slack" width="30" height="30" border="0"/> </a>
            </span>
            <UncontrolledTooltip placement="right" target="slacktooltip">
              Dev Support
            </UncontrolledTooltip>
          </div>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              {/* <i className="icon-user"></i> */}
              <i className="fa fa-user-circle" style={{ color: '#20a8d8' }}></i>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              {/* <DropdownItem><i className="fa fa-user"></i> Account</DropdownItem> */}
              <DropdownItem onClick={this.signOut}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
