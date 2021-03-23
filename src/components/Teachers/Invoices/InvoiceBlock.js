import React, { Component } from "react";

export default class InvoiceBlock extends Component {
  render() {
    const { no, status, name, balance, created, due } = this.props;
    return (
      <div>
        <h4>#{no}</h4>
        <p>{status}</p>
        <p>{name}</p>
        <p>{balance === 'PAID' ? '' : '$'}{balance}</p>
        <p>{created.toDate().toString().substr(4, 11)}</p>
        <p>{due.toDate().toString().substr(4, 11)}</p>
      </div>
    );
  }
}
