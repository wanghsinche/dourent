import Swal from 'sweetalert2';
export function logError(e:Error){
    console.log('dourent', e);
    Swal.fire({text: '出现错误，请按F12打开控制台查看', type:'error'});
}