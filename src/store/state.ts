export interface State {
    loading: boolean;
    qdii: any[];
    etf: any[];
    etfTarget: string;
}


export const initState: State = {
    qdii: [],
    etf: [],
    etfTarget: 'sh513100',
    loading: false,
}