import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import SeasonGraph from './SeasonGraph';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={SeasonGraph} />
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(null, actions)(App);
