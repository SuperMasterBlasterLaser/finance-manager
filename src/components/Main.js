import React, { Component } from 'react';
import { Button, Col, Table, Modal, Nav, Navbar, NavItem, Tab, Tabs,
  FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/ru';
import ReactHighstock from 'react-highcharts/ReactHighstock';

import { TAB_TABLE, TAB_GRAPH, FILTER_TITLES } from './constants';

const formatStr = 'DD MMM YYYY, HH:mm';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenIncome: false,
      isOutcome: false,
      value: '',
      description: '',
    }
    this.closeIncome = this.closeIncome.bind(this);
    this.openIncome = this.openIncome.bind(this);
    this.onAddIncome = this.onAddIncome.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleDesc = this.handleDesc.bind(this);
    this.getIncome = this.getIncome.bind(this);
    this.getOutcome = this.getOutcome.bind(this);
    this.getSummary = this.getSummary.bind(this);
  }
  getIncome() {
    return this.props.transactions.map(t => Math.max(0, t.value)).reduce((a, b) => (a + b), 0);
  }
  getOutcome() {
    return this.props.transactions.map(t => Math.min(0, t.value)).reduce((a, b) => (a + b), 0);
  }
  getSummary() {
    return this.props.transactions.map(t => t.value).reduce((a, b) => (a + b), 0);
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
  renderTransaction(t, index) {
    let categoryName = '';
    if (this.props.categories[t.category.id])
      categoryName = this.props.categories[t.category.id].name;
    return (
      <tr className="transaction" key={index}>
        <td>{index+1}</td>
        <td>{this.dateByTimestamp(t.timestamp)}</td>
        <td className={t.value>0?"income":"outcome"}>{t.value}</td>
        <td>{t.description}</td>
        <td>{categoryName}</td>
      </tr>
    );
  }
  renderTable() {
    return (
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
          {this.props.transactions.map((t,index) => this.renderTransaction(t, index))}
        </tbody>
      </Table>);
  }
  render() {
    let transactions = this.props.transactions.map(t => [t.timestamp, t.value]).reverse();
    for (var i = 1; i < transactions.length; i++) {
      transactions[i][1] += transactions[i-1][1];
    }
    let graphConfig = {
      rangeSelector: {
        selected: 1
      },
      title: {
        text: 'Баланс'
      },
      series: [{
        name: 'баланс',
        data: transactions,
        tooltip: {
          valueDecimals: 2
        }
      }]
    };
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
        <Col bsClass="row" className="main-actions">
          <Col mdOffset={2} xsOffset={2} md={4} xs={4}>
            <div className="main-title"> {this.props.user.phone} </div>
            <Button className="main-action" bsStyle="success" onClick={() => this.openIncome(false)}>Приход</Button>
            <Button className="main-action" bsStyle="danger" onClick={() => this.openIncome(true)}>Расход</Button>
          </Col>
          <Col md={4} xs={4} className="main-summary">
            <Table>
              <tbody>
                <tr key={0}><td key="t">Поступлния</td><td key="v">{this.getIncome()}</td></tr>
                <tr key={1}><td key="t">Расходы</td><td key="v">{this.getOutcome()}</td></tr>
                <tr key={2}><td key="t">Итог</td><td key="v">{this.getSummary()}</td></tr>
              </tbody>
            </Table>
          </Col>
        </Col>
        <Col bsClass="row">
          <Col mdOffset={2} xsOffset={2} md={8} xs={8}>
            <Tabs defaultActiveKey={0} onSelect={this.props.onChangeFilter} id="tabs-filters">
              {[0,1,2].map((index) => (
                <Tab key={index} eventKey={index} title={FILTER_TITLES[index]}>
                  <Tabs defaultActiveKey={this.props.tabIndex} onSelect={this.props.onChangeTab} id="tabs">
                    <Tab eventKey={TAB_TABLE} title="История">
                      {this.renderTable()}
                    </Tab>
                    <Tab eventKey={TAB_GRAPH} title="График">
                      <ReactHighstock config={graphConfig} domProps={{id: 'chartId'}}></ReactHighstock>
                    </Tab>
                  </Tabs>
                </Tab>))}
            </Tabs>
          </Col>
        </Col>
        <Modal show={this.state.isOpenIncome} onHide={this.closeIncome}>
          <Modal.Header closeButton>
            <Modal.Title>{!this.state.isOutcome ? "Добавить поступление" : "Добавить расход"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup
              validationState={null}>
              <ControlLabel>{!this.state.isOutcome ? "Приход" : "Расход"} </ControlLabel>
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