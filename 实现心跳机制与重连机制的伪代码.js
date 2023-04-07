const WebSocketUrl = "ws://example.com/ws"; // WebSocket服务端URL
const HeartbeatInterval = 30000;//心跳机制间隔时间为30s
const ReconnectInterval = 5000;//重试机制间隔时间为5s

let websocket = null;//Websocket对象
let heartbeatTimer = null;//心跳定时器
let reconnectTimer = null;//重连定时器

//连接websocket
function connectWebSocket() {
    websocket = new websocket(WebSocketUrl);

    // WebSocket打开事件
    websocket.onopen = function (event) {
        console.log('WebSocket已连接');
    }

    // 开始发送心跳
    startHeartbeat();
}

// WebSocket消息事件
websocket.onmessage = function (event) {
    console.log("收到消息：" + event.data);
    // 在此处理收到的消息
}

// WebSocket关闭事件
websocket.onclose = function (event) {
    console.log("WebSocket已关闭，代码：" + event.code + "，原因：" + event.reason);

    // 停止发送心跳
    stopHeartbeat();

    // 开始重连
    startReconnect();
}

// WebSocket错误事件
websocket.onerror = function (event) {
    console.log("WebSocket发生错误", event);
}

// 发送心跳消息
function sendHeartbeat() {
    if (websocket.readyState == websocket.OPEN) {
        websocket.send('ping');
    }
}

// 开始发送心跳
function startHeartbeat() {
    heartbeatTimer = setInterval(function () {
        sendHeartbeat();
    }, HeartbeatInterval)
}

// 停止发送心跳
function stopHeartbeat() {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
}

// 开始重连
function startReconnect() {
    if (!reconnectTimer) {
        reconnectTimer = setInterval(function () {
            console.log("尝试重新连接WebSocket...");

            // 重新连接WebSocket
            connectWebSocket();

            // 清除重连定时器
            if (websocket.readyState === WebSocket.OPEN) {
                clearInterval(reconnectTimer);
                reconnectTimer = null;
            }
        }, ReconnectInterval);
    }
}

// 连接WebSocket
connectWebSocket();
