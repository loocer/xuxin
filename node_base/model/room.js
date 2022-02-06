
// import Player  from './player'
let Player = require('./player')
let boxs =require('../tools/rooms')
class Room{
   constructor(){
      this.players = new Map()
      this.id = '123456';
      this.heros = []
      boxs.set(this.id,this)
   }
   addPlayer(){
      let player = new Player()
      this.players.set(player.id,player)
   }
   update(){
      let players = this.players
      for (let value of players.values()) {
        value.update()
      }
   }
   receive(msg){//{userId:0,heros:[],coordinate:{x,y,z}}
      let player =this.players.get(msg.userId)
      for(let hero of msg.heros){
         player.robots.get(hero.id).changeMove([hero.coordinate.x,hero.coordinate.y])
      }
   }
   pushMsg(io){
      let list  = []
      for(let obj of this.players.values()){
         list.push(obj.getPushMsg())
      }
      io.emit(this.id, {list});
   }
}
module.exports=Room