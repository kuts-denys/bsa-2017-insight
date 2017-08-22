import React from 'react';
import propTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import RadioChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import styles from './styles.scss';

class CustomInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 'desktop',
    };
    this.renderNestedTextInput = this.renderNestedTextInput.bind(this);
  }

  renderNestedTextInput(displayChildren, key) {
    if (displayChildren) {
      return ([<TextField
        key={`${key}-1`}
        className={styles['radio-input']}
        hintText="Search value"
        ref={(node) => {
          this.input = node;
        }}
        onChange={() => {
          if (this.props.onInputChange) this.props.onInputChange(key, this.input.input.value);
        }}
      />]);
    }
    return [];
  }

  render() {
    if (this.props.type === 'multiple') {
      return (<ListItem
        primaryText={this.props.text}
        initiallyOpen={false}
        primaryTogglesNestedList
        onNestedListToggle={(listItem) => {
          if (listItem.props.leftCheckbox.props.checked && this.props.onUnmount) {
            this.props.onUnmount(this.props.matching);
          }
        }}
        rightIcon={<div />}
        onClick={() => this.props.onCustomInputClick && this.props.onCustomInputClick(this.props.matching)}
        leftCheckbox={
          <Checkbox checked={this.props.displayChildren} />
        }
        nestedItems={this.props.displayChildren && this.props.childs.map((child) => {
          return (<ListItem
            primaryText={child.text}
            key={child.matching}
            initiallyOpen={false}
            primaryTogglesNestedList
            rightIcon={<div />}
            onClick={() => this.props.onCustomInputClick && this.props.onCustomInputClick(child.matching)}
            leftCheckbox={
              <Checkbox
                checkedIcon={<RadioChecked />}
                uncheckedIcon={<RadioUnchecked />}
                checked={child.displayChildren}
              />}
            nestedItems={this.renderNestedTextInput(child.displayChildren, child.matching)}
          />);
        })}
      />);
    } else if (this.props.type === 'single') {
      return (
        <ListItem
          primaryText={this.props.text}
          initiallyOpen={false}
          primaryTogglesNestedList
          rightIcon={<div />}
          onClick={() => this.props.onCustomInputClick && this.props.onCustomInputClick(this.props.matching)}
          onNestedListToggle={(listItem) => {
            if (listItem.props.leftCheckbox.props.checked && this.props.onUnmount) {
              this.props.onUnmount(this.props.matching);
            }
          }}
          leftCheckbox={
            <Checkbox checked={this.props.displayChildren} />
          }
          nestedItems={this.props.displayChildren && [
            <TextField
              key={this.props.matching}
              className={styles['checkbox-input']}
              hintText="Search value"
              ref={(node) => {
                this.input = node;
              }}
              onChange={() => {
                if (this.props.onInputChange) this.props.onInputChange(this.props.matching, this.input.input.value);
              }}
            />]}
        />
      );
    } else if (this.props.type === 'select') {
      return (
        <ListItem
          primaryText={this.props.text}
          initiallyOpen={false}
          primaryTogglesNestedList
          rightIcon={<div />}
          onClick={() => this.props.onCustomInputClick && this.props.onCustomInputClick(this.props.matching)}
          onNestedListToggle={(listItem) => {
            if (listItem.props.leftCheckbox.props.checked && this.props.onUnmount) {
              this.props.onUnmount(this.props.matching);
            }
          }}
          leftCheckbox={
            <Checkbox checked={this.props.displayChildren} />
          }
          nestedItems={this.props.displayChildren && [
            <SelectField
              className={styles.select}
              key={this.props.matching}
              value={this.state.select}
              ref={(node) => {
                this.input = node;
              }}
              onChange={(event, index, value) => {
                this.setState({ select: value });
                if (this.props.onInputChange) this.props.onInputChange(this.props.matching, value);
              }}
            >
              {this.props.options.map((option) => {
                return <MenuItem value={option} key={option} primaryText={option} />;
              })}
            </SelectField>]}
        />
      );
    }
  }
}

CustomInput.propTypes = {
  onUnmount: propTypes.func,
  matching: propTypes.string,
  onInputChange: propTypes.func,
  onCustomInputClick: propTypes.func,
  text: propTypes.string,
  name: propTypes.string,
  type: propTypes.string,
  class: propTypes.string,
  children: propTypes.oneOfType([
    propTypes.arrayOf(React.PropTypes.node),
    propTypes.node,
  ]),
};

export default CustomInput;
