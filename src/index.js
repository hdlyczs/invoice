import React from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import {Provider} from 'react-redux'
import Route from './router'
import './style/base.css'

initReactFastclick(); 

// ReactDOM.render(<App />, document.getElementById('root'));

const render = Component => {
    ReactDOM.render(
            <Component/>,
        document.getElementById('root')
    )
}
render(Route)

