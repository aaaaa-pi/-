export default class SocketService {
    static instance = null
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    // 和服务端连接的socket对象
    ws = null
    // 存储回调函数
    callBackMapping = {}
    // 标识连接是否成功
    connected = false
    // 记录重试的数据
    sendRetryCount = 0
    connectRetryCount = 0
    // 定义连接服务器的方法
    connect() {
        // 连接服务器
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持WebSocket');
        }
        this.ws = new WebSocket('ws://localhost:9998')

        // 连接成功的事件
        this.ws.onopen = () => {
            this.connected = true
            console.log('服务器连接成功');
            this.connectRetryCount = 0
        }
        // 连接失败的事件
        this.ws.onclose = () => {
            this.connected = false
            console.log('服务器连接失败');
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount)
        }
        // 得到服务端发送过来的数据
        this.ws.onmessage = msg => {
            console.log('从服务端获取到了数据');
            // 真正服务端发送过来的原始数据时在msg中的data字段
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.socketType
            if (this.callBackMapping[socketType]) {
                const action = recvData.action
                if (action === 'getData') {
                    const realData = JSON.parse(recvData.data)
                    this.callBackMapping[socketType].call(this, realData)
                } else if (action === 'fullScreen') {
                    this.callBackMapping[socketType].call(this, recvData)
                } else if (action === 'themeChange') {
                    this.callBackMapping[socketType].call(this, recvData)
                }
            }
        }
    }
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack
    }
    unregisterCallBack(socketType) {
        this.callBackMapping[socketType] = null
    }
    // 发送数据的方法
    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.ws.send(JSON.stringify(data))
            }, this.sendRetryCount * 500)
        }
    }
}