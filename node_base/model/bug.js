let People = require('./people')
class Bug extends People {
	constructor(house) {
		super()
		this.id = (new Date()).valueOf();
		this.house = house
		this.x = house.x
		this.y = house.y
		this.indexRyId = 0 //当前推送的id
		this.killNum = 0
		this.type=2//2chongzi
		this.status=1
		this.moveX = .1
		this.moveY = .1
		this.time = 0
	}
	getPushMsg() {
		return {
			x:this.x,
			y:this.y,
			id: this.id,
			type:this.type,
			status:this.status
		}
	}
	update() {
		this.time++
		this.x += this.moveX
		this.y += this.moveY
		for (let bug of this.house.room.bugs.values()) {
			if(bug.id!=this.id){
				let lthg = (bug.x-this.x)*(bug.x-this.x)+(bug.y-this.y)*(bug.y-this.y)
				if(lthg<.5){
					this.x -= this.moveX
					this.y -= this.moveY
				}
			}
			
		}
		
		if(this.time%10==0){
			let p = this.findPeople()
			let x = p.x - this.x
			let y = p.y - this.y
			if(Math.abs(x)>Math.abs(y)){
				y = y>0?1/Math.abs(x):-1/Math.abs(x)
				x = x>0?1:-1
			}else{
				x = x>0?1/Math.abs(y):-1/Math.abs(y)
				y = y>0?1:-1
			}
			this.moveX = x/30
			this.moveY = y/30
		}
	}
	findPeople(){
		let p = this.house.room.players
		let ptem = 100
		let ps = [...p][0][1]
		for (let mapObj of p) {
			let obj = mapObj[1]
			let lth = (obj.x-this.x)*(obj.x-this.x)+(obj.y-this.y)*(obj.y-this.y)
			if(lth<ptem){
				ptem = lth
				ps = obj
			}
		}
		return ps
	}
}
module.exports = Bug
