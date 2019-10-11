import request from 'superagent';
import { testIP, test } from './serverIP';

export default function Poll() {
    let url = '/api/v1/is/signed';
    if(test) url = testIP + url;

    return request.get(url).accept('application/json');
}