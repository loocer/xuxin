let address = 'http://172.16.25.101:3000'
import utl from "../utl.js"
import Bullet from "../entity/bullet.js"

let Event = Laya.Event;
let result = {}

let websocket = null
let timeFrame = new Map()
import { Astar} from "./astar"
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


let ryMoveGroup = null

export const socketMain = () => {
	createGraph()
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
	utl.socket = io('wss://xuxin.love:3000');
	utl.socket.on('123456', (s) => {
		resetGraph()
		utl.mapSp.graphics.clear()
		utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
		for (let player of s.list) {
			if(player.playerId=='zzw'){
				ryMoveGroup = player.ryMoveGroup
			}
			for (let rot of player.rots) {
				let queryList = []
				if (utl.entityMap.has(rot.id)) {
					// if (rot.start) {
					// 	utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
					// 	let x = ~~(rot.start.x / 500 * 400)
					// 	let y = ~~(rot.start.y / 500 * 400)
					// 	utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
					// 	// utl.graph.grid[rot.start.x][rot.start.y].weight = 0
					// }
					// else  {
						// utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
						let x = ~~(rot.end.x / 500 * 400)
						let y = ~~(rot.end.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y, 5, "#00ffff");
						utl.graph.grid[rot.start.x][rot.start.y].weight = 0
					// } 
					// let tweenObj = rot.start	
					// tweenObj.x = -tweenObj.x
					// tweenObj.id = rot.id
					// queryList.push({
					// 	id:rot.id,
					// 	start:rot.start,
					// 	end:rot.end
					// })
					if(
						rot.start.x ==rot.end.x 
  						&&rot.start.y ==rot.end.y ){

					}else{
						// timeFrame.get(rot.id).queryId = rot.start.queryId
						timeFrame.get(rot.id).list.push({
							start:rot.start,
							end:rot.end
						})
						
					}
					
				} else {

					let map2 = utl.models.get('cube').clone()
					map2.getChildByName('on').active = false
					utl.newScene.addChild(map2);
					utl.entityMap.set(rot.id, map2)
					// if (rot.start) {
					// 	utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.start.x, 3, rot.start.y)
					// 	let x = ~~(rot.start.x / 500 * 400)
					// 	let y = ~~(rot.start.y / 500 * 400)
					// 	utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
						utl.graph.grid[rot.start.x][rot.start.y].weight = 0
					// }
					// else{
					timeFrame.set(rot.id,{
						flag:true,
						// queryId:rot.start.queryId,
						list:[{
							start:rot.start,
							end:rot.end
					}]})	
					// if(
					// 	rot.start.x ==rot.end.x 
  			// 			&&rot.start.y ==rot.end.y ){

					// }else{
					// 	timeFrame.get(rot.id).list.push({
					// 		start:rot.start,
					// 		end:rot.end
					// 	})
						
					// }
						// utl.entityMap.get(rot.id).transform.position = new Laya.Vector3(-rot.end.x, 3, rot.end.y)
						let x = ~~(rot.end.x / 500 * 400)
						let y = ~~(rot.end.y / 500 * 400)
						utl.mapSp.graphics.drawCircle(x, 400 - y,5, "#00ffff");
						// let tweenObj = rot.start	
						// tweenObj.id = rot.id
						// Laya.Tween.to(tweenObj,{x:-rot.end.x,y:rot.end.y,update:new Laya.Handler(this,updateMove,[tweenObj])},600,Laya.Ease.linearNone,Laya.Handler.create(this,tweend,[tweenObj]),0);
						// utl.graph.grid[rot.end.x][rot.end.y].weight = 0
					// } 
				}
				if(timeFrame.get(rot.id).list.length==1){
					// console.log(timeFrame.get(rot.id))
					// if(
					// 	timeFrame.get(rot.id)[0].start.x ==timeFrame.get(rot.id)[0].end.x 
  			// 			&&timeFrame.get(rot.id)[0].start.y ==timeFrame.get(rot.id)[0].end.y ){

					// }else{
						engMain(rot.id)
					// }
					
				}
			}
		}
		queryString()
	});
	// utl.socket.on('123456-moveGroup', (s) => {
		
	// 	resetGraph()
	// 	utl.mapSp.graphics.clear()
	// 	utl.mapSp.graphics.drawRect(0, 0, 400, 400, "#00000066");
	// 	let result = []
	// 	let {x,y} = s.target
	// 	let queryId = (new Date()).valueOf();
 //        for(let r of s.heros){ 
 //        	timeFrame.get(r.id).flag = false
	// 		timeFrame.get(r.id).list = []
 //         	let start = utl.graph.grid[r.x][r.y]
 //         	let end = utl.graph.grid[~~-x][~~y]
 //         	result = Astar.astar.search(utl.graph, start, end);
 //        	let ps = []
 //        	ps.push({
 //        	 	x:start.x,
 //             	y:start.y,
 //            })
 //         	for(let objd of result){
 //           		ps.push({
 //            	 	x:objd.x,
 //             		y:objd.y,
 //           		})
 //         	}
 //          r.result = ps
 //          timeFrame.get(r.id).flag = true
 //       }
 //         let msg = {
	//        userId: 'zzw',
	//        actionName:'moveGroup',
	//        heros:s.heros
	//      }
	     
	//      utl.socket.emit('123456', msg);
	// });
	utl.socket.on('event', function(data) {});
	utl.socket.on('disconnect', function() {});
	//------------------------------web-------------------
}
function queryString(){
	if(!ryMoveGroup){
		return
	}
	let result = []
	let {x,y} = ryMoveGroup.target
	
	for(let r of ryMoveGroup.heros){ 
		utl.graph.grid[r.x][r.y].weight = 1
	}
    for(let r of ryMoveGroup.heros){ 
    	timeFrame.get(r.id).flag = false
		timeFrame.get(r.id).list = []
     	let start = utl.graph.grid[r.x][r.y]
     	let end = utl.graph.grid[~~-x][~~y]
     	result = Astar.astar.search(utl.graph, start, end);
    	let ps = []
    	ps.push({
    	 	x:start.x,
         	y:start.y,
        })
     	for(let objd of result){
       		ps.push({
        	 	x:objd.x,
         		y:objd.y,
       		})
     	}
      r.result = ps
      timeFrame.get(r.id).flag = true
   }
     let msg = {
       userId: 'zzw',
       actionName:'moveGroup',
       heros:ryMoveGroup.heros
     }
     
     utl.socket.emit('123456', msg);
}
function engMain(id){
	let flag = timeFrame.get(id).flag
	if(!flag){
		return
	}
	let list = timeFrame.get(id).list
	let obj = list[0]
	let frameObj = {
		id:id,
		x:obj.start.x,
		y:obj.start.y,
		list
	}
	// timeFrame.get(id).queryId = obj.start.queryId
	list.shift()
	Laya.Tween.to(frameObj,{x:obj.end.x,y:obj.end.y,update:new Laya.Handler(this,updateMove,[frameObj])},300,Laya.Ease.linearNone,Laya.Handler.create(this,tweend,[frameObj]),0);
}
function updateMove(value){
	utl.entityMap.get(value.id).transform.position = new Laya.Vector3(-value.x, 3,value.y)
	// let obj = value.val
	// if(obj.speed>0){
		
	// 	let box = utl.boxs.get(obj.id)
	// 	box.transform.translate(new Laya.Vector3(0,-obj.speed/10,0),true)
	// }
	
}
function tweend(obj){

	if(!timeFrame.get(obj.id).flag){
		return
	}
	let list = timeFrame.get(obj.id).list
	// if(timeFrame.get(obj.id).queryId==list[0].start.queryId){
		
		if(list.length>0){
			engMain(obj.id)
		}
	// }
	
	
}
