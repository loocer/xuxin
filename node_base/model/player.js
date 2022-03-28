// import Robot  from './robot/robot1'
let Robot = require('./robot/robot1')
let {findIntPition} = require('../tools/tools')
class Player {
   constructor(room) {
      this.id = 'zzw';
      this.room = room
      this.ryMoveGroup = null
      this.indexRyId = 0//当前推送的id
      this.robots = new Map()
      this.createRobot()
   }
   createRobot() {
      let id = this.id
      // let robot = new Robot(id,this.room.graph)
      // // robot.map.graph = this.room.graph
      // this.robots.set(robot.id, robot)
      // robot.setEnd([99, 22])


      // let robot1 = new Robot(id)
      // robot1.map.graph = this.room.graph
      // this.robots.set(robot1.id, robot1)
      // robot1.setEnd([40, 3])
      for(let i=0;i<1;i++){
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
      let ryMoveGroup = null
      if(this.ryMoveGroup&&this.indexRyId != this.ryMoveGroup.id){
         ryMoveGroup=this.ryMoveGroup
         this.indexRyId = this.ryMoveGroup.id
      }
      
      for (let rot of this.robots.values()) {
         // let {start,end} = rot.map
         // this.room.graph.grid[start.x][start.y].weight = 0
         // this.room.graph.grid[end.x][end.y].weight = 1
         rots.push(rot.getPushMsg())
      }
      return {
         playerId: this.id,
         ryMoveGroup,
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