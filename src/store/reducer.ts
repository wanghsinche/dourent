import * as db from '../lib/database';
import {IAction, actions} from './action';
import {State, initState} from './state';
import {takeEvery, all, call, put} from 'redux-saga/effects';
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

const subsagas:Record<string, any> = {
    'global/init': function* init(act:IAction){
        yield call(console.log, 'start');
        const id = yield call(db.init);
        if (!id) {
            return
        }

        const timeStamp = yield call(db.getMyStamp, id);
        const item = yield call(db.fetchNewest, id, timeStamp);
        yield put(actions.set({id, item, timeStamp}));
    }
};

export function* mySaga(){
    const effects = Object.keys(subsagas).map((actionName:any)=>takeEvery(actionName, subsagas[actionName]));
    yield all(effects);
}



