export interface State {
    loading: boolean;
    qdii: any[];
}


export const initState: State = {
    qdii: [],
    loading: false
}