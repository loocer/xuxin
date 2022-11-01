let Bug = require('./bug')
class House {
    constructor(room, { x, y }) {
        this.id = (new Date()).valueOf();
        this.room = room
        this.x = x
        this.y = y
        this.indexRyId = 0 //当前推送的id
        this.killNum = 0
        this.type = 3
        this.time = 0
        this.status = 1
    }
    getPushMsg() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            type: this.type,
            status: this.status
        }
    }
    createBug() {
        if (this.room.bugs.size < 30) {
            let bug = new Bug(this)
            this.room.bugs.set(bug.id, bug)
        }

    }
    update() {
        // this.move()
        this.time++
        if (this.time % 100 == 0) {
            this.createBug()
        }
    }
}
module.exports = House
