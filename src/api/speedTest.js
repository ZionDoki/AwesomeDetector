import request from 'superagent';
import { test, testIP } from './serverIP';

const agent = request.agent();

{/* 获取在线客户端列表 */}
export function GetList() {
    let url = '/api/v1/get/clients';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send({get_all: true})            
                .accept('application/json')
                .withCredentials();
}

{/* 获取指定客户端的路由跳数和延迟 */}
export function GetClientInfo(id) {
    let url = '/api/v1/get/client/info';
    if(test)
        url = testIP + url;
    return agent.post(url).send({client_id:id}).accept('application/json').withCredentials();
}

{/* 获取指定客户端的上行速度 */}
export function GetSpeed(data) {
    let url = '/api/v1/get/client/speed/upload';
    if(test)
        url = testIP + url;
    return agent.post(url)
                .send(data)
                .accept('application/json')
                .withCredentials();
}

{/* 指定客户端向另一客户端发起网络测速 */}
export function P2PTest(data) {
    
}