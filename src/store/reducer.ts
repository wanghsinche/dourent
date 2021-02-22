import {fakerpc} from '../lib/fakerpc';
import {rpc as truerpc} from '../lib/rpc';
import {logError} from '../lib/log';
import {IAction, actions, ActionType} from './action';
import {State, initState} from './state';
import {takeEvery, all, call, put, select} from 'redux-saga/effects';
export function reducer(state:State=initState, act:IAction):State{
    switch(act.type){
        case 'global/set':
            return {...state, ...act.payload};
        case 'global/asyncStart':
            return {...state, loading:true};
        case 'global/asyncEnd':
                return {...state, loading:false};
        default:
            return state;
    }
}

const rpc = ENV==='dev' ? fakerpc : truerpc;
const subsagas: Partial<{
    [k in ActionType]: any;
}> = {
    'global/init': function* init(act:IAction){
        yield call(console.log, 'start');

    },
    'global/fetchQDII': function* fetchQDII(act:IAction){
        const qdii = yield call(rpc, 'getQDII', {});
        const score = yield call(rpc, 'getQDIIScore', {});
        qdii.forEach(el=>{
            if (score[el.id]){
                el.score = score[el.id];
            }
        });
        yield put(actions.set({qdii}));
    },
    'global/fetchETF': function* fetchETF(act:IAction){
        const etf = yield call(rpc, 'getETF', act.payload);
        const shouldBuyIn = yield call(rpc, 'shouldBuyIn', etf);
        yield put(actions.set({etf, shouldBuyIn}));
    },
};

function wrapper(work:any){
    return function*(act:IAction, ...others){
        yield put(actions.asyncStart());
        try {
            yield work(act, ...others);            
        } catch (error) {
            yield call(logError, error);
        }
        yield put(actions.asyncEnd());
    }
}
export function* mySaga(){
    
    const effects = Object.keys(subsagas).map((actionName:any)=>takeEvery(actionName, wrapper(subsagas[actionName])));
    yield all(effects);
}



