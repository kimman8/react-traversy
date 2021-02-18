import "./App.css";
import React, { Component, Fragment } from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Users from "./components/users/Users";
import User from "./components/users/User";
import axios from "axios";
import About from "./components/pages/About";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
  };
  async componentDidMount() {
    console.log(process.env.REACT_APP_GITHUB_CLIENT_SECRET);
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users?client_id=$
      {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
      {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    console.log(res.data);
    this.setState({ users: res.data, loading: false });
  }
  //search users
  searchUsers = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=$
      {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
      {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    this.setState({ users: res.data.items, loading: false });
  };

  //get single github user
  getUser = async (username) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=$
      {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
      {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    this.setState({ user: res.data, loading: false });
  };

  //clear users from state
  clearUsers = () => {
    this.setState({ users: [], loading: false });
  };
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  // showClear = () => {
  //   this.setState()
  // }
  render() {
    const { users, user, loading } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    user={user}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
