let People = require('./people')
class Fire {
  constructor(room,obj) {
    this.id = (new Date()).valueOf();
    this.room = room
    this.type = 4//1人
    this.status = 1
    this.x = obj.x
    this.y = obj.y
    this.moveX = obj.move.x*3
    this.moveY = obj.move.y*3
  }
  getPushMsg() {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
      id: this.id,
      status: this.status
    }
  }
  update() {
    if(!this.status){
      this.room.fires.delete(this.id)
      return
    }
    this.check()
    this.move()
  }
  check() {
    for (let bug of this.room.bugs.values()) {
      let lthg = (bug.x - this.x) * (bug.x - this.x) + (bug.y - this.y) * (bug.y - this.y)
      if (lthg < .5 + bug.r) {
        this.status = 0
        this.room.bugs.delete(bug.id)
        return
      }
    }
  }
  move() {
    this.x += this.moveX
    this.y += this.moveY
  }

}
module.exports = Fire
