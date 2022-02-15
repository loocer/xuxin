let Astar = require('./astar.js');
let graphe = null
function createGraph() {
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

    graphe = new Astar.Graph(list);
        // graphe.grid[2][3].weight = 0
        // graphe.grid[2][1].weight = 0
        // graphe.grid[3][2].weight = 0
        // graphe.grid[3][1].weight = 0
        // graphe.grid[1][2].weight = 0
        // graphe.grid[2][1].weight = 0
        // graphe.grid[3][3].weight = 0
        // graphe.grid[1][1].weight = 0
        // graphe.grid[1][3].weight = 0
        // graphe.grid[2][4].weight = 0
 }
const findIntPition=(graph,center,pindex)=>{// center = {x:3,y:3}
    let index = pindex||1
    let list  = findBy(index,center)
    for(let item of list){
        if(graph.grid[item[0]][item[1]].weight==1){
            return item
        }
    }
    return  findIntPition(graph,center,++index)
}
function findBy(index,center){
    let list = []
    for(let i = 0;i<index;i++){
        if(i==0){
            list.push([0+center.x,index+center.y])
            list.push([0+center.x,-index+center.y])
            list.push([index+center.x,0+center.y])
            list.push([-index+center.x,0+center.y])
            list.push([index+center.x,index+center.y])
            list.push([-index+center.x,-index+center.y])
            list.push([index+center.x,-index+center.y])
            list.push([-index+center.x,index+center.y])
        }else{
            list.push([index+center.x,i+center.y])
            list.push([index+center.x,-i+center.y])
            list.push([-index+center.x,i+center.y])
            list.push([-index+center.x,-i+center.y])
            list.push([i+center.x,index+center.y])
            list.push([i+center.x,-index+center.y])
            list.push([-i+center.x,index+center.y])
            list.push([-i+center.x,-index+center.y])
        }
    }
    return list
}
module.exports={
    findIntPition
}
createGraph()
let item = findIntPition(graphe,{x:2,y:2})
console.log(item)