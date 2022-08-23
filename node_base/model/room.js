
let Player = require('./player')
let boxs = require('../tools/rooms')
class Room {
   constructor() {
      this.players = new Map()
      this.id = '123456';
   }
   
   addPlayer(id) {
      let player = new Player(this,id)
      this.players.set(id, player)
      return player
   }
   update() {
      
   }
   receive(msg) { //{userId:0,heros:[],coordinate:{x,y,z}}
      let {players} = this
      if(players.has(msg.playerId)){
         let p = players.get(msg.playerId)
         p.addFrame(msg.frame)
      }else{
         let p = this.addPlayer(msg.playerId)
         p.addFrame(msg.frame)
      }
   }
   work(io){
      setInterval(()=>{
         this.pushMsg(io)
     },30)
   }
   pushMsg(io) {
      // let glist =[]
      // for(let graid of this.graph.grid){
      //    for(let objd of graid){
      //       if(objd.weight==0){
      //          glist.push({
      //             x:objd.x,
      //             y:objd.y,
      //          })
      //       }
      //       // objd.weight=1
      //    }
      // }
      let list = []
      for (let obj of this.players.values()) {
         list.push(obj.getPushMsg())
      }
     
      
      io.emit(this.id, {
         list
      });
     
      // io.emit('123456-observer', {
      //    glist
      // });
      // for(let obj of this.moveGroups){
      //    io.emit(obj.id, {
      //       heros:obj.heros,
      //       target:obj.target
      //    });
      // }
      // this.moveGroups = []
   }
}
module.exports = Room