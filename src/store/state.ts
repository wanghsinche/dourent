import {Item} from '../lib/database';
import {IMetro} from '../lib/city';
import {AvaliableGp} from '../lib/constant';
import {IRecord} from '../lib/analyze';
export interface State {
    counting: number;
    isReady: boolean;
    metro: IMetro[];
    city: string;
    item: Item[];
    id: string;
    timeStamp: number;
    loading: boolean;
    group: string;
    res: IRecord[];
    launched: boolean;
    priceSort: 'desc'|'asc'|'none';
    more: boolean;
}

export const priceSorter = [
    {label: '不限', value: 'none'},
    {label: '从低到高', value: 'asc'},
    {label: '从高到低', value: 'desc'},
];

export const initState: State = {
    more: false,
    counting: 0,
    priceSort:'none',
    launched: false,
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