import React, { Component } from 'react';

import Auxel from '../../../hoc/Auxel/Auxel';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {

    // This could be a fanction, does't have to be a class
    // Должно бить функцыональним компонентом а не класомu
    componentWillUpdate () {
        console.log('[OrderSummary] WillUpdate');
    }

    render () {
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
            return (
                    <li key={igKey}>
                        <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}
                    </li>);
        });
        return (
            <Auxel>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checout?</p>
            <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
        </Auxel>
        );
    }
}

export default OrderSummary;