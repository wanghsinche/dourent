import { basic, getQDII } from './qdii';
// only 3 yrs
// return larger, smaller, score
async function permiumInterval(code:string, lastPermium: number){
  lastPermium = Math.ceil(lastPermium*10000);
  // get all perminum last 3 yrs
  const res = await basic(code);

  const premium = res.map(el=>el.premium).filter(el=>el!==undefined).map(el=>Math.ceil(el*10000));
  
  // count value large than and less than
  const [larger, smaller] = premium.reduce((am, curr)=>{
    if (curr !== undefined) {
      if (curr >= lastPermium) am[0]+=1;
      if (curr < lastPermium) am[1]+=1;
    }
    return am;
  }, [0, 0]);
  

  const max = Math.max.apply(null, premium);
  const min = Math.min.apply(null, premium);

  const bins = Math.ceil((max - min + 1) / premium.length);

  const histogram:{pos:number, num: number, rank: number}[] = new Array(bins).fill({
    num: 0, pos: min, rank: 0
  });

  premium.forEach(item=>{
    const pos = Math.floor((item - min) / premium.length);
    histogram[pos].pos = Math.floor(pos + min);
    histogram[pos].rank = pos;
    histogram[pos].num += 1;
  });

  // find out most index

  const most = histogram.reduce((am, curr)=>{
    if (curr.num > am.num) return curr;;;
    return am;
  });

  const score = (most.pos - lastPermium) / (max - min) + 1;
  const all = larger + smaller;
  return {
    larger: larger / all, smaller: smaller / all, score, code, max, min, res
  };
}

export function main() {
  return getQDII().then(list=>Promise.all(list.map(d=>{
    const code = ((d.id as string).startsWith("1") ? 'sz':'sh') + d.id;
    const premium = parseFloat(d.cell.discount_rt) / 100;
    return permiumInterval(code, premium);
  })))
  .then(list=>{
    const data = list.reduce((am, curr)=>{
      const code = curr.code.substr(2);
      const {res, ...others} = curr;
      am[code] = others;
      return am;
    }, {});
    const resData = list.reduce((am, curr)=>{
      const code = curr.code.substr(2);
      const {res} = curr;
      am[code] = res;
      return am;
    }, {});
    return [data, resData];
})
}
