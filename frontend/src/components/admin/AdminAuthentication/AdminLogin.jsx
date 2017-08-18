import React from 'react';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { info: '' };
    this.login = this.login.bind(this);
    this.setInput = this.setInput.bind(this);
  }

  setInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login(e) {
    e.preventDefault();

    const loginData = {
      username: this.state.username,
      password: this.state.password
    };

    if (!loginData.username || !loginData.password) {
      this.setState({
        info: 'Enter your username/password'
      });
      return;
    }

    fetch('/api/admin/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(loginData),
      redirect: 'follow',
      credentials: 'include'
    }).then(response => response.json()).then((response) => {
      this.setState({ info: response.text });
    });
  }

  render() {
    return (
      <div
        style={{ width: '500px', margin: '50px auto', textAlign: 'center' }}
      >
        <h2>Admin login</h2>
        <TextField
          type="text"
          name="username"
          hintText={'Username'}
          onChange={this.setInput}
        />
        <br />
        <TextField
          type="password"
          name="password"
          hintText={'Password'}
          onChange={this.setInput}
        />
        <br /><br />
        <RaisedButton
          primary
          onClick={this.login}
        >Login</RaisedButton>
        <br /><br />
        {this.state.info}
        <div style={{ margin: '10px 0', lineHeight: '1.6em' }}>
          <NavLink to={'/admin/registration'}>Registration</NavLink><br />
          <NavLink to={'/forgot/admin'}>Restore my password</NavLink><br />
        </div>
      </div>
    );
  }
}

export default AdminLogin;