declare module '*.less';
declare module '*.css';
declare module '*.svg';
interface Window {
    _store:any
}

declare const ENV:'dev'|null|'extension';