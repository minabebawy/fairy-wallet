// @flow
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { transfer, resetState } from '../../../actions/transactions';
import { getAccount, getActions } from '../../../actions/accounts';
import TransactionsModal from '../../../components/Shared/TransactionsModal';
import { numberToAsset, assetToNumber } from '../../../utils/asset';
import {
  InputAccount,
  InputFloat
} from '../../../components/Shared/EosComponents';
import MainContentContainer from './../../../components/Shared/UI/MainContent';

type Props = {
  settings: {},
  accounts: {},
  transactions: {},
  transfer: (string, string, string, string) => {},
  resetState: () => {},
  getAccount: string => {},
  getActions: string => {}
};

const eosToken = 'EOS';

class SendContainer extends Component<Props> {
  state = {
    token: eosToken,
    recipient: '',
    amount: '',
    memo: '',
    resetValue: false,
    openModal: false
  };

  handleClose = () => {
    const { accounts } = this.props;
    this.props.resetState();
    this.setState({ openModal: false });
    this.props.getAccount(accounts.account.account_name);
    this.props.getActions(accounts.account.account_name);
  };
  handleChange = (e, { name, value }) => {
    const obj = {
      [name]: value,
      resetValue: false,
      typeError: false,
      inRange: true
    };
    if (name === 'token') {
      const [contract, symbol] = value.split('-');
      Object.assign(obj, {
        contract,
        [name]: symbol,
        resetValue: this.state.token !== symbol
      });
    }
    this.setState(obj);
  };
  handleTypeError = () => {};
  handleSubmit = () => {
    const { contract, token, recipient, amount, memo } = this.state;
    const { accounts } = this.props;
    const accountName = accounts.account.account_name;
    const asset = numberToAsset(amount, token.toUpperCase());

    this.props.transfer(accountName, recipient, asset, memo, contract);
    this.setState({ openModal: true });
  };

  render() {
    const { accounts, settings, transactions } = this.props;
    const { token, recipient, memo, resetValue, openModal } = this.state;

    const { balances, account } = accounts;
    const { amount } = resetValue ? { amount: '' } : this.state;
    const tokens = _.map(settings.tokens[account.account_name], elem => ({
      text: elem.symbol,
      value: `${elem.contract}-${elem.symbol}`,
      key: `${elem.contract}-${elem.symbol}`
    }));

    if (!tokens.find(element => element.key === eosToken)) {
      tokens.splice(0, 0, {
        text: eosToken,
        value: `eosio.token-${eosToken}`,
        key: `eosio.token-${eosToken}`
      });
    }

    let maxAmount = assetToNumber(account.core_liquid_balance);
    if (token !== eosToken) {
      const t = balances.find(el => el.symbol === token);
      maxAmount = t ? parseFloat(t.amount) : 0;
    }

    const invalidAmount =
      parseFloat(amount) > maxAmount ? 'invalid' : undefined;

    const enableRequest =
      token !== '' && recipient !== '' && amount !== '' && !invalidAmount;

    return (
      <MainContentContainer
        title="Transfer funds"
        subtitle="Send your EOS and Airdrop tokens here"
        className="adjust-content"
        content={
          <Form onSubmit={this.handleSubmit} className="side-padding">
            <TransactionsModal
              open={openModal}
              transactions={transactions}
              handleClose={this.handleClose}
            />
            <InputAccount
              id="form-input-control-recipient"
              label="Recipient"
              name="recipient"
              value={recipient}
              onChange={this.handleChange}
            />
            <Form.Group widths="equal">
              <InputFloat
                id="form-textarea-control-amount"
                label={invalidAmount ? 'Invalid Amount' : 'Amount'}
                placeholder="0.0000"
                min={0}
                max={Number.MAX_VALUE}
                name="amount"
                value={amount}
                className={invalidAmount}
                onChange={this.handleChange}
              >
                <Form.Dropdown
                  button
                  basic
                  floating
                  options={tokens}
                  defaultValue="EOS"
                  name="token"
                  text={token}
                  onChange={this.handleChange}
                  className="tokendropdown"
                  style={{ paddingTop: '1em', paddingBottom: '1em' }}
                />
                <input />
              </InputFloat>
            </Form.Group>
            <Form.Input
              id="form-button-control-public"
              content="Memo"
              label="Memo"
              name="memo"
              value={memo}
              onChange={this.handleChange}
              maxLength={80}
              placeholder="80 symbols long..."
            />
            <Form.Button
              id="form-button-control-public"
              content="Transfer"
              disabled={!enableRequest}
            />
          </Form>
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    settings: state.settings,
    transactions: state.transactions
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { transfer, resetState, getAccount, getActions },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SendContainer);
