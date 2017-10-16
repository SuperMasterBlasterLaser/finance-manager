import React, { Component } from 'react';
import { Button, Col, Table, Modal, Nav, Navbar, NavItem,
  FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/ru';

const formatStr = 'DD MMM YYYY, HH:mm';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenIncome: false,
      value: '',
      description: '',
    }
    this.closeIncome = this.closeIncome.bind(this);
    this.openIncome = this.openIncome.bind(this);
    this.onAddIncome = this.onAddIncome.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleDesc = this.handleDesc.bind(this);

  }
  onAddIncome() {
    let value = parseInt(this.state.value, 10);
    if (this.state.isOutcome && value > 0)
      value = -value;

    this.props.onAddTransaction({
      timestamp: moment.now(),
      value: value,
      description: this.state.description,
      category: '',
    });
    this.setState({
      isOpenIncome: false,
      value: '',
      description: '',
    });
  }
  openIncome(isOutcome) {
    this.setState({ isOpenIncome: true, isOutcome: !!isOutcome });
  }
  closeIncome() {
    this.setState({ isOpenIncome: false });
  }
  dateByTimestamp(t) {
    return moment(t).format(formatStr);
  }
  handleValue(e) {
    this.setState({ value: e.target.value });
  }
  handleDesc(e) { 
    this.setState({ description: e.target.value });
  }
  render() {
    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              Finance-manager
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem onClick={this.props.onLogout}>
              Выйти
            </NavItem>
          </Nav>
        </Navbar>
        <Col bsClass="row">
          <Col mdOffset={2} xsOffset={2} md={8} xs={8}>
            <div className="main-title"> {this.props.user.phone} </div>
          </Col>
        </Col>
        <Col bsClass="row" className="main-actions">
          <Col mdOffset={2} xsOffset={2} md={8} xs={8}>
            <Button className="main-action" bsStyle="success" onClick={this.openIncome}>Поступление</Button>
            <Button className="main-action" bsStyle="danger" onClick={() => this.openIncome(true)}>Расход</Button>
          </Col>
        </Col>
        <Col bsClass="row">
          <Col mdOffset={2} xsOffset={2} md={8} xs={8}>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Описание</th>
                  <th>Категория</th>
                </tr>
              </thead>
              <tbody>
                {this.props.transactions.map((t,index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{this.dateByTimestamp(t.timestamp)}</td>
                    <td>{t.value}</td>
                    <td>{t.description}</td>
                    <td>{t.category ? t.category.name : ''}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Col>
        <Modal show={this.state.isOpenIncome} onHide={this.closeIncome}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.isOutcome ? "Добавить поступление" : "Добавить расход"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup
              validationState={null}>
              <ControlLabel>{this.state.isOutcome ? "Поступление" : "Расход"} </ControlLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  value={this.state.value}
                  placeholder="Введите сумму"
                  onChange={this.handleValue}
                />
                <InputGroup.Addon>тг</InputGroup.Addon>
              </InputGroup>
              <FormControl.Feedback />
              {!!this.state.error && <HelpBlock>{this.state.error}</HelpBlock>}
            </FormGroup>
            <FormGroup
              validationState={null}>
              <FormControl
                type="text"
                value={this.state.description}
                placeholder="Добавить описание"
                onChange={this.handleDesc}
              />
              {/*!!this.state.error && <HelpBlock>{this.state.error}</HelpBlock>*/}
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeIncome}>Закрыть</Button>
            <Button bsStyle="primary" onClick={this.onAddIncome}>Добавить</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Main;