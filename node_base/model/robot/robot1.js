// import GameMap  from '../box'
// import boxs  from '../../tools/rooms'
let GameMap = require('../box')
class Robot1{
    constructor(playerId){
       this.id ='cube';
       this.playerId = playerId
       this.map = new GameMap();
       this.start = [0,0]
    //    this.end = [99,22]
       this.end = null
    //    this.setBox()
    }
    setBox(){
        
    }
    setEnd(p){
        this.end = p
        let box = this.map.box
        let { start, end } = this
        box.start = box.graph.grid[start[0]][start[1]]
        box.end = box.graph.grid[end[0]][end[1]]
        box.query()
    }
    getPushMsg(){
        let box = this.map.box
        return {
            id:this.id,
            start:box.result[0],
            end:box.result[1]
        }
    }
    changeMove(p){
        this.end = p
        let box = this.map.box
        let { end } = this
        console.log(end)
        box.end = box.graph.grid[end[0]][end[1]]
        box.query()
    }
    update(){
        let box = this.map.box
        if(box.result.length>1){
            box.update()
        }
        
        
    }
 }
 module.exports=Robot1