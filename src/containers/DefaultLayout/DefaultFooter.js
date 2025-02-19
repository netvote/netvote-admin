import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>&copy; 2018 Citizen Data Corp.</span>
        <span className="ml-auto"><a href="https://citizendata.network/terms-of-service"  target="_blank" rel='noopener noreferrer'>Terms of Service</a></span>
        <span className="ml-auto">Powered by <a href="https://citizendata.network"  target="_blank" rel='noopener noreferrer'>Citizen Data Network</a></span>

      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
