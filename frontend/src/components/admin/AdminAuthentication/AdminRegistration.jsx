import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import isLength from 'validator/lib/isLength';
import equals from 'validator/lib/equals';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AvatarPreview from '../../landing/AvatarPreview/AvatarPreview';
import styles from './styles.scss';

class AdminRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      formValues: {
        firstName: '',
        lastName: '',
        userName: '',
        password1: '',
        password2: '',
      },
      adminGroups: [],
    };
    this.sendForm = this.sendForm.bind(this);
    this.loadPreview = this.loadPreview.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.changeadminGroups = this.changeadminGroups.bind(this);
  }

  formValuesSaver(field, filledField) {
    this.setState({
      formValues: Object.assign(this.state.formValues, {
        [field]: filledField.value.toString(),
      }),
    });
  }

  formValidator() {
    const errors = [];
    // First name's length > 2
    if (!isLength(this.state.formValues.firstName, { min: 2 })) {
      errors.push('First name should be longer than 2 symbols');
    }
    // Last name's length > 2
    if (!isLength(this.state.formValues.lastName, { min: 2 })) {
      errors.push('Last name should be longer than 2 symbols');
    }
    // Username's length > 3 && < 15
    if (!isLength(this.state.formValues.userName, { min: 3, max: 15 })) {
      errors.push('Username should be from 3 to 15 symbols long');
    }
    // Matching of password field values
    if (!equals(this.state.formValues.password2, this.state.formValues.password1)) {
      errors.push('Passwords don\'t match');
    }
    // Password's length > 6
    if (!isLength(this.state.formValues.password2, { min: 6, max: 30 })) {
      errors.push('Password should be from 6 to 30 symbols long');
    }
    // Passsword containing a letter and a digit
    if (!/[a-z]/i.test(this.state.formValues.password2)
        || !/\d/.test(this.state.formValues.password2)) {
      errors.push('Password should contain both letters and digits');
    }
    if (!this.state.adminGroups.length) {
      errors.push('Select at least one admin group');
    }
    return errors;
  }

  sendForm(e) {
    e.preventDefault();
    e.persist();
    this.setState({ info: this.formValidator() }, () => {
      if (this.state.info.length) return;
      const formData = new FormData(e.target);
      formData.set('adminGroups', this.state.adminGroups.join(','));
      formData.set('avatar', this.state.image);
      fetch(`${window._injectedData.insightHost}/api/admin/registration/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }).then((response) => {
        if (response.redirected) return window.location.replace(response.url);
        return response.json();
      }).then((response) => {
        if (response) {
          this.setState({ info: [response.text] });
        }
      });
    });
  }

  loadPreview(e) {
    this.setState({ image: e.target.files[0] });
  }

  updateImage(newImage) {
    this.setState({ image: newImage });
  }

  changeadminGroups(event, index, values) {
    this.setState({ adminGroups: values });
  }
  render() {
    return (
      <div
        style={{ width: '500px', margin: '50px auto', textAlign: 'center' }}
      >
        <h2>Admin registration</h2>
        <form
          onSubmit={this.sendForm}
          encType="multipart/form-data"
        >
          <TextField
            type={'text'}
            name={'appId'}
            required
            hintText={'App ID'}
          /><br />
          <TextField
            type={'text'}
            name={'username'}
            required
            hintText={'Username'}
            onChange={e => this.formValuesSaver('userName', e.target)}
          /><br />
          <TextField
            type={'text'}
            name={'firstName'}
            required
            hintText={'First Name'}
            onChange={e => this.formValuesSaver('firstName', e.target)}
          /><br />
          <TextField
            type={'text'}
            name={'lastName'}
            required
            hintText={'Last Name'}
            onChange={e => this.formValuesSaver('lastName', e.target)}
          /><br />
          <TextField
            type={'email'}
            name={'email'}
            required
            hintText={'Email'}
          /><br />
          <TextField
            type={'password'}
            name={'firstPassword'}
            required
            hintText={'Password'}
            onChange={e => this.formValuesSaver('password1', e.target)}
          /><br />
          <TextField
            type={'password'}
            name={'secondPassword'}
            required
            hintText={'Confirm password'}
            onChange={e => this.formValuesSaver('password2', e.target)}
          /><br /><br />
          <SelectField
            multiple
            value={this.state.adminGroups}
            hintText="Select your group"
            onChange={this.changeadminGroups}
          >
            <MenuItem
              insetChildren
              checked={this.state.adminGroups.indexOf('general') > -1}
              value={'general'}
              primaryText={'General'}
            />
            <MenuItem
              insetChildren
              checked={this.state.adminGroups.indexOf('all') > -1}
              value={'all'}
              primaryText={'All'}
            />
            <MenuItem
              insetChildren
              checked={this.state.adminGroups.indexOf('technical') > -1}
              value={'technical'}
              primaryText={'Technical'}
            />
          </SelectField>
          <br /><br />
          <RaisedButton
            name={'avatar'}
            label={'Choose your avatar image'}
            containerElement={'label'}
          >
            <input
              name={'avatar'}
              type={'file'}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                opacity: 0,
                zIndex: 10,
              }}
              onChange={this.loadPreview}
            />
          </RaisedButton>
          <br /><br />
          <div className={styles['avatar-preview']}>
            <AvatarPreview image={this.state.image} update={this.updateImage} />
          </div>
          <br /><br />
          <RaisedButton
            type={'submit'}
            label={'Sign Up'}
            style={{ margin: '10px 0' }}
            primary
          />
        </form>
        {this.state.info.length ? <hr /> : ''}
        <div style={{ color: 'red' }}>
          {this.state.info.map((err) => {
            return (<span>{err}<br /></span>);
          })}
        </div>
      </div>
    );
  }
}

export default AdminRegistration;
