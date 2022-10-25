import utl from "../utl.js"
export default class Bullet extends Laya.Script3D {
	constructor() {
		super();
		this.tempy = 0
		this.box = null;
		this.time = 0
		this.speed = .1;
		this.xiang = new Laya.Vector3(0,0,0)
	}
	onAwake() {
		//得到3D对象
		this.box = this.owner;
		utl.firs.add(this)
		let qiu = utl.main.getChildByName('main')
		let box = qiu.getChildByName('box')
		
		let fly = box.getChildByName('fly')
		let tat = box.getChildByName('tat')
		let ship = fly.getChildByName('ship')

		 Laya.Vector3.subtract(tat.transform.position, ship.transform.position,this.xiang)
		// let temp = utl.firSpeed
		this.spple = (utl.firSpeed + 0.43333740234375) - 5
		this.ff = utl.takeSpeed.x
		
		this.toTiome()
	}
	toTiome() {
		this.time++
		if (!this.box.destroyed) {
			this.box.transform.rotate(new Laya.Vector3(utl.boxSpeed,0,0 ), true)
			let lo1 = this.box.getChildByName('box').getChildByName('fir')
			// let bo = this.box.getChildByName('box')
			// let lo2 = bo.transform.localPosition
			// let firs = this.spple
			// bo.transform.localPosition = new Laya.Vector3(.0001,0,0)
			let bo = this.box.getChildByName('box')
			let lo2 = bo.transform.localPosition
			// let firs = this.spple
			bo.transform.localPosition = new Laya.Vector3(lo2.x,this.ff / 100000+lo2.y,lo2.z)
			lo1.transform.translate(new Laya.Vector3(this.xiang.x/20,this.xiang.y/20, this.xiang.z/20), false)
			// this.box.transform.position.x = utl.firSpeed.x
			this.checkStatus()
			if (this.time > 200) {
				utl.firs.delete(this.box)
				this.box.destroy();

			}
		}
	}
	checkStatus(){
		let p1 = this.box.getChildByName('box').getChildByName('fir').transform.position
		for(let e of utl.entitys){
			let box = e.box.getChildByName('box').getChildByName('fly')
			let p2 = box.transform.position
			let length = Laya.Vector3.scalarLength({x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z})
            if(length<.1){
                console.log('zhuangdaole')
                e.fuckOver()
            }
		}
	}
	// checkStatus(){
	// 	let p1 = this.box.getChildByName('box').getChildByName('fir').transform.position
	// 	for(let e of utl.entitys){
	// 		let box = e.box.getChildByName('box').getChildByName('fly')
	// 		let p2 = box.transform.position
	// 		let length = Laya.Vector3.scalarLength({x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z})
		
	// 	}
	// }
	
	onEnable() {
	}
	onDisable() {
	}
}