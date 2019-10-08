import {Item} from '../lib/database';
import {IMetro} from '../lib/city';
import {AvaliableGp} from '../lib/constant';
import {IRecord} from '../lib/analyze';
export interface State {
    isReady: boolean;
    metro: IMetro[];
    city: string;
    item: Item[];
    id: string;
    timeStamp: number;
    loading: boolean;
    group: string;
    res: IRecord[];
}

export const initState: State = {
    item: [],
    res: [],
    isReady: AvaliableGp.some(el=>location.pathname.includes(el)),
    group: '',
    metro: [],
    city: '',
    id: '',
    timeStamp: 0,
    loading: false
}