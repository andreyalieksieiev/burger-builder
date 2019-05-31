import React, { Component } from 'react';

import Auxel from '../../hoc/Auxel/Auxel';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICE = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {  //строитель гамбургера
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false, // покупка
        loading: false,
        error: false
    }
   
    componentDidMount () { // загрузка ингредиентов с сервера

        axios.get('https://react-my-bigburger.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true})
            });
           
    }
  
    updatePurchaseState (ingredients) {   //кнопка ORDEN NOW Пподключается   
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHendler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( {totalPrice: newPrice, ingredients: updatedIngredients} )
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {   ///метод покупки
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {  // закрить фон чтоби отменить покупку
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => { // обрабативаем продолжения покупки
        //alert('You continue!');
        this.setState( { loading: true } );
        const order = {  // второй аргумент для ОТПРАВКИ заказа на сервер
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max Schwarzmuller',
                adress: {
                    street: 'Teststreet 1',
                    zipCode: '654354',
                    country: 'Germany'
                },
                emale: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)// отправляем заказ бургера на сервер
            .then( response => {                                   
                this.setState({ loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false});
            });
    }
   



    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Auxel>
                    <Burger ingredients={this.state.ingredients}/>                    
                    <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHendler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
                </Auxel>
            );
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;   
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        
        // {salad: true, meat: false, bacon: false, cheese: false}
        return (
            <Auxel>
                <Modal 
                   
                    show={this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxel>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);