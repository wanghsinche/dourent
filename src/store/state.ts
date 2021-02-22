export interface State {
    loading: boolean;
    qdii: any[];
    etf: any[];
    shouldBuyIn: any[];
    etfTarget: string;
}


export const initState: State = {
    qdii: [],
    etf: [],
    shouldBuyIn: [],
    etfTarget: 'sh513100',
    loading: false,
}