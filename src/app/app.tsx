import Index from '../page/index';
import Result from '../page/result';
import {render} from 'react-dom';
import * as React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer, mySaga} from '../store/reducer';

export function main(){
    const dom = document.createElement('div');
    dom.id = 'dourent';
    dom.className = 'group-board';
    dom.style.marginTop = "2em";
    const sibiling = document.querySelector('.article .group-board');
    sibiling.after(dom);
    
    const sagaMid= createSagaMiddleware();
    
    const store = createStore(reducer, applyMiddleware(sagaMid));
    
    sagaMid.run(mySaga);
    
    render(<Provider store={store}>
        <Index />
    </Provider>, dom);
    
    render(<Provider store={store}>
        <Result />
    </Provider>, document.querySelector('#group-topics > div:nth-child(2)'))
}
