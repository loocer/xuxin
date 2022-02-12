// import Astar from '../tools/astar.js'
let Astar = require('../tools/astar.js');
let graph = null
// var graph = new Graph([
//   [1,1,1,1],
//   [0,1,1,0],
//   [0,0,1,1]
// ]);
// var  graphMove = [
//   [0,0,0,0],
//   [0,1,1,0],
//   [0,0,1,1]
// ]
// const positionBox = [
//   [{x:0,y:0},{x:1,y:0}]
// ]
class Box{
  constructor(){
    this.position = {x:0,y:0}
    this.start = null
    this.end = null
    this.result = []
    this.graph = null
    this.drawPositions = []
    this.standingTime = 0
    this.isMove=false
  }
  init(){

  }
  setEndPoint(p){
    this.end = p
  }
  query(){
    let { start, end} = this
    this.stop()
    this.result = Astar.astar.search(this.graph, start, end);
  }
  check(){
    let nextPoint = this.result[1]
    return nextPoint.weight
  }
  stop(){
    this.result = []
  }
  changeState(p0){
    let p1 = this.result[0]
    this.start = p0
    this.end = p1
    // this.drawPositions = {
    //   // start:positionBox[p0[0],p0[1]],
    //   // end:positionBox[p1[0],p1[1]]
    //   start:p0,
    //   end:p1
    // }
    // let g1 = this.graph[p0[0],p0[1]]
    // let g2 = this.graph[p1[0],p1[1]]
    // this.graph[p0[0],p0[1]] = 0
    // this.graph[p1[0],p1[1]] = 1
    p0.weight = 1
    p1.weight = 0
  }
  update(){
    if(this.result.length>1){
      if(this.check()){
        this.standingTime = 0
        this.changeState(this.result.shift())
      }else{
        if(this.standingTime==10){
          this.query()
        } 
        this.standingTime++
      }
    }
  }
}

// let game = new Game();
// game.box.start = game.box.graph.grid[0][0]
// game.box.end = game.box.graph.grid[80][90]
// game.box.query()
// console.log(game.box.graph.grid[0][0].weight)
module.exports=Box 