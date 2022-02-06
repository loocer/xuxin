// import Robot  from './robot/robot1'
let Robot = require('./robot/robot1')
class Player{
   constructor(){
      this.id = 'zzw';
      this.robots = new Map()
      this.createRobot()
   }
   createRobot(){
       let id = this.id
       let robot = new Robot(id)
      //  let robot1 = new Robot(id)
       this.robots.set(robot.id,robot)
       robot.setEnd( [99,22])
       setTimeout(()=>{
        robot.setEnd( [22,0])
       },2000)
    //    robot1.setEnd( [55,57])
   }
   getPushMsg(){
      let rots = []
      for(let rot of this.robots.values()){
         rots.push(rot.getPushMsg())
      }
      return {
         playerId:this.id,
         rots
      }
   }
   update(){
      for(let rot of this.robots.values()){
         rot.update()
      }
   }
}
module.exports=Player