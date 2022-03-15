let Astar = require('../tools/astar.js');
let Player = require('./player')
let boxs = require('../tools/rooms')
class Room {
   constructor() {
      this.players = new Map()
      this.id = '123456';
      this.heros = []
      this.graph = null
      this.createGraph()
      boxs.set(this.id, this)
   }
   createGraph() {
      let list = []
      let positionBox = []
      for (let i = 0; i < 500; i++) {
         let list1 = []
         for (let o = 0; o < 500; o++) {
            list1.push(1)
            positionBox.push({
               x: o,
               y: i
            })
         }
         list.push(list1)
      }

      this.graph = new Astar.Graph(list);
      this.positionBox = positionBox
   }
   addPlayer() {
      let player = new Player(this)
      this.players.set(player.id, player)
   }
   update() {
      let players = this.players
      for (let value of players.values()) {
         value.update()
      }
   }
   receive(msg) { //{userId:0,heros:[],coordinate:{x,y,z}}
      if(msg.actionName=='moveGroup'){
         this.moveGroup(msg)
      }
      if(msg.actionName=='addHero'){
         this.addHero(msg)
      }
   }
   addHero(msg){
      let player = this.players.get(msg.userId)
      player.addHero()
   }
   moveGroup(msg){
      // let player = this.players.get(msg.userId)
      // for (let hero of msg.heros) {
      //    if(player.robots.has(hero.id)){
      //       player.robots.get(hero.id).changeMove([hero.coordinate.x, hero.coordinate.y])
      //    }
      // }
      let player = this.players.get(msg.userId)
      for (let hero of msg.heros) {
         if(player.robots.has(hero.id)){
            player.robots.get(hero.id).changeResult(hero)
         }
      }
   }
   pushMsg(io) {
      let list = []
      for (let obj of this.players.values()) {
         list.push(obj.getPushMsg())
      }
     
      
      io.emit(this.id, {
         list
      });
      io.emit(this.id+'-observer', {
         grid:this.graph.grid
      });
   }
}
module.exports = Room