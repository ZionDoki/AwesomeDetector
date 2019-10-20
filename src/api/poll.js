import request from 'superagent';
import { testIP, test } from './serverIP';

const agent = request.agent();

export default function Poll() {
    let url = '/api/v1/is/signed/manage';
    if(test) url = testIP + url;

    return agent
        .get(url)
        .withCredentials()
        .accept('application/json');
}