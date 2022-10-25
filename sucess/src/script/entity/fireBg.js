import utl from "../utl.js"
export default class FireBg{
	constructor(x,y) {
		this.time = 0
        this.visible = true
        this.draw(x,y)
	}
	onAwake() {
		//得到3D对象
        utl.firBgs.add(this)
		console.log(323)
		this.toTiome()
	}
    draw(x,y){
        this.sp = new Laya.Sprite();
        Laya.stage.addChild(this.sp);
        // let pheight = Laya.stage.height 
        // let {height,width} = Laya.stage
        this.sp.graphics.drawPoly(x, y, [0, 10, 5, 0, 10, 10], "#ffffff");
        utl.mapSp = this.sp
    }
	toTiome() {
		this.time++
        if(this.time>5){
            this.sp.visible = false
            this.visible = false
            utl.firBgs.delete(this)
        }
	}
	onTriggerEnter() {
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