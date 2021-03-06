import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import EmptyPlace from './EmptyPlace';
import styles from './styles.scss';

let uniqueId = 0;

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsFilterOpen: false,
      radioValue: {
        browser: 'emailValue',
        Name: 'nameValue',
        'Last seen': 'last seen Value',
      },
      initiallyOpen: {
        Email: false,
        Name: false,
        'Last seen': false,
      },
      checkedCheckboxes: {
        firstVisitDate: { status: false, alias: 'First Visit' },
        browser: { status: false, alias: 'Browser' },
        browserLanguage: { status: false, alias: 'Browser Language' },
        browserVersion: { status: false, alias: 'Browser Version' },
        city: { status: false, alias: 'City' },
        coordinates: { status: false, alias: 'Coordinates' },
        country: { status: false, alias: 'Country' },
        currentUrl: { status: false, alias: 'Current URL' },
        deviceType: { status: false, alias: 'Device Type' },
        firstname: { status: false, alias: 'First name' },
        geoLocation: { status: false, alias: 'Geolocation' },
        _id: { status: false, alias: 'ID' },
        lastname: { status: false, alias: 'Last name' },
        online: { status: false, alias: 'Online' },
        os: { status: false, alias: 'OS' },
        screenHeight: { status: false, alias: 'Screen Height' },
        screenWidth: { status: false, alias: 'Screen Width' },
        timeZone: { status: false, alias: 'Timezone' },
        userAgent: { status: false, alias: 'User Agent' },
        userId: { status: false, alias: 'User ID' },
        userIpAddress: { status: false, alias: 'IP Address' },
        username: { status: false, alias: 'User name' },
        viewedUrls: { status: false, alias: 'Viewed URLs' },
      },
    };
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.handleTap = this.handleTap.bind(this);
  }

  componentWillMount() {
    this.props.selectedFields.forEach((option) => {
      this.state.checkedCheckboxes[option].status = true;
    });
  }

  onChangeRadio(value, groupName) {
    const newRadioValue = this.state.radioValue;
    newRadioValue[groupName] = value;
    this.setState({ radioValue: newRadioValue });
  }

  handleTap(groupName) {
    const newInitiallyOpen = this.state.initiallyOpen;
    newInitiallyOpen[groupName] = (!newInitiallyOpen[groupName]);
    this.setState({ initiallyOpen: newInitiallyOpen });
  }

  handleCheck(checkBoxName) {
    const checkedFields = this.state.checkedCheckboxes;
    checkedFields[checkBoxName].status = (!checkedFields[checkBoxName].status);
    this.setState({ checkedCheckboxes: checkedFields });
  }

  handleColumnsFilter() {
    this.setState({
      columnsFilterOpen: !this.state.columnsFilterOpen,
    });
  }

  handleSaveResults() {
    const newFields = [];
    Object.keys(this.state.checkedCheckboxes).forEach((item) => {
      if (this.state.checkedCheckboxes[item].status === true) {
        newFields.push(item);
      }
    });
    this.setState({
      columnsFilterOpen: !this.state.columnsFilterOpen,
    });
    this.props.updateFields(newFields);
  }

  render() {
    const nestedItems = Object.keys(this.state.checkedCheckboxes).map((elem) => {
      return (<ListItem
        style={{ fontSize: '14px' }}
        innerDivStyle={{ padding: '16px 0 16px 38px' }}
        leftCheckbox={
          <Checkbox
            onCheck={() => this.handleCheck(elem)}
            checked={this.state.checkedCheckboxes[elem].status}
            style={{ left: '3%' }}
          />}
        primaryText={this.state.checkedCheckboxes[elem].alias}
        key={uniqueId++}
        rightIcon={<EmptyPlace />}
        initiallyOpen={this.state.initiallyOpen[elem]}
        primaryTogglesNestedList
      />);
    });
    const actions = [
      <RaisedButton
        label="Save"
        primary
        onClick={() => this.handleSaveResults()}
        style={{ marginRight: '10px' }}
      />,
      <RaisedButton
        label="Cancel"
        primary
        onClick={() => this.handleColumnsFilter()}
      />,
    ];
    return (
      <div>
        <FilterIcon
          onClick={() => this.handleColumnsFilter()}
          className={styles['columns-filter-icon']}
        />
        <Dialog
          title="Choose the columns"
          actions={actions}
          modal
          open={this.state.columnsFilterOpen}
          onRequestClose={() => this.handleColumnsFilter()}
        >
          <div className={styles['nested-items']}>
            {nestedItems}
          </div>
        </Dialog>
      </div>
    );
  }
}

Filter.propTypes = {
  selectedFields: React.PropTypes.arrayOf(React.PropTypes.string),
  updateFields: React.PropTypes.func,
};

export default Filter;
