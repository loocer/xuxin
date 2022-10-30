class People {
	constructor(id) {
		this.id = id;
		this.bleed = 10
		this.state = true
		this.x = 0
		this.y = 0
		this.moveX = 0
		this.moveY = 0
	}
	update(){
		this.move()
	}
}
module.exports = People
