import request from 'superagent';
import {testIP, test} from './serverIP';

const agent = request.agent();

export default function SignIn(username, password) {
  let url = "/api/v1/login";
  if(test) url = testIP + url;
  const data = {
    username: username, 
    password: password
  }
  return agent.post(url)
    .type('json')
    .send(data)
    .withCredentials()
    .accept('application/json');
}
