import utl from "../utl.js"
// Math.floor(Math.random() * (max - min + 1)) + min;
export default class Enemy1 extends Laya.Script3D {
	constructor() {
		super();
		
	}
	onAwake() {
        console.log(567)
	}
	onTriggerEnter()
	{
        // let box = this.owner.parent.parent.parent
        // box.visible = false
		// console.log("bu--233333",this);
	}
	onTriggerStay(e)
	{
		// console.log("bu--onTriggerStay1111",e);
	}
	onTriggerExit()
	{
		// console.log("bu--22222");
	}
	onEnable() {
	} 
	onDisable() {
	}
}