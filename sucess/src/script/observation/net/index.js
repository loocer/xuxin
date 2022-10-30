let address = 'http://172.16.25.101:3000'
import utl from "../../utl.js"
import Bullet from "../../entity/bullet.js"

let Event = Laya.Event;
let result = {}

let websocket = null

import { Astar} from "./astar"
let allBoy = []
function createGraph() {
	let list = []
	for (let i = 0; i < 500; i++) {
	    let list1 = []
	    for (let o = 0; o < 500; o++) {
	        list1.push(1)
	    }
	    list.push(list1)
	}

	utl.graph = new Astar.Graph(list);
}
function resetGraph(){
	for(let obj of utl.graph.grid){
		for(let indexObj of obj){
			indexObj.weight = 1
		}
	}
}


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
	// utl.socket = io('https://hunchun828.top');
	utl.socket = io('http://192.168.0.101:3000');
	utl.socket.on('123456', (s) => {
		utl.frames.push(s)
	});
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}

