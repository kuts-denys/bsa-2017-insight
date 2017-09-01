import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { deleteSelection, getAllSelections } from '../../../../../actions/selectionActions';
// import Table from '../../../Table/TableItself';

class Selection extends React.Component {
  constructor() {
    super();
    this.state = {
      chosenSelection: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chosenSelection !== this.state.chosenSelection) {
      this.setState({ chosenSelection: nextProps.chosenSelection });
    }
  }

  render() {
    return (
      <div style={{
        height: `calc(100vh - ${this.props.headerHeight + 61}px)`,
        overflowY: 'scroll',
        flexGrow: '1',
        padding: '20px',
      }}
      >
        { this.state.chosenSelection ?
          <Card
            containerStyle={{
              backgroundColor: this.props.chosenTheme.palette.borderColor,
              padding: 10,
            }}
          >
            <CardHeader
              title={this.props.chosenSelection.name}
              subtitle={`${this.props.chosenSelection.users.length} users, ${this.props.chosenSelection.mailings.length} mailings`}
            />
            <CardText>
              {this.props.chosenSelection.description}
            </CardText>
            <CardText>
              {this.props.chosenSelection.mailings}
            </CardText>
            <CardText expandable>
              {/* <Table
                options={this.props.fieldsToDisplay}
                statistics={statistics}
              />  */}
            </CardText>
            <CardActions>
              <RaisedButton
                label="User list"
                onClick={() => alert('Click')}
              />
              <RaisedButton
                label="Apply mailing"
                onClick={() => alert('Click')}
              />
              <RaisedButton
                label="Delete selection"
                onClick={() => {
                  this.props.deleteSelection(this.props.chosenSelection._id);
                  this.setState({ chosenSelection: null });
                  this.props.getSelectionList();
                }}
              />
            </CardActions>
          </Card> :
          'Choose a selection first' }
      </div>
    );
  }
}

Selection.propTypes = {
  headerHeight: PropTypes.number,
  chosenSelection: PropTypes.shape({
    users: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    description: PropTypes.description,
    mailings: PropTypes.arrayOf(PropTypes.object),
    _id: PropTypes.string,
  }),
  getSelectionList: PropTypes.func,
  deleteSelection: PropTypes.func,
  chosenTheme: PropTypes.shape({
    palette: PropTypes.shape({
      borderColor: PropTypes.string,
    }),
  }),
};

const mapStateToProps = (state) => {
  return {
    chosenSelection: state.selection.chosenSelection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSelection: (id) => {
      return dispatch(deleteSelection(id));
    },
    getSelectionList: () => {
      return dispatch(getAllSelections());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Selection);