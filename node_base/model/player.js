let People = require('./people')
class Player extends People {
	constructor(room, id) {
		super(id)
		this.room = room
		this.indexRyId = 0 //当前推送的id
		this.killNum = 0
		this.type=1//1人
	}
	getPushMsg() {
		return {
			x:this.x,
			y:this.y,
			id: this.id,
			status:this.status
		}
	}
	addFrame(obj) {
		this.moveX = obj.x
		this.moveY = obj.y
	}
	move(){
		this.x += this.moveX
		this.y += this.moveY
	}
}
module.exports = Player
