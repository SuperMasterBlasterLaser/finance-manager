import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isLoggedIn: false,
      isLoggingIn: false,
    }
  }
  componentDidMount() {
  }
  clearError() {
    this.setState({ error: '' });
  }
  handleLogin(phone) {
    this.setState({ isLoggingIn: true });

    // get user by phone
    let userRef = this.props.db.collection('users').doc(phone);

    // create if not exist
    userRef.set({
      id: phone,
      phone: `+7(${phone.slice(0,3)})${phone.slice(3)}`,
    }, { merge: true })
      .then(() => {
        console.log("User craeted succesfully!");

        // add listener to user
        userRef.onSnapshot((doc) => {
          let user = doc.data();
          this.setState({
            user,
            isLoggedIn: true,
            isLoggingIn: false,
          });
          console.log('user', user);
        });

        // add listener to user transaction
        userRef.collection('transactions')
          .onSnapshot((querySnapshot) => {
            let transactions = [];
            querySnapshot.forEach((doc) => {
              transactions.push(doc.data());
            });
            this.setState({ transactions });
            console.log('transactions', transactions);
          });
      })
      .catch((error) => {
        this.setState({ isLoggingIn: false });
        console.error("Error writing document: ", error);
      })

  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <Login
          db={this.props.db}
          onLogin={this.handleLogin.bind(this)}
          isLoggingIn={this.state.isLoggingIn}
        />
      );
    }
    return (
      <div>
        <Col mdOffset={3} xsOffset={3} md={8}>
          <h1>Hello</h1>
        </Col>
      </div>
    );
  }
}

export default App;
