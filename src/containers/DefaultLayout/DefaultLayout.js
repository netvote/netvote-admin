import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Alert, Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

import { Auth } from 'aws-amplify';
import { NetVoteAdmin } from '../../lib';

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    this.accountType = this.loadData.bind(this);

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
    });

    console.log('ACCOUNT TYPE: ' + this.state.accountType);
  }

  componentDidMount = async () => {
    await this.loadData();
  }

  renderAccountWarning() {
    if (this.state.accountType === "beta") {
      return (
        <div style={{ height:47, zIndex: 999}}>
        <Alert style={{position:"fixed", width: "100%", marginBottom: 0, textAlign: "center", zIndex: 999 }} color="warning">
          This is a developer preview.  Please contact <a href="mailto:support@citizendata.network" className="alert-link">support@citizendata.network</a>. to upgrade your account.
        </Alert>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        { this.renderAccountWarning() }
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/usage" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
      </div>
    );
  }
}

export default DefaultLayout;
