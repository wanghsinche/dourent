import {State} from './state';

export type ActionType = 
'global/set'
|'global/init'
|'global/fetchData'
|'global/fetchMetro'
|'global/asyncEnd'
|'global/asyncStart';

export interface IAction {
    type: ActionType;
    payload: any;
}

function createAction(type:ActionType, payload?: any){
    return {
        type,
        payload
    } as IAction
}

export const actions = {
    asyncStart: ()=>createAction('global/asyncStart'),
    asyncEnd: ()=>createAction('global/asyncEnd'),
    set: (s:Partial<State>)=>createAction('global/set', s),
    init: ()=>createAction('global/init'),
    fetchData: ()=>createAction('global/fetchData'),
    fetchMetro: ()=>createAction('global/fetchMetro'),
}

export type IActionFunc = typeof actions;