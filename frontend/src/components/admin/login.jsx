import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import * as usersActions from '../../actions/usersActions';

class Login extends React.Component {
  render() {
    return (
      <div>
        <div className={styles['project-name']}>Insight</div>
        <form action="/api/admin/login/" method="post">
          <div>
<<<<<<< HEAD
            <label htmlFor="username">Username:</label>
=======
            <label htmlFor="username">username:</label>
>>>>>>> b84ef96ad2222e0569da8bc56278d3d3353e622d
            <input type="text" name="username" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" />
          </div>
          <div>
            <input type="submit" value="Log In" />
          </div>
        </form>
      </div>
    );
  }
}
// <button onClick={() => { this.props.getAllUsers(); }}>GET USERS</button>

Login.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);