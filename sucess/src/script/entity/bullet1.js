import utl from "../utl.js"
import FireBg  from './fireBg.js'
export default class Bullet1 extends Laya.Script3D {
	constructor() {
		super();
		
	}
	onAwake() {
		//得到3D对象
	
		console.log(323)
		this.toTiome()
	}
	toTiome() {
		
	}
	onTriggerEnter() {
        // let qiu = utl.main.getChildByName('main')
        // let qb = qiu.getChildByName('box')
        // let car = qb.getChildByName('c1')
        // let out = new Laya.Vector3()
        // car.viewport.project(this.owner.transform.position, car.projectionViewMatrix, out);

        // new FireBg(out.x / Laya.stage.clientScaleX - 30,out.y / Laya.stage.clientScaleY - 30)
		// this.box.removeSelf();
		let box = this.owner.parent.parent
        box.destroy()
	}
    checkStatus(){
		let p1 = this.box.getChildByName('box').getChildByName('fir').transform.position
		for(let e of utl.entitys){
			let box = e.box.getChildByName('box').getChildByName('fly')
			let p2 = box.transform.position
			let length = Laya.Vector3.scalarLength({x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z})
            if(length<10){
                console.log('zhuangdaole')
                e.fuckOver()
            }
		}
	}
	onTriggerStay(other) {
		// console.log("bu--43rrrrr",other);
	}
	onTriggerExit() {
		// console.log("bu--rrrrr");
	}
	onEnable() {
	}
	onDisable() {
	}
}