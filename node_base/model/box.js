// import Astar from '../tools/astar.js'
let Astar = require('../tools/astar.js');

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
    this.start = p1
    this.drawPositions = {
      // start:positionBox[p0[0],p0[1]],
      // end:positionBox[p1[0],p1[1]]
      start:p0,
      end:p1
    }
    this.graph[p0[0],p0[1]] = 0
    this.graph[p1[0],p1[1]] = 1
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
class Game{
  constructor(){
    this.graph= null
    this.positionBox = null
    this.box = new Box()
    this.setMap()
  }
  setMap(){
    let list = []
    let positionBox = []
    for(let i=0;i<500;i++){
      let list1 = []
      for(let o=0;o<500;o++){
        list1.push(1)
        positionBox.push({x:o,y:i})
      }
      list.push(list1)
    }
    
    this.graph = new Astar.Graph(list);
   
    this.graphMove = list
    this.positionBox = positionBox
    this.box.graph =  this.graph
  }
}
// let game = new Game();
// game.box.start = game.box.graph.grid[0][0]
// game.box.end = game.box.graph.grid[80][90]
// game.box.query()
// console.log(game.box.graph.grid[0][0].weight)
module.exports=Game 