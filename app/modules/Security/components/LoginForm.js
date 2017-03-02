// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import type { StateType } from '../../../types/redux';

type PropsType = {
  login: (email: string, password: string) => void,
  isLoading: boolean,
  isError: boolean
}

type LocalStateType = {
  email: string,
  password: string
}

class LoginForm extends Component {
  state: LocalStateType = {
    email: '',
    password: ''
  }

  state: LocalStateType
  props: PropsType

  handleLoginClick = (e: Event) => {
    e.preventDefault();

    this.props.login(this.state.email, this.state.password);
  }

  changeEmail = ({ target: { value } }: SyntheticInputEvent) => {
    this.setState({
      email: value
    });
  }

  changePassword = ({ target: { value } }: SyntheticInputEvent) => {
    this.setState({
      password: value
    });
  }

  render() {
    const { isLoading, isError } = this.props;

    return (<form className="login ui large form">
      <fieldset>
        { isError ? <Message size="small" negative={true}>Invalid email or password.</Message> : null }
        <legend className="legend">Login</legend>
        <div className="field">
          <div className="ui left icon input">
            <i className="user icon" />
            <input type="text" name="email" placeholder="E-mail address" onChange={this.changeEmail} />
          </div>
        </div>
        <div className="field">
          <div className="ui left icon input">
            <i className="lock icon" />
            <input type="password" name="password" placeholder="Password" onChange={this.changePassword} />
          </div>
        </div>
        { !isLoading ? <button type="submit" className="submit" onClick={this.handleLoginClick}>Login</button> : <br /> }
      </fieldset>
      { isLoading ? <div className="feedback">
        Logging...<br />
      </div> : null }
    </form>);
  }
}

const mapStateToProps = ({ security }: StateType, ownProps: PropsType) => {
  return {
    isLoading: security.isLoading,
    isError: security.isError
  };
};

export default connect(mapStateToProps)(LoginForm);
