// import GameMap  from '../box'
// import boxs  from '../../tools/rooms'
let Box = require('../box')
class Robot1 {
    constructor(playerId, graph, start) {
        this.id = (new Date()).valueOf();
        console.log(this.id)
        this.playerId = playerId

        this.start = start || [0, 0]
        this.map = new Box(graph, this.start);
        //    this.end = [99,22]
        //    this.setBox()
    }
    setBox() {
        let box = this.map
        let { start } = this
        box.start = box.graph.grid[start[0]][start[1]]
        box.graph.grid[start[0]][start[1]].weight = 0
    }
    setEnd(p) {
        let box = this.map
        box.end = box.graph.grid[p[0]][p[1]]
        box.query()
    }
    getPushMsg() {
        let box = this.map
        return {
            id: this.id,
            start: box.move1,
            end: box.move2,
        }
    }
    changeMove(p) {
        let box = this.map
        box.end = box.graph.grid[p[0]][p[1]]
        box.query()
    }
    ryMoveGroup(){
        let box = this.map
        let p0 = box.move1
        let p1 = box.move1
        box.graph.grid[p0.x][p0.y].weight = 1
        box.graph.grid[p1.x][p1.y].weight = 1

        box.start.weight = 1
        box.move1 = box.move2
        box.result = []
    }
    changeResult(msg) {
        let box = this.map
        let p0 = box.move1
        let p1 = box.move1
        box.graph.grid[p0.x][p0.y].weight = 1
        box.graph.grid[p1.x][p1.y].weight = 1

        box.start.weight = 1
        box.result = msg.result
    }
    update() {
        let box = this.map
        if (box.result.length > 1) {
            box.update()
        }


    }
}
module.exports = Robot1