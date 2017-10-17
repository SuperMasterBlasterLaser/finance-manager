import React, { Component } from 'react';
import Login from './Login';
import Main from './Main';

import { classifyUrl, TAB_TABLE } from './constants';

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
      tabIndex: TAB_TABLE,
    }
    if (this.state.isLoggedIn) {
      this.handleLogin(phone)
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.addTransaction = this.addTransaction.bind(this);
  }
  componentDidMount() {
    this.props.db.collection('categories')
      .onSnapshot((snapshot) => {
        let categories = {};
        snapshot.forEach(doc => {
          categories[doc.id] = doc.data();
        })
        this.setState({ categories });
      })
  }
  logout() {
    storage.removeItem('phone');
    this.setState({ isLoggedIn: false });
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

        transactionsRef.orderBy('timestamp', 'desc')
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

  changeTab(tabIndex) {
    this.setState({ tabIndex });
  }

  addTransaction(data) {
    this.state.transactionsRef.add(data)
    .then((transaction) => {
      this.addCategory({
        id: transaction.id,
        text: data.description,
        phone: this.state.user.id,
      });
    });
  }

  addCategory(data) {
    fetch(classifyUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, *.*',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify( data )
    })
    .then((res) => {
      console.log(res);
    })
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
        tabIndex={this.state.tabIndex}
        onChangeTab={this.changeTab}
        user={this.state.user}
        categories={this.state.categories}
        transactions={this.state.transactions}
        onAddTransaction={this.addTransaction}
        onLogout={this.logout}/>
    );
  }
}

export default App;
