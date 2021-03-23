import React, { Component } from "react";

export default class PlanPanel extends Component {
  render() {
    const { name, price, desc, list } = this.props;
    return (
      <div>
        <div>
          <h1>{name}</h1>
          <h3>{price}</h3>
          <p>{desc}</p>

          <ul>
              {list.map((l) => {
                  return(
                    <li>{l}</li>
                  );
              })}
          </ul>
          <button>Subscribe</button>
        </div>
      </div>
    );
  }
}
