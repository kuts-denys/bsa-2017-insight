import React from 'react';
import propTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import { connect } from 'react-redux';
import SyncIcon from 'material-ui/svg-icons/notification/sync';
import styles from './styles.scss';
import TableItself from './TableItself';
import { addSelection } from '../../../actions/selectionActions';
import { getAllStatistics, setStatisticsFilter } from '../../../actions/statisticActions';
import StatisticsCharts from '../StatisticsCharts/StatisticsCharts';

class UserInfoTable extends React.Component {
  constructor() {
    super();
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.switchChartsOrTable = this.switchChartsOrTable.bind(this);
    this.onDatePickerButtonClick = this.onDatePickerButtonClick.bind(this);
    this.onMinDateInputChange = this.onMinDateInputChange.bind(this);
    this.onMaxDateInputChange = this.onMaxDateInputChange.bind(this);
    this.onDatePickerClearButtonClick = this.onDatePickerClearButtonClick.bind(this);
    this.onDatePickerSubmitButtonClick = this.onDatePickerSubmitButtonClick.bind(this);
    this.onDatePickerCloseButtonClick = this.onDatePickerCloseButtonClick.bind(this);

    this.state = {
      open: false,
      selDialogOpen: false,
      selDialogPending: false,
      rowsPerPage: 5,
      currentPage: 1,
      showTable: true,
      dateButtonLabel: 'Choose date range',
      isDatePickerDialogOpen: false,
      minDate: '',
      maxDate: '',
      previousMinDate: '',
      previousMaxDate: '',
    };
  }

  onDatePickerButtonClick() {
    this.setState({ isDatePickerDialogOpen: true });
  }

  onMinDateInputChange(event, date) {
    this.setState({ minDate: date });
    const maxDate = this.state.maxDate ? `*MAX*${Date.parse(this.state.maxDate)}` : '';
    this.props.setStatisticsFilter({ firstVisitDate: `firstVisitDate=*MIN*${Date.parse(date)}${maxDate}` });
  }

  onMaxDateInputChange(event, date) {
    this.setState({ maxDate: date });
    const minDate = this.state.minDate ? `*MIN*${Date.parse(this.state.minDate)}` : '';
    this.props.setStatisticsFilter({ firstVisitDate: `firstVisitDate=${minDate}*MAX*${Date.parse(date)}` });
  }

  onDatePickerClearButtonClick() {
    this.setState({
      minDate: '',
      maxDate: '',
    });
  }

  onDatePickerCloseButtonClick() {
    this.setState({
      isDatePickerDialogOpen: false,
      minDate: this.state.previousMinDate,
      maxDate: this.state.previousMaxDate,
    });
  }

  onDatePickerSubmitButtonClick() {
    let label = '';
    if (this.state.minDate === '' && this.state.maxDate === '') {
      this.props.setStatisticsFilter({ firstVisitDate: '' });
      const queryObj = this.props.activeFilters;
      if (queryObj.firstVisitDate) delete queryObj.firstVisitDate;
      let queryString = '';
      Object.keys(queryObj).forEach((property, i, arr) => {
        if (queryObj[property] !== '') {
          queryString += `${property}=${queryObj[property]}${i !== arr.length - 1 ? '&' : ''}`;
        }
      });
      this.props.getAllStatistics(queryString);
      label = 'Choose date range';
    } else if (this.state.minDate !== '' && this.state.maxDate === '') {
      label = `${(new Date(this.state.minDate)).toLocaleDateString()} - `;
    } else if (this.state.minDate === '' && this.state.maxDate !== '') {
      label = ` - ${(new Date(this.state.maxDate)).toLocaleDateString()}`;
    } else {
      const minDateLabel = `${(new Date(this.state.minDate)).toLocaleDateString()}`;
      const maxDateLabel = `${(new Date(this.state.maxDate)).toLocaleDateString()}`;
      label = `${minDateLabel} - ${maxDateLabel}`;
    }
    const queryObj = this.props.activeFilters;
    let queryString = '';
    Object.keys(queryObj).forEach((property, i, arr) => {
      if (queryObj[property] !== '') {
        queryString += `${property}=${queryObj[property]}${i !== arr.length - 1 ? '&' : ''}`;
      }
    });
    this.props.getAllStatistics(queryString);
    this.setState({
      previousMinDate: this.state.minDate,
      previousMaxDate: this.state.maxDate,
      dateButtonLabel: label,
      isDatePickerDialogOpen: false,
    });
  }

  handleChangeRowsPerPage(event, index, value) {
    this.setState({
      rowsPerPage: value,
      currentPage: 1,
    });
  }

  changeCurrentPage(event) {
    const newPageNumber = Number(event.currentTarget.value);
    const numOfRows = this.props.statistics.length;
    const numOfPages = Math.ceil(numOfRows / this.state.rowsPerPage);
    if ((newPageNumber >= 1) && (newPageNumber <= numOfPages)) {
      this.setState({
        currentPage: event.currentTarget.value,
      });
    }
  }

  toggleSelectionDialog() {
    this.setState({ selDialogOpen: !this.state.selDialogOpen });
  }

