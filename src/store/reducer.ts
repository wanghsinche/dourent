import * as db from '../lib/database';
import {rpc} from '../lib/rpc';
import {Analyze} from '../lib/analyze';
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
let myProccessor:Analyze;

const subsagas:Record<string, any> = {
    'global/init': function* init(act:IAction){
        yield call(console.log, 'start');
        const id = 'test';
        const timeStamp = Date.now();
        // let id = yield call(db.init);
        // if (!id) {
        //     return
        // }

        // // 出现问题的情况
        // let timeStamp = yield call(db.getMyStamp, id);
        // if (!timeStamp){
        //     id = yield call(db.init, true);
        //     if (!id) {
        //         return
        //     }
        //     timeStamp = yield call(db.getMyStamp, id);
        // }
        const oriDom = document.getElementById('dourent-ori');
        if (oriDom) {
            oriDom.style.display = 'none';
        } 
        const resDom = document.getElementById('dourent-res');
        if (resDom) {
            resDom.style.display = 'block';
        }
        const searchDom:any = document.querySelector('.group-topic-search');
        if (searchDom) {
            searchDom.style.display = 'none';
        }
        const item = [];
        // const item = yield call(db.fetchNewest, id, timeStamp);
        yield put(actions.set({id, item, timeStamp, launched:true}));
    },
    'global/fetchMetro': function* fetchMetro(act:IAction){
        const city = yield select((s:State)=>s.city);
        const metro = yield call(rpc, 'getMetro', {city});
        yield put(actions.set({metro}));
    },
    'global/process': function* process(act:IAction){
        const gpId = yield select((s:State)=>{
            return s.group;
        });
        const originRes = yield select((s:State)=>s.res);
        yield put(actions.set({more:true}));


        if (!myProccessor || !!act.payload.tags){
            yield put(actions.set({res:[]}));
            myProccessor = new Analyze(gpId, [], act.payload.tags, act.payload.price);
        }
        const res = yield call([myProccessor, myProccessor.process]);
        yield put(actions.set({res:originRes.concat(res), more: res.length>0}));
        
        yield call(console.log, res, res.length>0);
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



