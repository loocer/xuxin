// import GameMap  from '../box'
// import boxs  from '../../tools/rooms'
let  Box = require('../box')
class Robot1{
    constructor(playerId){
       this.id =(new Date()).valueOf();
       this.playerId = playerId
       this.map = new Box();
       this.start = [0,0]
    //    this.end = [99,22]
       this.end = null
    //    this.setBox()
    }
    setBox(){
        
    }
    setEnd(p){
        this.end = p
        let box = this.map
        let { start, end } = this
        box.start = box.graph.grid[start[0]][start[1]]
        box.end = box.graph.grid[end[0]][end[1]]
        box.query()
    }
    getPushMsg(){
        let box = this.map
        return {
            id:this.id,
            start:box.result[0],
            end:box.result[1]
        }
    }
    changeMove(p){
        let box = this.map
        box.end = box.graph.grid[p[0]][p[1]]
        box.query()
    }
    update(){
        let box = this.map
        if(box.result.length>1){
            box.update()
        }
        
        
    }
 }
 module.exports=Robot1