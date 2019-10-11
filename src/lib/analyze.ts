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
    private sleep(ms=100){
        return new Promise(res=>setTimeout(() => {
            res();
        }, ms))
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
        console.log('waiting...');
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
            const contents: IRecord[] = [];
            for (let i = 0; i< elelist.length;i++){
                const el = elelist[i];
                const res = await get(el.href);
                if(res) {
                    var doc = document.implementation.createDocument (null, 'html', null);
                    var body = document.createElement('body');
                    body.innerHTML = res.data;
                    doc.documentElement.appendChild(body);

                    // var art = new Readability(doc).parse();
    
                    contents.push({...el, content: body.textContent });//art.title + ' : ' + art.content};    
                } else{
                    contents.push(el);
                }
                if(i%5===0){
                    await this.sleep();
                }
            }
                       
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