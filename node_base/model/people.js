class People {
	constructor(id) {
		this.id = id;
		this.state = true
		this.x = 0
		this.y = 0
		this.moveX = 0
		this.moveY = 0
	}
	move(){
		this.x += this.moveX
		this.y += this.moveY
	}
	update(){
		this.move()
	}
}
module.exports = People
