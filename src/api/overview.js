import request from 'superagent';
import { testIP, test } from './serverIP';

const agent = request.agent();

export function GetOverviewData() {
    let url = '/api/v1/get/overview';
    if(test)
        url = testIP + url;

    return agent.get(url).accept('application/json').withCredentials() ;
}

