let address = 'http://172.16.25.101:3000'
import utl from "../utl.js"
import Bullet from "../entity/bullet.js"

let Event = Laya.Event;
let result = {}
// var io = require("../io.js");
let websocket = null
let timeFrame = new Map()


export const getServiceAddress = () => {
	let hr = new HttpRequest();

	function onHttpRequestProgress(e) {
		console.log(123)
	}

	function onHttpRequestComplete(e) {
		result.serviceAddress = JSON.parse(hr.data).data;
		login()
		console.log(3458888, result)
	}

	function onHttpRequestError(e) {
		console.log(534543, e)
	}
	hr.once(Event.PROGRESS, this, onHttpRequestProgress);
	hr.once(Event.COMPLETE, this, onHttpRequestComplete);
	hr.once(Event.ERROR, this, onHttpRequestError);
	hr.send(address + '/get-socketAddress', '', 'get', 'text');

}

export const socketMain = () => {
	// const socket = new WebSocket('ws://xuxin.love:3000');
	// // wx.connectSocket({
	// //   url: 'ws://xuxin.love:3000'
	// // })
	// // wx.onSocketOpen(function(res) {
	// //  wx.onSocketMessage((e)=>{
	// //  	console.log(e)
	// //  })

	// // })
	// return
	// utl.socket = io('ws://192.168.0.105:3000');
	utl.socket = io('ws://121.196.222.174:3000');
	// utl.socket = io('wss://hunchun828.top');
	utl.socket.on('123456', (s) => {
		if(s.list.length==0){
			return
		}
		utl.frameAddIndex++
		for(let obj of s.list){
			if(utl.frameTimesMap.has(obj.id)){
				utl.frameTimesMap.get(obj.id).push(...obj.list)
			}else{
				utl.frameTimesMap.set(obj.id,obj.list)
			}
		}
		
	});
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}