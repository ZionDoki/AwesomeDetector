import request from 'superagent';
import { testIP, test } from './serverIP';

export function GetOverviewData() {
    let url = '/api/v1/get/overview';
    if(test)
        url = testIP + url;
    return request.get(url).accept('application/json');
}

