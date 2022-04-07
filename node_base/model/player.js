// import Robot  from './robot/robot1'
let Robot = require('./robot/robot1')
let { findIntPition, initPointPostion, findfuckPition } = require('../tools/tools')
class Player {
   constructor(room, { initPs }) {
      this.id = 'zzw';
      this.state = true
      this.room = room
      this.ryMoveGroup = null
      this.indexRyId = 0//当前推送的id
      this.robots = new Map()
      this.initPs = initPs
      this.rsInitPostion = initPointPostion[initPs]
   }
   addHero() {
      let id = this.id
      let { graph } = this.room
      let item = findIntPition(graph, this.rsInitPostion)
      let robot1 = new Robot(this, [item[0], item[1]])
      // robot1.map.graph = this.room.graph
      this.robots.set(robot1.id, robot1)
   }
   getPushMsg() {
      let rots = []
      let ryMoveGroup = null
      if (this.ryMoveGroup && this.indexRyId != this.ryMoveGroup.id) {
         ryMoveGroup = this.ryMoveGroup
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
         if (rot.bleed < 0) {
            rot.state = false
            this.robots.delete(rot.id)
            this.room.heroMap.delete(rot.id)
         }
         rot.update()
         this.changeAction(rot)
      }
   }
   changeAction(rot) {
      let { x, y } = rot.map.move1
      let m2 = rot.map.move2
      let key = ~~(x / 100) + '-' + ~~(y / 100)
      if (this.room.heroMap.has(key)) {
         let newValue = this.room.heroMap.get(key)
         if (!rot.heroMapKey) {
            if (newValue.has(this.id)) {
               newValue.get(this.id).add(rot)
            } else {
               let set = new Set();
               set.add(rot)
               newValue.set(this.id, set)
            }
         } else {
            let oldValue = this.room.heroMap.get(rot.heroMapKey)
            oldValue.get(this.id).delete(rot)
            if (newValue.has(this.id)) {
               newValue.get(this.id).add(rot)
            }else{
               let set = new Set();
               set.add(rot)
               newValue.set(this.id, set)
            }

         }
      } else {
         let set = new Set();
         set.add(rot)
         let map = new Map()
         map.set(this.id, set)
         this.room.heroMap.set(key, map)
      }
      rot.heroMapKey = key

      let values = this.room.heroMap.get(key)
      if (m2.x != x || m2.y != y) {
         return
      }
      let fRot = findfuckPition(rot, values, this.room.heroMap)
      if (fRot) {
         fRot.bleed--
      }

   }
   // changeAction(rot){
   //    let {x,y} = rot.map.move1
   //    let m2 = rot.map.move2
   //    this.room.heroMap.set(x+'-'+y,{
   //       rot
   //    })
   //    if(m2.x==x&&m2.y==y){
   //       let fRot = findfuckPition({x,y},this.room.heroMap)
   //       if(fRot){
   //          fRot.rot.bleed--
   //       }
   //    }
   // }
}
module.exports = Player