  switchChartsOrTable() {
    this.setState({ showTable: !this.state.showTable });
  }

  render() {
    const actions = [
      <FlatButton
        label="Clear"
        primary
        onClick={this.onDatePickerClearButtonClick}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={this.onDatePickerSubmitButtonClick}
      />,
      <FlatButton
        label="Close"
        primary
        onClick={this.onDatePickerCloseButtonClick}
      />,
    ];
    return (
      <div className={styles.container} style={{ width: '74vw' }}>
        <div className={styles.topPanel}>
          <div className={styles['table-buttons-wrapper']}>
            <RaisedButton
              label="Create a selection"
              onClick={() => this.toggleSelectionDialog(this.state.selDialogOpen)}
              primary
              style={{ margin: '0 5px 10px 0' }}
            />
            <Dialog
              title="Create a selection"
              modal
              open={this.state.selDialogOpen}
              contentStyle={{ textAlign: 'center', margin: '0 auto' }}
              bodyStyle={{ overflowX: 'hidden', textAlign: 'center' }}
            >
              <span>Warning: Selection will only include users with email avaible</span>
              <form
                style={{ margin: '20px 0 0' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = document.getElementById('selection-name').value;
                  this.setState({ selDialogPending: true });
                  this.props.addSelection(
                    name,
                    this.props.statistics,
                    () => {
                      this.toggleSelectionDialog(this.state.selDialogOpen);
                      this.setState({ selDialogPending: false });
                    },
                  );
                }}
              >
                <TextField
                  hintText="Name"
                  required
                  id="selection-name"
                /><br />
                <FlatButton
                  label="Cancel"
                  onClick={() => this.toggleSelectionDialog(this.state.selDialogOpen)}
                />
                <FlatButton
                  type={this.state.selDialogPending ? 'button' : 'submit'}
                  label={this.state.selDialogPending ? '' : 'Create'}
                  icon={this.state.selDialogPending ? <SyncIcon className={styles['sync-icon']} /> : ''}
                />
              </form>
            </Dialog>
            {(this.state.showTable) ?
              <RaisedButton
                label="Show charts"
                onClick={() => this.switchChartsOrTable()}
                primary
                id="switchTableChartsButton"
                style={{ margin: '0 5px 10px 0' }}
              /> :
              <RaisedButton
                label="Show table"
                onClick={() => this.switchChartsOrTable()}
                primary
                id="switchTableChartsButton"
                style={{ margin: '0 5px 10px 0' }}
              />}
            <RaisedButton
              label={this.state.dateButtonLabel}
              className={styles['table-date-button']}
              onClick={this.onDatePickerButtonClick}
              primary
            />
          </div>
          <div className={styles.rowsPerPage}>
            <p>Rows per page:</p>
            <SelectField
              value={this.state.rowsPerPage}
              onChange={this.handleChangeRowsPerPage}
              style={{ width: '80px' }}
            >
              <MenuItem value={5} primaryText="5" />
              <MenuItem value={10} primaryText="10" />
              <MenuItem value={25} primaryText="25" />
              <MenuItem value={50} primaryText="50" />
            </SelectField>
          </div>
        </div>
        <Dialog
          title="Choose date range"
          actions={actions}
          modal
          titleStyle={{ textAlign: 'center' }}
          bodyStyle={{ display: 'flex', justifyContent: 'space-around' }}
          open={this.state.isDatePickerDialogOpen}
        >
          <DatePicker
            autoOk
            hintText="from"
            value={this.state.minDate !== '' ? this.state.minDate : null}
            onChange={this.onMinDateInputChange}
          />
          <DatePicker
            autoOk
            hintText="to"
            value={this.state.maxDate !== '' ? this.state.maxDate : null}
            onChange={this.onMaxDateInputChange}
          />
        </Dialog>
        {(this.state.showTable) ?
          <TableItself
            statistics={this.props.statistics}
            options={this.props.options}
            rowsPerPage={this.state.rowsPerPage}
            currentPage={this.state.currentPage}
            changeCurrentPage={this.changeCurrentPage}
            updateFields={this.props.updateFields}
          /> :
          <StatisticsCharts
            selectedFields={this.props.options}
            statistics={this.props.statistics}
          />
        }
      </div>
    );
  }
}

UserInfoTable.propTypes = {
  options: propTypes.arrayOf(React.PropTypes.string),
  statistics: propTypes.arrayOf(React.PropTypes.object),
  updateFields: propTypes.func,
  addSelection: propTypes.func,
  getAllStatistics: propTypes.func,
  activeFilters: propTypes.shape({
    username: propTypes.string,
  }),
  setStatisticsFilter: propTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    addSelection: (name, users, cb) => {
      const filteredUsersIds = users.filter(user => user.userId && user.userId.email);
      const body = JSON.stringify({ name, users: filteredUsersIds, appId: window._injectedData.appId });
      return dispatch(addSelection(body, cb));
    },
    getAllStatistics: (query) => {
      return dispatch(getAllStatistics(query));
    },
    setStatisticsFilter: (obj) => {
      return dispatch(setStatisticsFilter(obj));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    activeFilters: state.statistics.activeStatisticsFilters,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoTable);
