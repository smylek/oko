import React, { Component } from 'react';
import { debounce } from '@material-ui/core';

class CartLineItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: this.props.line_item.quantity
    }
  }

  syncQuanity = () => {
    const lineItemId = this.props.line_item.id
    this.props.updateQuantityInCart(lineItemId, this.state.quantity);
  }

  debouncedSyncQuanity = debounce(this.syncQuanity, 300)

  decrementQuantity = () => {
    this.setState({ quantity: this.state.quantity - 1 }, this.debouncedSyncQuanity)
  }

  incrementQuantity = () => {
    this.setState({ quantity: this.state.quantity + 1 }, this.debouncedSyncQuanity)
  }

  render() {
    return (
      <li className="Line-item">
        <div className="Line-item__img">
          {this.props.line_item.variant.image ? <img src={this.props.line_item.variant.image.src} alt={`${this.props.line_item.title} product shot`} /> : null}
        </div>
        <div className="Line-item__content">
          <div className="Line-item__content-row">
            <div className="Line-item__variant-title">
              {this.props.line_item.variant.title}
            </div>
            <span className="Line-item__title">
              {this.props.line_item.title}
            </span>
          </div>
          <div className="Line-item__content-row">
            <div className="Line-item__quantity-container">
              <button className="Line-item__quantity-update" onClick={this.decrementQuantity}>-</button>
              <span className="Line-item__quantity">{this.state.quantity}</span>
              <button className="Line-item__quantity-update" onClick={this.incrementQuantity}>+</button>
            </div>
            <span className="Line-item__price">
              {(this.state.quantity * this.props.line_item.variant.price).toFixed(2)}
            </span>
            <button className="Line-item__remove" onClick={() => this.props.removeLineItemInCart(this.props.line_item.id)}>×</button>
          </div>
        </div>
      </li>
    );
  }
}

export default CartLineItem;