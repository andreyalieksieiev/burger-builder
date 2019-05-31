import React, { Component } from 'react';
//import PropTypes from 'prop-types';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

class App extends Component {
  // state = {
  //   show: true
  // };

  // componentDidMount() {   //проверка работает ли удаление перехватчиков
  //   setTimeout(() => {
  //     this.setState({show: false})
  //   }, 5000)
  // }

  render() {
    return (
      <div>
        <Layout>
      {/* //{this.state.show ? <BurgerBuilder /> : null}; */}
          <BurgerBuilder />
        </Layout>
      </div>
    );
  }
}

export default App;
