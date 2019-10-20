import request from 'superagent';
import { test, testIP } from './serverIP';

const agent = request.agent();

export function GetList() {
    let url = '/api/v1/get/clients';
    if(test)
        url = testIP + url;
    return agent.get(url).accept('application/json').withCredentials();
}

export function GetClientInfo(id) {
    let url = '/api/v1/get/client/info';
    if(test)
        url = testIP + url;
    return agent.post(url).send({client_id:id}).accept('application/json').withCredentials();
}