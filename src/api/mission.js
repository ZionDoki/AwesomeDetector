import SuperAgent from 'superagent';
import { test, testIP } from './serverIP';

const agent = SuperAgent.agent();

{/* 创建任务：SYN UDP SHA，参数：client_id ip mac type (target_client)*/}
export function CreateMission(data) {
    let url = "/api/v1/add/mission"
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 确认任务是否完成，参数：mission_id */}
export function IsFinished(data) {
    let url = '/api/v1/is/mission/done'
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

{/* 创建UDP任务，参数：client_id, ip, mac, type, duration, speed */}
export function CreateUdpMission(data) {
    let url = "/api/v1/add/mission/udp";
    if(test) url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}