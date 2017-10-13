import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div>
		<Col mdOffset={3} xs={12} md={8}>
        <h1>Hello</h1>
        <Button bsStyle="primary">Primary</Button>
        </Col>
      </div>
    );
  }
}

export default App;
