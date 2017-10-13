import React, { Component } from 'react';
import { Button, Col, Table } from 'react-bootstrap';
import moment from 'moment';
import 'moment/locale/ru';

const formatStr = 'DD MMM YYYY, HH:mm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      phone: '',
    }
  }
  dateByTimestamp(t) {
    return moment(t).format(formatStr);
  }
  render() {
    return (
      <div>
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
                  <td>{t.category.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </div>
    );
  }
}

export default App;
