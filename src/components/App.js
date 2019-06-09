import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class App extends React.Component {
  signOutClick = () => {
    this.props.signOut();
  };

  signInClick = () => {
    this.props.signIn();
  };

  render() {
    return (
      <div>
        {!this.props.isSignedIn && (
          <button onClick={this.signInClick}>Sign in</button>
        )}
        {this.props.isSignedIn && (
          <button onClick={this.signOutClick}>Sign out</button>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(App);
