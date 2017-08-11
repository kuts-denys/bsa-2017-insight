import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import * as usersActions from '../../actions/usersActions';

class Register extends React.Component {
  render() {
    return (
      <div>
        <div className={styles['project-name']}>Insight</div>
        <form action="/api/user/registration" method="post">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" />
          </div>
          <div>
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    );
  }
}
// <button onClick={() => { this.props.getAllUsers(); }}>GET USERS</button>

Register.propTypes = {
  getAllUsers: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsers: () => {
      dispatch(usersActions.getAllUsers());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);