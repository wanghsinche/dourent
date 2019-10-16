export function dateFormat(d:Date){
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const hrs = d.getHours();
    const minute = d.getMinutes();
    return `${year}-${month}-${date} ${hrs}:${minute}`
}