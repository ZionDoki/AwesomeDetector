import request from 'superagent';
const agent = request.agent();
var test = true;

const electron = window.require('electron');
const fs = electron.remote.require('fs');
var testIP = JSON.parse(fs.readFileSync('config.json', 'utf-8')).testIp;

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
