import utl from "../utl.js"
// Math.floor(Math.random() * (max - min + 1)) + min;
export default class Enemy extends Laya.Script3D {
	constructor() {
		super();
		this.tempy = 0
		this.box = null;
		this.time = 0
		this.speed = .0006;
		this.takeSpeed= {
			x:0,
			y:0
		}
		this.tempSpeed= {
			x:-90,
			y:90
		}
	}
	onAwake() {
		//得到3D对象
		this.box = this.owner;
		utl.entitys.add(this)
		let x=Math.floor(Math.random() * (90 +90 + 1)) -90;
		let y=Math.floor(Math.random() * (90 +90 + 1)) -90;
		
		this.box.transform.rotate(new Laya.Vector3( 0,0,y * Math.PI / 180 / 100 ), true)
		this.box.transform.rotate(new Laya.Vector3(-x, 0,0 ), true)
		this.toTiome()
	}
	fuckOver(){
		this.box.destroy()
		utl.entitys.delete(this)
	}
	toTiome(){
		
		if(!this.box.destroyed){
			this.time++
            this.box.transform.rotate(new Laya.Vector3(-this.speed, 0,0 ), true)
			this.box.transform.rotate(new Laya.Vector3( 0,0,this.takeSpeed.y * Math.PI / 180 / 100 ), true)
			let box = this.box.getChildByName('box')
			box.transform.translate(new Laya.Vector3(0,0,this.takeSpeed.x/10000), true)
			let leng = Laya.Vector3.scalarLength(box.transform.position)
			if(leng<36.1){
				box.transform.translate(new Laya.Vector3(0,  0,-this.takeSpeed.x/10000), true)
			}
			if(leng<40){
				box.transform.translate(new Laya.Vector3(0,  0,-this.takeSpeed.x/10000), true)
			}
			box.getChildByName('fly').transform.localRotationEulerX = this.takeSpeed.x/5 
        	box.getChildByName('fly').transform.localRotationEulerY = -this.takeSpeed.y / 2
			if (this.tempSpeed.x < this.takeSpeed.x) {
				this.takeSpeed.x -= 2
			}
			if (this.tempSpeed.x > this.takeSpeed.x) {
				this.takeSpeed.x += 2
			}
			if (this.tempSpeed.y < this.takeSpeed.y) {
				this.takeSpeed.y -= 2
			}
			if (this.tempSpeed.y > this.takeSpeed.y) {
				this.takeSpeed.y += 2
			}
			
            // this.box.transform.translate(new Laya.Vector3(0,-this.speed,0),true)
			if(this.time%800==0 ){
				let x=Math.floor(Math.random() * (90 +90 + 1)) -90;
				let y=Math.floor(Math.random() * (90 +90 + 1)) -90;
				this.tempSpeed= {
					x,
					y
				}
			}
		}
	}
	onStart() {}

	onTriggerEnter()
	{
	    this.box.removeSelf();
		console.log("bu--onTriggerEnter");
	}
	onTriggerStay()
	{
		console.log("bu--onTriggerStay");
	}
	onTriggerExit()
	{
		console.log("bu--onTriggerExit");
	}
	onEnable() {
	} 
	onDisable() {
	}
}