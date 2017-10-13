import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isLoggedIn: false,
      isLoggingIn: false,
      user: {},
      transactions: [],
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
      <Main
        user={this.state.user}
        transactions={this.state.transactions}/>
    );
  }
}

export default App;
