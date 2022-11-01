import utl from "../utl.js"
export default class newTwo {
  constructor() {
    this.scaleTime = 100;
    this.width = Laya.stage.width / 2
    this.height = Laya.stage.height
    this.x = 0;
    this.y = 0;
    this.moveX = 0
    this.moveY = 0

    this.tx = 300
    this.twidth = 450
    this.theight = 450
    this.ty = Laya.stage.height - 600;
    this.out = new Laya.Vector3(0, 0,0)
  }
  draw(loadingElse) {
    let leftHand = loadingElse.get('contrl')
    let leftHandImg = new Laya.Image(leftHand);
    leftHandImg.height = 450
    leftHandImg.width = 450
    leftHandImg.pos(300, Laya.stage.height - 600);
    Laya.stage.addChild(leftHandImg);
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
    if (0 < x && x < this.tx + this.twidth + 200 && y > this.ty - 80 && y < this.ty + this.theight + 80
    ) {
      return true
    } else {
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

    // utl.ani.play("hello");
    let pobj = {}
    let tempx = 0
    let tempy = 0
    pobj.x1 = px //点击
    pobj.x2 = this.tx + this.twidth / 2
    pobj.y1 = py
    pobj.y2 = this.ty + this.theight / 2
    if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) > 1) {
      tempx = 1
    } else {
      tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2)
    }
    if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) < -1) {
      tempx = -1
    } else {
      tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2)
    }
    if ((py - this.ty - this.theight / 2) / (this.theight / 2) > 1) {
      tempy = 1
    } else {
      tempy = (py - this.ty - this.theight / 2) / (this.theight / 2)
    }
    if ((py - this.ty - this.theight / 2) / (this.theight / 2) < -1) {
      tempy = -1
    } else {
      tempy = (py - this.ty - this.theight / 2) / (this.theight / 2)
    }
    Laya.Vector3.normalize(new Laya.Vector3(tempx, tempy,0),this.out)
    let y =-this.out.y/10
    let x = -this.out.x/10
    // utl.testPs.x += x
    // utl.testPs.y += y
    // utl.frames.push([{ id:utl.id,x:utl.testPs.x, y:utl.testPs.y }])
     utl.socket.emit('123456',{
             playerId:utl.id,
             frame:{ x, y}
         });

    // if (utl.tachSpeed.x > 180) {
    //   utl.tachSpeed.x = 180
    // }
    // if (utl.tachSpeed.x < -180) {
    //   utl.tachSpeed.x = -180
    // }
    // if (utl.tachSpeed.y > 90) {
    //   utl.tachSpeed.y = 90
    // }
    // if (utl.tachSpeed.y < -90) {
    //   utl.tachSpeed.y = -90
    // }
    // let frameObj = {
    //   x:utl.tachSpeed.x,
    //   y:utl.tachSpeed.y
    // }
    // Laya.Tween.to(utl.tachSpeed, {
    //   x: -tempy * 180,
    //   y:-tempx * 90,
    //   update: new Laya.Handler(this, null, [utl.tachSpeed])
    // }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, null, [utl.tachSpeed]), 0);
    // let pobj = {}
    // pobj.x1 = px //点击
    // pobj.x2 =this.tx + this.twidth/2
    // pobj.y1 = py
    // pobj.y2 = this.ty + this.theight/2
    // let inv = new Laya.Vector3(pobj.x1 - pobj.x2,0,pobj.y1 - pobj.y2)
    // let out = new Laya.Vector3()
    // Laya.Vector3.normalize(inv, out)
    // console.log(inv,out)
    // if(utl.sendTime==utl.messgeTime){
    //    console.log('-------6666666-----',utl.cube.transform.rotationEuler)
    //   utl.sendTime++
    //   utl.rote = this.getRoteImg(pobj) 
    //   let x = utl.netBox.x+out.z
    //   let z = utl.netBox.z-out.x
    //   utl.sendMessage = [{
    //     id:utl.id,
    //     position:{x:utl.netBox.x,
    //       z:utl.netBox.z},
    //     tar:{x,z},
    //     sendTime:utl.sendTime,
    //     type:'move',
    //     move:out,
    //     rotationEuler:utl.cube.transform.rotationEuler,
    //     rote:this.getRoteImg(pobj) 
    //   }]

    // }
  }

}