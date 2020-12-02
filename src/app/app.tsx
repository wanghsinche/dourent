import Index from '../page/index';
import {render} from 'react-dom';
import * as React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer, mySaga} from '../store/reducer';
import { ConfigProvider } from 'antd';

// ...

export function main(dom:Element){


    const sagaMid= createSagaMiddleware();
    
    const store = createStore(reducer, applyMiddleware(sagaMid));
    
    sagaMid.run(mySaga);
    render(<Provider store={store}>
          <ConfigProvider componentSize="small">
            <Index />
        </ConfigProvider>

    </Provider>, dom);
    
}
