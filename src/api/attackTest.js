import request from 'superagent';
import { test, testIP } from './serverIP';

const agent = request.agent();

{/* 获取客户端列表 */}
export function GetList() {
    let url = '/api/v1/get/clients';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send({get_all: true})
                .accept('application/json')
                .withCredentials();
}

{/* 创建任务：SYN UDP SHA */}
export function CreateMission(data) {
    let url = "/api/v1/add/mission"
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 确认任务是否完成 */}
export function IsFinished(data) {
    let url = '/api/v1/get/mission/status'
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 请求任务结果 */}
export function GetResult(data) {
    let url = '/api/v1/get/mission/result';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}