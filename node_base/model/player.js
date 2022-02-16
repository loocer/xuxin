// import Robot  from './robot/robot1'
let Robot = require('./robot/robot1')
let {findIntPition} = require('../tools/tools')
class Player {
   constructor(room) {
      this.id = 'zzw';
      this.room = room
      this.robots = new Map()
      this.createRobot()
   }
   createRobot() {
      let id = this.id
      let robot = new Robot(id,this.room.graph)
      // robot.map.graph = this.room.graph
      this.robots.set(robot.id, robot)
      // robot.setEnd([99, 22])


      // let robot1 = new Robot(id)
      // robot1.map.graph = this.room.graph
      // this.robots.set(robot1.id, robot1)
      // robot1.setEnd([40, 3])
      for(let i=0;i<2;i++){
         let robot1 = new Robot(id,this.room.graph,[2*i, 3])
         // robot1.map.graph = this.room.graph
         this.robots.set(robot1.id, robot1)
      }
     
      //    robot1.setEnd( [55,57])
   }
   addHero(){
      let id = this.id
      let {graph} = this.room
      let item = findIntPition(graph,{x:0,y:0})
      let robot1 = new Robot(id,this.room.graph,[item[0], item[1]])
      // robot1.map.graph = this.room.graph
      this.robots.set(robot1.id, robot1)
   }
   getPushMsg() {
      let rots = []
      for (let rot of this.robots.values()) {
         rots.push(rot.getPushMsg())
      }
      return {
         playerId: this.id,
         rots
      }
   }
   update() {
      for (let rot of this.robots.values()) {
         rot.update()
      }
   }
}
module.exports = Player