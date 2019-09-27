import Index from '../page/index';
import {render} from 'react-dom';
import * as React from 'react';
import 'antd/dist/antd.css';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer, mySaga} from '../store/reducer';

export async function init(){
    var dom = document.createElement('div');
    dom.id = 'dourent';
    dom.className = 'mod';
    var sibiling = document.querySelector('.aside .mod');
    sibiling.before(dom);

    const sagaMid= createSagaMiddleware();

    const store = createStore(reducer, applyMiddleware(sagaMid));
    
    sagaMid.run(mySaga);
    
    render(<Provider store={store}>
        <Index />
    </Provider>, dom);
    
}