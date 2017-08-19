import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from './Header/Header';
import LeftSideMenu from './LeftSideMenu/LeftSideMenu';
import UserInfoTable from './Table/Table';
import Filter from './Filter/Filter';
import * as statisticActions from '../../actions/statisticActions';
import Login from './AdminAuthentication/AdminLogin';
import Registration from './AdminAuthentication/AdminRegistration';
import IncorrectRoute from '../incorrectRoute/IncorrectRoute';
import Respond from './Respond/index';
import EnsureAdmin from '../ensureAdmin/EnsureAdmin';

const muiTheme = getMuiTheme({
  tooltip: {
    rippleBackgroundColor: '#333333',
  },
});

injectTapEventPlugin();

// const statisticOptions = {
//   items: ['Name', 'Email', 'Last seen'],
//   Name: [
//     {
//       'Name 1': 'name-option1',
//     },
//     {
//       'Name 2': 'name-option2',
//     }],
//   Email: [
//     {
//       'email 1': 'email-option1',
//     },
//     {
//       'email 2': 'email-option2',
//     },
//   ],
//   'Last seen': [
//     {
//       'more than': 'days ago',
//     },
//     {
//       exactly: 'days ago',
//     },
//     {
//       'less than': 'days ago',
//     },
//   ],
// };

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.leftMenuWidth = 75;
  }

  componentWillMount() {
    this.props.getAllStatistic();
  }

  getStatisticOptions(arr) {
    let options = [];
    if (typeof (arr[0]) === 'object') {
      options = Object.keys(arr[0]);
    }
    console.log(this);
    return options;
  }


  render() {
    return (
      <EnsureAdmin>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div style={{ minWidth: '700px', fontFamily: 'Roboto, sans-serif' }}>
            <Switch>
              <Route path={'/admin/login'} component={Login} />
              <Route path={'/admin/registration'} component={Registration} />
              <Route render={() => {
                return (
                  <div>
                    <LeftSideMenu
                      width={this.leftMenuWidth}
                    />
                    <div style={{ margin: '-8px -8px 0px 0px', paddingLeft: '67px' }}>
                      <Header />
                      <Switch>
                        <Route
                          exact
                          path={'/admin'}
                          render={() => {
                            const statistics = this.props.allData;
                            const options = this.getStatisticOptions(this.props.allData);
                            return (
                              <div>
                                <Filter statisticOptions={options} />
                                <UserInfoTable options={options} statistics={statistics} />
                              </div>
                            );
                          }}
                        />
                        <Route path="/admin/respond" component={Respond} />
                        <Route
                          path={'/admin/engage'}
                          render={() => {
                            return (
                              <div>Engage component is coming soon!</div>
                            );
                          }}
                        />
                        <Route component={IncorrectRoute} />
                      </Switch>
                    </div>
                  </div>
                );
              }}
              />
            </Switch>
          </div>
        </MuiThemeProvider>
      </EnsureAdmin>
    );
  }
}

AdminPage.propTypes = {
  getAllStatistic: React.PropTypes.func,
  allData: React.PropTypes.arrayOf(React.PropTypes.object),
};


const mapStateToProps = (state) => {
  return {
    allData: state.statistics.allData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllStatistic: () => {
      return dispatch(statisticActions.getAllStatistic());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
