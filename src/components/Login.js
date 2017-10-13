import React, { Component } from 'react';
import { Button, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      phone: '',
    }
  }
  componentDidMount() {
    // this.props.db.collection("categories").onSnapshot((querySnapshot) => {
    //     let categories = [];
    //     querySnapshot.forEach((doc) => {
    //         categories.push(doc.data());
    //         console.log(doc.data());
    //     });
    //     this.setState({ categories });
    // });
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
          <form>
            <FormGroup
              controlId="Введите телефон"
              validationState={this.getValidationState()}
            >
              <ControlLabel>Введите телефон (без +7 или 8)</ControlLabel>
              <FormControl
                type="text"
                value={this.state.phone}
                placeholder="7771234567"
                onChange={this.handleChange.bind(this)}
              />
              <FormControl.Feedback />
              {!!this.state.error && <HelpBlock>{this.state.error}</HelpBlock>}
              <Button disabled={isDisabled} bsStyle="primary" onClick={this.handleLogin.bind(this)}>Войти</Button>
            </FormGroup>
          </form>
        </Col>
      </div>
    );
  }
}

export default App;
