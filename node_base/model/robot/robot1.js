// import GameMap  from '../box'
// import boxs  from '../../tools/rooms'
let  Box = require('../box')
class Robot1{
    constructor(playerId,graph,start){
       this.id =(new Date()).valueOf();
       console.log(this.id)
       this.playerId = playerId
       this.map = new Box(graph);
       this.start =start||[0,0]
    //    this.end = [99,22]
       this.end = null
       this.setBox()
    }
    setBox(){
        let box = this.map
        let { start } = this
        box.start = box.graph.grid[start[0]][start[1]]
        box.graph.grid[start[0]][start[1]].weight = 0
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
        let end = box.end?{x:box.end.x,y:box.end.y}:null
        return {
            id:this.id,
            start:{x:box.start.x,y:box.start.y},
            end
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