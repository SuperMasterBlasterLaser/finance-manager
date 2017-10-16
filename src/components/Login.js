import React, { Component } from 'react';
import { Button, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      phone: '',
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getValidationState() {
    if (this.state.error) return 'error';
    const value = this.state.phone;
    const length = value.length;
    if (length > 0 && (value[0] === '8' || value[0] === '+')) return 'error';
    if (length === 10) return 'success';
    return null;
  }

  handleChange(e) {
    this.setState({ phone: e.target.value });
  }
  handleLogin() {
    if (this.getValidationState() !== 'success') return;
    let phone = this.state.phone;
    this.props.onLogin(phone);
  }

  render() {
    var isDisabled = this.getValidationState()!=='success' || this.props.isLoggingIn;
    return (
      <div>
        <Col mdOffset={3} xsOffset={3} md={6} xs={6}>
          <FormGroup
            controlId="Введите телефон"
            validationState={this.getValidationState()}
          >
            <ControlLabel>Введите телефон</ControlLabel>
            <InputGroup>
            <InputGroup.Addon>+7</InputGroup.Addon>
              <FormControl
                type="text"
                value={this.state.phone}
                placeholder="7771234567"
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
            </InputGroup>
            <FormControl.Feedback />
            {!!this.state.error && <HelpBlock>{this.state.error}</HelpBlock>}
            <Button type="button" disabled={isDisabled} bsStyle="primary" onClick={this.handleLogin}>Войти</Button>
          </FormGroup>
        </Col>
      </div>
    );
  }
}

export default App;
