import {Item} from '../lib/database';
import {IMetro} from '../lib/city';
export interface State {
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
    group: '',
    metro: [],
    city: '',
    id: '',
    timeStamp: 0,
    loading: false
}