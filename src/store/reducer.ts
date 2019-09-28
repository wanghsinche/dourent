import * as db from '../lib/database';
import {rpc} from '../lib/rpc';
import {logError} from '../lib/log';
import {IAction, actions} from './action';
import {State, initState} from './state';
import Swal from 'sweetalert2';
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

const subsagas:Record<string, any> = {
    'global/init': function* init(act:IAction){
        yield call(console.log, 'start');
        let id = yield call(db.init);
        if (!id) {
            return
        }

        // 出现问题的情况
        let timeStamp = yield call(db.getMyStamp, id);
        if (!timeStamp){
            id = yield call(db.init, true);
            if (!id) {
                return
            }
            timeStamp = yield call(db.getMyStamp, id);
        }

        const item = yield call(db.fetchNewest, id, timeStamp);
        yield put(actions.set({id, item, timeStamp}));
    },
    'global/fetchMetro': function* fetchMetro(act:IAction){
        const city = yield select((s:State)=>s.city);
        const metro = yield call(rpc, 'getMetro', {city});
        yield put(actions.set({metro}));
    }
};

function wrapper(work:any){
    return function*(act:IAction, ...others){
        yield put(actions.asyncStart());
        try {
            yield work(act, ...others);            
        } catch (error) {
            if (error.message==='login'){
                Swal.fire({text: '请先登录豆瓣', type:'info'});
            }else{
                yield call(logError, error);
            }
        }
        yield put(actions.asyncEnd());
    }
}
export function* mySaga(){
    
    const effects = Object.keys(subsagas).map((actionName:any)=>takeEvery(actionName, wrapper(subsagas[actionName])));
    yield all(effects);
}



