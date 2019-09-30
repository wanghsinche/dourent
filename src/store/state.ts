import {Item} from '../lib/database';
import {IMetro} from '../lib/city';
import {AvaliableGp} from '../lib/constant';
export interface State {
    isReady: boolean;
    metro: IMetro[];
    city: string;
    item: Item[];
    id: string;
    timeStamp: number;
    loading: boolean;
    group: string;
}

export const initState: State = {
    item: [],
    isReady: AvaliableGp.some(el=>location.pathname.includes(el)),
    group: '',
    metro: [],
    city: '',
    id: '',
    timeStamp: 0,
    loading: false
}