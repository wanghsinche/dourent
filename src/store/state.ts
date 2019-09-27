import {Item} from '../lib/database';
import {IMetro} from '../lib/city';
export interface State {
    metro: IMetro[];
    city: string;
    item: Item[];
    id: string;
    timeStamp: number;
    loading: boolean;
}

export const initState: State = {
    item: [],
    metro: [],
    city: '',
    id: '',
    timeStamp: 0,
    loading: false
}