import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  delegate,
  undelegate,
  delegateUndelegate,
  resetState
} from '../../../actions/transactions';
import { getAccount, getActions } from '../../../actions/accounts';
import System from '../../../components/Wallet/Actions/System'

type Props = {
  account: {},
  transactions: {},
  onTabChange: (SyntheticEvent, object) => {},
  delegate: (string, string, string, string) => {},
  undelegate: (string, string, string, string) => {},
  delegateUndelegate: (boolean, string, string, string, string) => {},
  resetState: () => {},
  getAccount: string => {},
  getActions: string => {}
};

class SystemContainer extends Component<Props> {
  render(){
    const { 
      account, 
      transactions
    } = this.props;

    return(
      <System 
        account={account}
        transactions={transactions}
        getAccount={this.props.getAccount}
        getActions={this.props.getActions}
        delegate={this.props.delegate} 
        undelegate={this.props.undelegate} 
        delegateUndelegate={this.props.delegateUndelegate} 
        resetState={this.props.resetState}
        onTabChange={this.props.onTabChange}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.accounts.account,
    transactions: state.transactions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      delegate,
      undelegate,
      delegateUndelegate,
      resetState,
      getAccount,
      getActions
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemContainer);