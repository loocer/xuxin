let Player = require('./player')
let boxs = require('../tools/rooms')
class Room {
	constructor() {
		this.players = new Map()
		this.id = '123456';
	}

	addPlayer(id) {
		let player = new Player(this, id)
		this.players.set(id, player)
		return player
	}
	update(io) {
		let list = []
		for (let obj of this.players.values()) {
			obj.update()
			list.push(obj.getPushMsg())
		}
		this.pushMsg(list,io)
	}
	receive(msg, io) { //{playerId:0}}
		let {
			players
		} = this
		if (players.has(msg.playerId)) {
			let p = players.get(msg.playerId)
			p.addFrame(msg.frame)
		} else {
			let p = this.addPlayer(msg.playerId)
			p.addFrame(msg.frame)
		}
	}
	work(io) {
		setInterval(() => {
			this.update(io)
		}, 30)
	}
	pushMsg(list, io) {
		io.emit(this.id, {
			list
		});
	}
}
module.exports = Room
