/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
import utl from "../utl.js"
import speedTouch from "../hand/speedTouch.js"
import newTor from "../hand/leftTouch.js"
import fire from "../hand/fire.js"
import Bullet from "../entity/bullet.js"
import Bullet1 from "../entity/bullet1.js"
import Enemy from "../entity/enemy.js"
import Enemy1 from "../entity/enemy1.js"
import { socketMain } from "./net/index"
// import {getServiceAddress} from "../net/index"
let updateFlag = true

let touchs = [
    ['speedTouch', { flag: false, Tclass: speedTouch }],
    ['newTor', { flag: false, Tclass: newTor }],
    ['fire', { flag: false, Tclass: fire }],
    // ['rightTouch',{flag:false,Tclass:rightTouch}],
    // ['leftRote', { flag: false, Tclass: leftRote }],
    // ['rightRote', { flag: false, Tclass: rightRote }]
]


export default class GameUI extends Laya.Scene {
    constructor() {
        super();
        this.isTwoTouch = false
        this.twoFirst = true
        this.fucntkTemp = 0
        this.temprx = 0
        this.tempry = 0
        this.spled = 0
        this.spledy = 0
        this.loadScene("test/weightObservation.scene");
        this.newScene = Laya.stage.addChild(new Laya.Scene3D());
        this.loadingElse = new Map(utl.loadingElse)

        this.townPosition = new Laya.Vector3(0, 40, 0)
        this.outPos = new Laya.Vector3();
        this.onW = new Laya.Vector3(0, 0, 0)
        this.moveTemp = {
            x:0,y:0
        }
        socketMain()

        utl.newScene = this.newScene
        this.initTouch()
        // this.addMouseEvent();
        this.log = '434'
        this.info = new Laya.Text();
        this.info.text = this.log
        this.info.fontSize = 50;
        this.info.color = "#00ff7e";
        this.info.size(Laya.stage.width, Laya.stage.height);
        this.info.pos(50, 50)
        Laya.stage.addChild(this.info);
        utl.info = this.info
        this.drawUi()

        // this.newScene.addChild(utl.models.get('light'));  
        var directionLight = this.newScene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));
        this.newScene.addChild(directionLight);
        // socketMain()



        Laya.timer.loop(30, this, this.flying);
        // Laya.timer.loop(100, this, this.onFire);
        // Laya.timer.loop(30, this, this.fireUpdate);

        // let map2 = utl.models.get('cube')
        // map2.getChildByName('on').active = false
        // console.log(map2)
        // this.newScene.addChild(map2);
        // utl.entityMap.set('cube',map2)

        // let light = utl.models.get('light')
        // // camera.active=false
        // camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

        // utl.light = light
        // this.newScene.addChild(light);
        this.newScene.ambientColor = new Laya.Vector3(1, 1, 1);


        // let town = utl.models.get('town')
        // this.newScene.addChild(town);
        // utl.town = town
        // window.town = town
        // utl.town.transform.position = this.townPosition





        this.pler = utl.models.get('Plane').clone()
        utl.main = this.pler
        this.newScene.addChild(this.pler);


        this.camera = utl.models.get('camera').clone()
        utl.camera = this.camera
        this.newScene.addChild(this.camera);
        // this.pler = utl.models.get('hero').clone()
        // utl.main = this.pler
        // this.newScene.addChild(this.pler);
        // this.creatEntity()
        console.log(utl.models)

    }
    addMouseEvent() {

        //鼠标事件监听
        this.sp.on(Laya.Event.CLICK, this, this.onMouseDown);
    }
    onMouseDown() {
        // let point = new Laya.Vector2();
        // point.x = Laya.MouseManager.instance.mouseX;
        // point.y = Laya.MouseManager.instance.mouseY;
        console.log(6666666666)

    }
    drawUi() {
        this.sp = new Laya.Sprite();
        Laya.stage.addChild(this.sp);
        // let pheight = Laya.stage.height 
        // let {height,width} = Laya.stage
        this.sp.graphics.drawRect(0, 0, 300, 300, "#00000066");
        utl.mapSp = this.sp
        this.addMouseEvent()

        let findImg = new Laya.Image(this.loadingElse.get('tat'));
        findImg.height = 60
        findImg.width = 60
        utl.findImg = findImg
        Laya.stage.addChild(findImg);

        // let rightHandself = this.loadingElse.get('addsStop')
        // let rightHandselfImg = new  Laya.Image(rightHandself);
        // rightHandselfImg.height = 150
        // rightHandselfImg.width =150
        // rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
        // Laya.stage.addChild(rightHandselfImg);

        for (let touch of touchs) {
            touch[1].object.draw(this.loadingElse)
        }





        // let rightHand = this.loadingElse.get('fire')
        // let rightHandImg = new  Laya.Image(rightHand);
        // rightHandImg.height = 200
        // rightHandImg.width =200
        // rightHandImg.pos(Laya.stage.width - 600, Laya.stage.height -400);
        // Laya.stage.addChild(rightHandImg);


        // // let col = this.loadingElse.get('speed')
        // // let dialog = new  Laya.Image(col);
        // // dialog.height = 600
        // // dialog.width =100
        // // dialog.pos(Laya.stage.width - 100, Laya.stage.height - 650);
        // // Laya.stage.addChild(dialog);

        // //-----------add and less speed
        // let lessSpeed = this.loadingElse.get('lessSpeed')
        // let lessSpeedImg = new  Laya.Image(lessSpeed);
        // lessSpeedImg.height = 100
        // lessSpeedImg.width =100
        // lessSpeedImg.pos(Laya.stage.width - 150, Laya.stage.height - 200);
        // Laya.stage.addChild(lessSpeedImg);


        // let addSpeed = this.loadingElse.get('addSpeed')
        // let addSpeedImg = new  Laya.Image(addSpeed);
        // addSpeedImg.height = 100
        // addSpeedImg.width =100
        // addSpeedImg.pos(Laya.stage.width - 150, Laya.stage.height - 350);
        // Laya.stage.addChild(addSpeedImg);
        //-----------add and less speed

    }
    drawPoint() {

        let p = null
        this.sp.graphics.drawCircle(p.x, p.z, 1, "#008982");
    }
    initTouch() {
        for (let touch of touchs) {
            touch[1].object = new touch[1].Tclass()
        }
    }

    updateOneFlay() {
        //  let list = utl.frameTimesMap.get(id)
        //  let pler = utl.flyers.get(id) 

        //  if(utl.frameAddIndex+10<utl.frameGetIndex){
        //      list = []
        //      return
        //  }

        //  if (list&&list.length > 0) {
        let time = frameTimes.shift()
        let plerPosition = new Laya.Vector3(time.x, time.y, time.z)

        // this.plerPosition.x = time.x
        // this.plerPosition.y = time.y
        // this.plerPosition.z = time.z

        this.pler.transform.position = plerPosition
        this.pler.transform.localRotationEulerX = time.rx
        this.pler.transform.localRotationEulerY = time.ry
        this.pler.transform.localRotationEulerZ = time.rz

        this.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx * 2
        this.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy


        // this.townPosition = new Laya.Vector3(time.x, 36, time.z)
        // utl.town.transform.position = this.townPosition
        this.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx



        //  }
    }
    update() {
        this.updateOneFlay()
        //  let fs = utl.flyers
        //  let frams = utl.frameTimesMap

        //  if(utl.frameAddIndex>utl.frameGetIndex+3){
        //      utl.updateFlag = false
        //  }
        //  if(utl.updateFlag){
        //      if(utl.frameAddIndex==utl.frameGetIndex+1){
        //          utl.updateFlag = false
        //      }
        //  }
        //  if(utl.frameAddIndex<=utl.frameGetIndex){
        //      utl.updateFlag = true
        //      return
        //  }
        //  utl.frameGetIndex++
        //  for(let key of frams.keys()){
        //      if(fs.has(key)){
        //          this.updateOneFlay(key)
        //      }else{
        //          let pler = utl.models.get('pler').clone()
        //          this.newScene.addChild(pler);
        //          fs.set(key,pler)
        //          this.updateOneFlay(key)
        //          if(utl.id!=key){
        //              pler.getChildByName('shipmain').getChildByName('g1').active = false
        //          }else{
        //              window.did = pler.getChildByName('shipmain').getChildByName('g1')
        //          }
        //      }
        //  }
        return
        let list = utl.frameTimesMap.get(utl.id)
        if (list && list.length > 0) {
            let time = list.shift()

            this.plerPosition.x = time.x
            this.plerPosition.y = time.y
            this.plerPosition.z = time.z
            this.townPosition.x = time.x
            this.townPosition.z = time.z
            utl.pler.transform.position = this.plerPosition
            utl.town.transform.position = this.townPosition
            utl.pler.transform.localRotationEulerX = time.rx
            utl.pler.transform.localRotationEulerY = time.ry
            utl.pler.transform.localRotationEulerZ = time.rz

            // let sx = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX
            // let sy = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY

            // let nowx = utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX


            utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx
            utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx * 2
            utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy
            // utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx/2

            18310825053
            // let frameObj = {
            //     x: nowx,
            //     sx,
            //     sy
            // }
            // Laya.Tween.to(frameObj, {
            //     x: time.sx,
            //     sx:time.sx*2,
            //     sy:time.sy,
            //     update: new Laya.Handler(this, updateMove, [frameObj])
            // }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, null, [frameObj]), 0);
        }
    }
    creatEntity() {
        for (let i = 0; i < 50; i++) {
            let entity = this.pler.getChildByName('diren').clone()
            this.pler.addChild(entity)
            entity.addComponent(Enemy);
            let fly = entity.getChildByName('box').getChildByName('fly').getChildByName('fly')
            fly.addComponent(Enemy1);
        }
    }
    // onFire() {
    //     if (utl.fireTf) {

    //     }

    // }
    flying() {
        for (let obj of touchs) {
            obj[1].flag = false
        }
        let touchCount = this.newScene.input.touchCount();
        if (1 === touchCount) {
            //判断是否为两指触控，撤去一根手指后引发的touchCount===1
            // if(this.isTwoTouch){
            //     return;
            // }
            let touch = this.newScene.input.getTouch(0);
            for (let obj of touchs) {
                if (obj[1].object.scaleSmall(touch.position.x, touch.position.y)) {
                    obj[1].flag = true
                    obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y)
                } else {
                    obj[1].flag = false
                }
            }

        }
        else if (2 === touchCount) {
            // this.isTwoTouch = true;
            //获取两个触碰点
            let touch = this.newScene.input.getTouch(0);
            let touch2 = this.newScene.input.getTouch(1);
            for (let obj of touchs) {
                if (obj[1].object.scaleSmall(touch.position.x, touch.position.y)) {
                    obj[1].flag = true
                    obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y)
                }
                if (obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                    obj[1].flag = true
                    obj[1].object.leftFormatMovePosition(touch2.position.x, touch2.position.y)
                }
                if (!obj[1].object.scaleSmall(touch.position.x, touch.position.y) && !obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                    obj[1].flag = false
                }
            }


        }
        else if (0 === touchCount) {
            // this.text.text = "触控点归零";
            // this.first = true;
            // this.twoFirst = true;
            // // this.lastPosition.x = 0;
            // // this.lastPosition.y = 0;
            // this.isTwoTouch = false;
            for (let obj of touchs) {
                obj[1].object.scaleSmall(-1000, -1000)//时间归零
                obj[1].flag = false
            }
            utl.move = {
                x:0, y:0, rote:0
            }
        }
        // if(this.newScene.input.getTouch(0)!=0){
        //     utl.takeSpeed.x = utl.tachSpeed.x
        //     utl.takeSpeed.y = utl.tachSpeed.y
        // }
        let touchsMap = new Map(touchs)
        // if (!touchsMap.get('leftRote').flag && !touchsMap.get('rightRote').flag) {
        //     utl.tachSpeed.z = 0
        // }
        // utl.takeSpeed.x = utl.tachSpeed.x
        // utl.takeSpeed.y = utl.tachSpeed.y
        utl.fireTake = utl.fireTach
        // if (!touchsMap.get('newTor').flag) {
        //     utl.tachSpeed.x = 0
        //     utl.tachSpeed.y = 0

        // }
        // if(!fireFlag){
        // utl.fireOnOff = touchsMap.get('rightTouch').flag
        // utl.roteLeftFlag = touchsMap.get('leftRote').flag
        // utl.roteRightFlag = touchsMap.get('rightRote').flag
        // }

        // this.info.text = flagod+','+touchCount
        // this.onFire()
        this.findUpdata()
        let {
            x, y, rote
        } = utl.move
        if(this.moveTemp.x==x&&this.moveTemp.y==y&&x==0&&y==0){
            return
        }else{
            utl.socket.emit('123456', {
                playerId: utl.id,
                frame: { x, y, rote,fireTf:utl.fireTf}
            });
            this.moveTemp = {
                x, y, rote
            }
        }
        
       
    }
    createBox(frame) {
        let mastetr = null
        if (frame.type == 1) {
            mastetr = utl.models.get('hero').clone()
        }
        if (frame.type == 2) {
            mastetr = utl.models.get('diren').clone()
        }
        if (frame.type == 3) {
            mastetr = utl.models.get('house').clone()
        }
        if(frame.type == 4){
            mastetr = utl.models.get('fire3d').clone()
        }
        utl.entitys.set(frame.id, mastetr)
        this.newScene.addChild(mastetr);
        let plerPosition = new Laya.Vector3(frame.x, 2, frame.y)
        mastetr.transform.position = plerPosition
        mastetr.isFuck = true
    }
    flyUpdate(frames) {
        for (let frame of frames) {
            if (utl.entitys.has(frame.id)) {
                let obj = utl.entitys.get(frame.id)
                obj.isFuck = true
                let plerPosition = new Laya.Vector3(frame.x, 2, frame.y)
                if (frame.id == utl.id) {
                    this.temprx = frame.x - obj.transform.position.x
                    this.tempry = frame.y - obj.transform.position.z
                }
                obj.transform.position = plerPosition
            } else {
                this.createBox(frame)
            }

        }
        for (let eng of utl.entitys.values()) {
            if(!eng.isFuck){
                eng.destroy();
            }else{
                eng.isFuck = false
            }
		}
    }
    findUpdata() {
        if (utl.frames.length == 0) {
            updateFlag = false
            return
        }
        if (!updateFlag) {
            if (utl.frames.length < 2) {
                return
            } else {
                updateFlag = true
            }
        }
        let time = utl.frames.shift()
        this.flyUpdate(time.list)
        if (utl.frames.length > 20) {
            utl.frames = []
        }
        if (utl.entitys.has(utl.id)) {
            let obj = utl.entitys.get(utl.id)

            this.camera.viewport.project(obj.transform.position, this.camera.projectionViewMatrix, this.outPos);
            this.moveCarma()
            // console.log(this.outPos)
        }

        // utl.findImg.pos(this.outPos.x / Laya.stage.clientScaleX - 30, this.outPos.y / Laya.stage.clientScaleY - 30)
    }
    moveCarma() {
        let out = this.outPos
        if (out.x > Laya.stage.width / 4 * 3) {
            this.camera.transform.translate(new Laya.Vector3(-this.temprx, 0, 0), true)
        }
        if (out.x < Laya.stage.width / 4) {
            this.camera.transform.translate(new Laya.Vector3(-this.temprx, 0, 0), true)
        }
        if (out.y > Laya.stage.height / 4 * 3) {
            this.camera.transform.translate(new Laya.Vector3(0, this.tempry, 0), true)
        }
        if (out.y < Laya.stage.height / 4) {
            this.camera.transform.translate(new Laya.Vector3(0, this.tempry, 0), true)
        }
    }
    fireUpdate() {
        for (let fir of utl.firs) {
            fir.toTiome()
        }
    }
    getTakeSpeed() {
        if (utl.tachSpeed.x < utl.takeSpeed.x) {
            utl.takeSpeed.x -= 5
        }
        if (utl.tachSpeed.x > utl.takeSpeed.x) {
            utl.takeSpeed.x += 5
        }
        if (utl.tachSpeed.y < utl.takeSpeed.y) {
            utl.takeSpeed.y -= 5
        }
        if (utl.tachSpeed.y > utl.takeSpeed.y) {
            utl.takeSpeed.y += 5
        }
        // utl.takeSpeed.x = utl.tachSpeed.x
        // utl.takeSpeed.y = utl.tachSpeed.y
    }
    getFrame() {
        let { x, y, z } = utl.kui.transform.position
        let rx = utl.kui.transform.localRotationEulerX
        let ry = utl.kui.transform.localRotationEulerY
        let rz = utl.kui.transform.localRotationEulerZ
        let sx = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX
        let sy = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerZ

        //  utl.socket.emit('123456',{
        //      playerId:utl.id,
        //      frame:{ x, y, z, rx, ry, rz, sx, sy }
        //  });


        frameTimes.push({ x, y, z, rx, ry, rz, sx, sy })
    }
    downSpeed() {
        // if(utl.takeSpeed.z.toFixed(1)==.01){
        //     utl.takeSpeed.y=0
        // }
        // if(utl.takeSpeed.z.toFixed(1)==.01){
        //     utl.takeSpeed.y=0
        // }
        // if(utl.takeSpeed.z.toFixed(1)==.01){
        //     utl.takeSpeed.y=0
        // }
        // let touchCount = this.newScene.input.touchCount();
        // if (touchCount == 0) {
        // let l = utl.kui.getChildByName('Cube').getChildByName('left')
        // let r = utl.kui.getChildByName('Cube').getChildByName('right')

        // let vl = utl.kui.transform.rotationEuler
        // utl.kui.transform.rotationEuler = new Laya.Vector3(-90, vl.y, vl.z)
        //  = this.onW 
        // utl.takeSpeed.y = 0
        // utl.takeSpeed.x = 0
        // utl.takeSpeed.z = 0
        if (utl.tachSpeed.x < 0) {
            utl.tachSpeed.x += 5
        }
        if (utl.tachSpeed.x > 0) {
            utl.tachSpeed.x -= 5
        }
        if (utl.tachSpeed.y < 0) {
            utl.tachSpeed.y += 5
        }
        if (utl.tachSpeed.y > 0) {
            utl.tachSpeed.y -= 5
        }

        // if (utl.fireTach.x < 0) {
        //     utl.fireTach.x += 5
        // }
        // if (utl.fireTach.x > 0) {
        //     utl.fireTach.x -= 5
        // }
        // if (utl.fireTach.y < 0) {
        //     utl.fireTach.y += 5
        // }
        // if (utl.fireTach.y > 0) {
        //     utl.fireTach.y -= 5
        // }



        // if (utl.tachSpeed.z < 0) {
        //     utl.tachSpeed.z += 5
        // }
        // if (utl.tachSpeed.z > 0) {
        //     utl.tachSpeed.z -= 5
        // }


        // let td =  Math.abs(utl.kui.transform.rotationEuler.x+90)
        //  if(utl.kui.transform.rotationEuler.x<-89){ 
        //     let vl = utl.kui.transform.rotationEuler
        //     utl.kui.transform.rotationEuler = new Laya.Vector3(vl.x+td/10, vl.y, vl.z)
        // }
        // if(utl.kui.transform.rotationEuler.x>-91){ 
        //     let vl = utl.kui.transform.rotationEuler
        //     utl.kui.transform.rotationEuler = new Laya.Vector3(vl.x-td/10, vl.y, vl.z)
        // }





        // }else{
        this.getTakeSpeed()
        // }
    }
    gunMove() {
        let ship = utl.box.getChildByName('camermain')
        let acObj = ship.getChildByName('ac')



        if (utl.roteGun.x != utl.roteGunTemp.x) {
            if (Math.abs(utl.roteGun.x - utl.roteGunTemp.x) > .1) {
                utl.roteGunTemp.x = utl.roteGun.x > utl.roteGunTemp.x ? utl.roteGunTemp.x + .1 : utl.roteGunTemp.x - .1
            } else {
                if (utl.roteGun.x == 0) {
                    utl.roteGunTemp.x = 0
                }

            }
        }
        if (utl.roteGun.y != utl.roteGunTemp.y) {
            if (Math.abs(utl.roteGun.y - utl.roteGunTemp.y) > .1) {
                utl.roteGunTemp.y = utl.roteGun.y > utl.roteGunTemp.y ? utl.roteGunTemp.y + .1 : utl.roteGunTemp.y - .1
            } else {
                if (utl.roteGun.y == 0) {
                    utl.roteGunTemp.y = 0
                }

            }
        }
        let x = utl.roteGunTemp.x
        let y = utl.roteGunTemp.y




        acObj.transform.rotate(new Laya.Vector3(0, 0, -utl.roteGunback.y * Math.PI / 180), true);
        acObj.transform.rotate(new Laya.Vector3(0, -utl.roteGunback.x * Math.PI / 180, 0), true);

        acObj.transform.rotate(new Laya.Vector3(0, x * Math.PI / 180, 0), true);
        acObj.transform.rotate(new Laya.Vector3(0, 0, y * Math.PI / 180), true);



        utl.roteGunback.x = x
        utl.roteGunback.y = y
    }
    checkFire() {
        let bmain = utl.bullet.getChildByName('ship')
        let bcube = bmain.getChildByName('Cube')
        let from = bcube.getChildByName('e1').transform.position
        let to = bcube.getChildByName('e2').transform.position
        this.newScene.physicsSimulation.raycastFromTo(from, to, utl.hitResult);
        if (utl.hitResult.collider && utl.hitResult.collider.owner.name == 'baga') {
            // utl.hitResult.collider.owner.active=false 
            // console.log(utl.hitResult.normal) 
            // utl.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            // console.log(1111)
        }

        // console.log(utl.hitResult.collider)
    }


}
