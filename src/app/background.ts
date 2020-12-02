import { listener } from '../lib/service';

chrome.runtime.onMessage.addListener(listener);