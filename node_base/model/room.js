
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
   receive(msg,io) { //{playerId:0}}
      let {players} = this
      if(players.has(msg.playerId)){
         let p = players.get(msg.playerId)
         p.addFrame(msg.frame)
      }else{
         let p = this.addPlayer(msg.playerId)
         p.addFrame(msg.frame)
      }
      this.pushMsg(msg.playerId,io)
   }
   work(io){
   //    setInterval(()=>{
   //       this.pushMsg(io)
   //   },30)
   }
   pushMsg(id,io) {
     
      let list = []
      for (let obj of this.players.values()) {
         list.push(obj.getPushMsg())
      }
      io.emit(id, {
         list
      });
   }
}
module.exports = Room