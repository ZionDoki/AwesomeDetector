import request from 'superagent';
import {testIP, test} from './serverIP';

export default function SignIn(username, password) {
  let url = "/api/v1/login";
  if(test) url = testIP + url;
  const data = {
    username: username, 
    password: password
  }
  return request.post(url)
    .type('json')
    .send(data)
    .accept('application/json');
}
