import {Item} from '../lib/database';

export interface State {
    item: Item[];
    id: string;
    timeStamp: number;
    loading: boolean;
}

export const initState: State = {
    item: [],
    id: '',
    timeStamp: 0,
    loading: false
}