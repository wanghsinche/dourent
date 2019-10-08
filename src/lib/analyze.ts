import {Item, getPath, get} from './database';
import {logError} from './log';
import * as Readability from 'readability';
export interface IRecord {
    href: string;
    content: string;
    timeStamp: number;
    id:string;
    tags?: string[];
}
export class Analyze {
    heuristicData:Item[];
    maxItem = 100;
    currentItem = 0;
    currentStart = 0;
    offset = 50;
    tags: string[];
    price: number;
    gpId: string;
    constructor(gpId: string, data:Item[], tags:string[], price: number){
        this.heuristicData = data;
        this.tags = tags;
        this.price = price;
        this.gpId = gpId;
    }
    private hrefToId(href:string){
        const id = href.match(/topic\/(\d+)\//);
        if (id) {
            return id[1];
        }
        return '';
    }
    private getTag(tags:string[], content:string){
        const found:string[] = []
        return found;
    }
    async process(){
        try {
            const url = new URL(getPath(this.gpId, 'discussion'));
            url.searchParams.set('start', this.currentStart+'');
            const listPage = await get(url.href);
            const dom = document.createElement('div');
            dom.innerHTML = listPage.data;
            const elelist:IRecord[] = Array.from(dom.querySelectorAll('.article tr'))
            .filter(el=>el.className!=='th')
            .map(el=>{
                const title = el.querySelector('.title a');
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
                if(res) {
                    var doc = document.implementation.createDocument ('http://www.w3.org/1999/xhtml', 'html', null);
                    var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');
                    body.innerHTML = res.data;
                    body.setAttribute('id', 'abc');
                    doc.documentElement.appendChild(body);

                    // var art = new Readability(doc).parse();
    
                    return {...el, content: '' };//art.title + ' : ' + art.content};    
                }
                return el;
            }));
                       
            this.currentStart += contents.length;

            return contents.map(el=>({
                ...el,
                tags: this.getTag(this.tags, el.content)
            }));
        } catch (error) {
            logError(error);
        }
    }
}