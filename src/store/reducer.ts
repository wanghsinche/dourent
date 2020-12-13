import {fakerpc} from '../lib/fakerpc';
import {rpc as truerpc} from '../lib/rpc';
import {logError} from '../lib/log';
import {IAction, actions} from './action';
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


const subsagas:Record<string, any> = {
    'global/init': function* init(act:IAction){
        yield call(console.log, 'start');

    },
    'global/fetchQDII': function* fetchMetro(act:IAction){
        const qdii = yield call(rpc, 'getQDII', {});
        const score = yield call(rpc, 'getQDIIScore', {});
        qdii.forEach(el=>{
            if (score[el.id]){
                el.score = score[el.id];
            }
        });
        yield put(actions.set({qdii}));
    },
};

function wrapper(work:any){
    return function*(act:IAction, ...others){
        yield put(actions.asyncStart());
        try {
            yield work(act, ...others);            
        } catch (error) {
            if (error.message==='login'){
                console.error({text: '请先登录豆瓣', type:'info'});
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



