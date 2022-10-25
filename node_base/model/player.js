let People = require('./people')
class Player extends People {
	constructor(room, id) {
		super(id)
		this.room = room
		this.indexRyId = 0 //当前推送的id
		this.killNum = 0
		
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
}
module.exports = Player
