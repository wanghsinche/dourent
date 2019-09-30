import {Item, getPath, get} from './database';
import {logError} from './log';
import * as readArt from 'read-art';

interface IRecord {
    href: string;
    content: string;
    timeStamp: number;
    id:string;
}
class Analyze {
    heuristicData:Item[];
    maxItem = 100;
    currentItem = 0;
    currentStart = 0;
    offset = 50;
    tags: string[];
    price: number;
    constructor(data:Item[], tags:string[], price: number){
        this.heuristicData = data;
        this.tags = tags;
        this.price = price;
    }
    private hrefToId(href:string){
        const id = href.match(/topic\/(\d+)\//);
        if (id) {
            return id[1];
        }
        return '';
    }
    private async getTag(tags:string[], content:string){

    }
    private async process(gpId:string){
        try {
            const url = new URL(getPath(gpId, 'discussion'));
            url.searchParams.set('start', this.currentStart+'');
            const listPage = await get(url.href);
            const dom = document.createElement('div');
            dom.innerHTML = listPage.data;
            const elelist:IRecord[] = Array.from(dom.querySelectorAll('.article tr'))
            .filter(el=>el.className!=='th')
            .map(el=>{
                const title = el.querySelector('.title');
                let time = el.querySelector('.time').textContent;
                if (time.includes(':')){
                    time = (new Date()).getFullYear() + '-' +time;
                }
                return {
                    id: this.hrefToId(title.getAttribute('href')),
                    href: title.getAttribute('href'),
                    timeStamp: (new Date(time)).valueOf(),
                    content: '',
                };}
            );
            const contents = await Promise.all(elelist.map(async el=>{
                const res = await get(el.href);
                const art = await readArt(res.data, {
                    output: {
                      type: 'text',
                      stripSpaces: true}},
                );
                return {...el, content: art.title + ' : ' + art.content};
            }));
        

            
        } catch (error) {
            logError(error);
        }
    }
}