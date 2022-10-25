import utl from "../utl.js"
export default class speedTouch {
  constructor() {
    // this.changeSpeed.pos(Laya.stage.width-Laya.stage.height/5, Laya.stage.height/5*3);
    //     this.changeSpeed.graphics.drawRect(0, 0, 100, Laya.stage.height/5*1, "#00000066");
    //     this.changeSpeed.graphics.drawRect(0, 50, 100, 70, "#00bef7");

    // this.width = 100
    // this.height = 20
    this.loadingElse = new Map(utl.loadingElse)
    this.x = 0;
    this.y = 0;
    // this.moveX = 0
    // this.moveY = 0
    this.img = new Laya.Sprite();
    Laya.stage.addChild(this.img);
    // this.img.width = 100
    // this.img.height = 100
    this.img.pos(Laya.stage.width - Laya.stage.height / 5-300, Laya.stage.height / 5 * 3+100);
    

    this.tx =Laya.stage.width - Laya.stage.height / 5-300
    this.twidth = 200
    this.theight =200
    this.ty = Laya.stage.height / 5 * 3+100
  }
  draw() {
    this.img.graphics.drawTexture(Laya.loader.getRes(this.loadingElse.get('contrl')),0,0,200,200);
  }
  scaleBig(e) {
    utl.takeSpeed.z = 0
    console.log('MOUSE_UP')
    utl.tachRightFlag = false
    // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
  }
  outEvent() {
    utl.tachRightFlag = false
  }

  scaleSmall(x, y) {
    if (this.tx< x && x < this.tx + this.twidth  && y > this.ty && y < this.ty + this.theight
    ) {
      utl.fireTf = true
      return true
    } else {
      utl.fireTf = false
      return false
    }
    //缩小至0.8的缓动效果
    // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
  }
  getRoteImg(pobj) {
    let rotate = 0
    if (pobj.x1 == pobj.x2) {
      rotate = 0
    }
    if (pobj.x1 > pobj.x2) {
      let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
      rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90
    } else if (pobj.x1 < pobj.x2) {
      let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
      rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270
    }
    return rotate
  }
  leftFormatMovePosition(px, py) {
    
  }

}