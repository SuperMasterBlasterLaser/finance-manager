import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';

const storage = window.localStorage;

class App extends Component {
  constructor(props) {
    super(props);

    let phone = storage.getItem('phone');
    this.state = {
      error: '',
      isLoggedIn: !!phone,
      isLoggingIn: false,
      user: {},
      transactions: [],
    }
    if (this.state.isLoggedIn) {
      this.handleLogin(phone)
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
  }

  logout() {
    storage.removeItem('phone');
    this.setState({ isLoggedIn: false });
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

    this.setState({ userRef });
    // create if not exist
    userRef.set({
      id: phone,
      phone: `+7(${phone.slice(0,3)})${phone.slice(3)}`,
    }, { merge: true })
      .then(() => {
        console.log("Got or craeted user succesfully!");
        storage.setItem('phone', phone);

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
        let transactionsRef = userRef.collection('transactions');
        this.setState({ transactionsRef });

        transactionsRef
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
  addTransaction(data) {
    this.state.transactionsRef.add(data);
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <Login
          db={this.props.db}
          onLogin={this.handleLogin}
          isLoggingIn={this.state.isLoggingIn}
        />
      );
    }
    return (
      <Main
        user={this.state.user}
        transactions={this.state.transactions}
        onAddTransaction={this.addTransaction}
        onLogout={this.logout}/>
    );
  }
}

export default App;
