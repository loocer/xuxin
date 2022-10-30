(function () {
   'use strict';

   var utl = {
       id:Date.parse(new  Date())+'',
       entitys:new Map(),
       frames:[],
       testPs:{
           x:0,
           y:0
       },



       frameTimesMap:new Map(),
       frameGetIndex:0,
       frameAddIndex:0,
       playerId:'zzw',
       allBleed:100,
       updateFlag:true,
       stopFlag:true,

       firs:new Set(),//子弹
       firBgs:new Set(),
       boxSpeed:0.001,//飞机速度
       firSpeed:new Laya.Vector3(0,0,0),//子弹速度
       updateDraw:null,
       fireTf:false,
       pColor:{
           'p1':'#00ffff',
           'p2':'#0000ff'
       },
       buttonStatus:{
           addHero:false
       },

      

       playStatusObj:{
           doingIndex:1//打开页面1，观察。2：游戏
       },
   	
   	box:null,
       userId:Date.parse(new  Date())+'',
       models:new Map(),
       // realBox:null,
       // box4:null,
       camera:null,
      
       target:{
           x:0,
           y:0
       },
       // roteGun:{
       //     x:0,
       //     y:0
       // },
       // roteGunback:{
       //     x:0,
       //     y:0
       // },
       // roteGunTemp:{
       //     x:0,
       //     y:0
       // },
       flySpeed:-.1,
       tachSpeed:{
           z:0,//
       	x:0,
       	y:0
       },
       takeSpeed:{
       	z:0,//
       	x:0,
       	y:0
       },
       tempSpeed:{
       	z:0,//
       	x:0,
       	y:0
       },
       fireTach :{

       },
       fireTake:{

       },
       // roteLeftFlag:false,
       // roteRightFlag:false,
       heroMap:new Map(),
       // operationYype:1,//1:虚拟手柄 2:屏幕方向
       loadIndex:0,
       // fireOnOff:false,
       msType:'move',
       // updates:[],
       // firs:[],
       loadingElse:[
            ['contrl','res/controll.png'],
            ['fire','res/controll.png'],
            ['tat','res/tatget.png'],
           // ['tdf','https://xuxin.love/img/fly/u=3199317496,3290195022&fm=26&gp=0.jpg'],
           // ['fire','https://xuxin.love/img/fly/fires.png'],
           // ['left','https://xuxin.love/img/fly/left.png'],
           // ['right','https://xuxin.love/img/fly/right.png'],
           // ['speed','https://xuxin.love/img/fly/speed.png'],
           // ['lessSpeed','https://xuxin.love/img/fly/lessSpeed.png'],
           // ['addSpeed','https://xuxin.love/img/fly/addSpeed.png']
       ],
       loadingSprite3D:[
           ['light','res/LayaScene_SampleScene/Directional Light.lh'],
           ['cube','res/LayaScene_SampleScene/Cube.lh'],
           ['camera','res/LayaScene_SampleScene/Main Camera.lh'],
           ['terrain','res/LayaScene_SampleScene/Terrain.lh'],

           // ['light','https://xuxin.love/img/fly/LayaScene/Conventional/light.lh'],
           // ['pler','https://xuxin.love/img/fly/LayaScene/Conventional/pler.lh'],
           // ['cube','https://xuxin.love/img/fly/LayaScene/Conventional/Sphere.lh'],
           // ['aum','https://xuxin.love/img/fly/LayaScene/Conventional/aum.lh'],
           // ['sun','https://xuxin.love/img/fly/LayaScene/Conventional/sun.lh'],
           // ['bullet','https://xuxin.love/img/fly/LayaScene/Conventional/b.lh'],

       ],
       getAngle:(x, y)=> {
           var l = Math.sqrt(x*x + y*y);
           var a = Math.acos(x/l);
           var ret = a * 180 / Math.PI; //弧度转角度，方便调试
           if (y < 0) {
               return 360 - ret;
           }
           return ret;
       }
   };

   class newTwo {
     constructor() {
       this.scaleTime = 100;
       this.width = Laya.stage.width / 2;
       this.height = Laya.stage.height;
       this.x = 0;
       this.y = 0;
       this.moveX = 0;
       this.moveY = 0;

       this.tx = 300;
       this.twidth = 450;
       this.theight = 450;
       this.ty = Laya.stage.height - 600;
     }
     draw(loadingElse) {
       let leftHand = loadingElse.get('contrl');
       let leftHandImg = new Laya.Image(leftHand);
       leftHandImg.height = 450;
       leftHandImg.width = 450;
       leftHandImg.pos(300, Laya.stage.height - 600);
       Laya.stage.addChild(leftHandImg);
     }
     scaleBig(e) {
       utl.takeSpeed.z = 0;
       console.log('MOUSE_UP');
       utl.tachRightFlag = false;
       // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
     }
     outEvent() {
       utl.tachRightFlag = false;
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
       let rotate = 0;
       if (pobj.x1 == pobj.x2) {
         rotate = 0;
       }
       if (pobj.x1 > pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
       } else if (pobj.x1 < pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
       }
       return rotate
     }
     leftFormatMovePosition(px, py) {

       // utl.ani.play("hello");
       let pobj = {};
       let tempx = 0;
       let tempy = 0;
       pobj.x1 = px; //点击
       pobj.x2 = this.tx + this.twidth / 2;
       pobj.y1 = py;
       pobj.y2 = this.ty + this.theight / 2;
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) > 1) {
         tempx = 1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) < -1) {
         tempx = -1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) > 1) {
         tempy = 1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) < -1) {
         tempy = -1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       let y = -tempy/10;
       let x = -tempx/10;
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

   class speedTouch {
     constructor() {
       // this.changeSpeed.pos(Laya.stage.width-Laya.stage.height/5, Laya.stage.height/5*3);
       //     this.changeSpeed.graphics.drawRect(0, 0, 100, Laya.stage.height/5*1, "#00000066");
       //     this.changeSpeed.graphics.drawRect(0, 50, 100, 70, "#00bef7");

       // this.width = 100
       // this.height = 20
       this.loadingElse = new Map(utl.loadingElse);
       this.x = 0;
       this.y = 0;
       // this.moveX = 0
       // this.moveY = 0
       this.img = new Laya.Sprite();
       Laya.stage.addChild(this.img);
       // this.img.width = 100
       // this.img.height = 100
       this.img.pos(Laya.stage.width - Laya.stage.height / 5-300, Laya.stage.height / 5 * 3+100);
       

       this.tx =Laya.stage.width - Laya.stage.height / 5-300;
       this.twidth = 200;
       this.theight =200;
       this.ty = Laya.stage.height / 5 * 3+100;
     }
     draw() {
       this.img.graphics.drawTexture(Laya.loader.getRes(this.loadingElse.get('contrl')),0,0,200,200);
     }
     scaleBig(e) {
       utl.takeSpeed.z = 0;
       console.log('MOUSE_UP');
       utl.tachRightFlag = false;
       // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
     }
     outEvent() {
       utl.tachRightFlag = false;
     }

     scaleSmall(x, y) {
       if (this.tx< x && x < this.tx + this.twidth  && y > this.ty && y < this.ty + this.theight
       ) {
         utl.fireTf = true;
         return true
       } else {
         utl.fireTf = false;
         return false
       }
       //缩小至0.8的缓动效果
       // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
     }
     getRoteImg(pobj) {
       let rotate = 0;
       if (pobj.x1 == pobj.x2) {
         rotate = 0;
       }
       if (pobj.x1 > pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
       } else if (pobj.x1 < pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
       }
       return rotate
     }
     leftFormatMovePosition(px, py) {
       
     }

   }

   class Bullet extends Laya.Script3D {
   	constructor() {
   		super();
   		this.tempy = 0;
   		this.box = null;
   		this.time = 0;
   		this.speed = .1;
   		this.xiang = new Laya.Vector3(0,0,0);
   	}
   	onAwake() {
   		//得到3D对象
   		this.box = this.owner;
   		utl.firs.add(this);
   		let qiu = utl.main.getChildByName('main');
   		let box = qiu.getChildByName('box');
   		
   		let fly = box.getChildByName('fly');
   		let tat = box.getChildByName('tat');
   		let ship = fly.getChildByName('ship');

   		 Laya.Vector3.subtract(tat.transform.position, ship.transform.position,this.xiang);
   		// let temp = utl.firSpeed
   		this.spple = (utl.firSpeed + 0.43333740234375) - 5;
   		this.ff = utl.takeSpeed.x;
   		
   		this.toTiome();
   	}
   	toTiome() {
   		this.time++;
   		if (!this.box.destroyed) {
   			this.box.transform.rotate(new Laya.Vector3(utl.boxSpeed,0,0 ), true);
   			let lo1 = this.box.getChildByName('box').getChildByName('fir');
   			// let bo = this.box.getChildByName('box')
   			// let lo2 = bo.transform.localPosition
   			// let firs = this.spple
   			// bo.transform.localPosition = new Laya.Vector3(.0001,0,0)
   			let bo = this.box.getChildByName('box');
   			let lo2 = bo.transform.localPosition;
   			// let firs = this.spple
   			bo.transform.localPosition = new Laya.Vector3(lo2.x,this.ff / 100000+lo2.y,lo2.z);
   			lo1.transform.translate(new Laya.Vector3(this.xiang.x/20,this.xiang.y/20, this.xiang.z/20), false);
   			// this.box.transform.position.x = utl.firSpeed.x
   			this.checkStatus();
   			if (this.time > 200) {
   				utl.firs.delete(this.box);
   				this.box.destroy();

   			}
   		}
   	}
   	checkStatus(){
   		let p1 = this.box.getChildByName('box').getChildByName('fir').transform.position;
   		for(let e of utl.entitys){
   			let box = e.box.getChildByName('box').getChildByName('fly');
   			let p2 = box.transform.position;
   			let length = Laya.Vector3.scalarLength({x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z});
               if(length<.1){
                   console.log('zhuangdaole');
                   e.fuckOver();
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

   class newTwo$1 {
     constructor() {
       this.x = 0;
       this.y = 0;

       this.tx = Laya.stage.width - 600;

       this.twidth = 200;
       this.theight = 200;
       this.ty = Laya.stage.height - 400;
       this.tempX = 0;
       this.tempY = 0;
     }
     scaleBig(e) {
       utl.takeSpeed.z = 0;
       console.log('MOUSE_UP');
       utl.tachRightFlag = false;
       // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
     }
     outEvent() {
       utl.tachRightFlag = false;
     }
     onFire() {
       let aum = utl.bullet.clone();
       let script = aum.addComponent(Bullet);
       utl.newScene.addChild(aum);
     }
     scaleSmall(x, y) {
       if (this.tx - 0 < x && x < this.tx + this.twidth + 0 && y > this.ty - 0 && y < this.ty + this.theight + 0
       ) {
         utl.fireOnOff = true;
         return true
       } else {
         return false
       }
       //缩小至0.8的缓动效果
       // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
     }
     getRoteImg(pobj) {
       let rotate = 0;
       if (pobj.x1 == pobj.x2) {
         rotate = 0;
       }
       if (pobj.x1 > pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
       } else if (pobj.x1 < pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
       }
       return rotate
     }
     leftFormatMovePosition(px, py) {
       let pobj = {};
       let tempx = 0;
       let tempy = 0;
       pobj.x1 = px; //点击
       pobj.x2 = this.tx + this.twidth / 2;
       pobj.y1 = py;
       pobj.y2 = this.ty + this.theight / 2;
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) > 1) {
         tempx = 1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) < -1) {
         tempx = -1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) > 1) {
         tempy = 1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) < -1) {
         tempy = -1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       let x = tempy * 5;
       let y = tempx * 5;
       utl.frames.push({
         playerId: utl.id,
         frame: { x, y }
       });
       // utl.socket.emit('123456', {
       //   playerId: utl.id,
       //   frame: { x, y }
       // });


     }

   }

   class leftRote {
     constructor() {
       this.scaleTime = 100;
       this.width = Laya.stage.width / 2;
       this.height = Laya.stage.height;
       this.x = 0;
       this.y = 0;
       this.moveX = 0;
       this.moveY = 0;

       this.tx = Laya.stage.width - 400;
       this.twidth = 200;
       this.theight = 200;
       this.ty = Laya.stage.height - 400;
     }
     draw(loadingElse) {
       console.log(1234556);
       let leftHand = loadingElse.get('contrl');
       let leftHandImg = new Laya.Image(leftHand);
       leftHandImg.height = 200;
       leftHandImg.width = 200;
       leftHandImg.pos(Laya.stage.width - 400, Laya.stage.height - 400);
       Laya.stage.addChild(leftHandImg);
     }
     scaleBig(e) {
       utl.takeSpeed.z = 0;
       console.log('MOUSE_UP');
       utl.tachRightFlag = false;
       // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
     }
     outEvent() {
       utl.tachRightFlag = false;
     }

     scaleSmall(x, y) {
       if (this.tx < x && x < this.tx + this.twidth && this.ty < y && y < this.ty + this.theight
       ) {
         console.log(y, this.ty, this.ty + this.theight);
         return true
       } else {
         return false
       }
       //缩小至0.8的缓动效果
       // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
     }
     getRoteImg(pobj) {
       let rotate = 0;
       if (pobj.x1 == pobj.x2) {
         rotate = 0;
       }
       if (pobj.x1 > pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
       } else if (pobj.x1 < pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
       }
       return rotate
     }
     leftFormatMovePosition(px, py) {
       let pobj = {};
       let tempx = 0;
       let tempy = 0;
       pobj.x1 = px; //点击
       pobj.x2 = this.tx + this.twidth / 2;
       pobj.y1 = py;
       pobj.y2 = this.ty + this.theight / 2;
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) > 1) {
         tempx = 1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((px - this.tx - this.twidth / 2) / (this.twidth / 2) < -1) {
         tempx = -1;
       } else {
         tempx = (px - this.tx - this.twidth / 2) / (this.twidth / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) > 1) {
         tempy = 1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       if ((py - this.ty - this.theight / 2) / (this.theight / 2) < -1) {
         tempy = -1;
       } else {
         tempy = (py - this.ty - this.theight / 2) / (this.theight / 2);
       }
       utl.fireTach = {
         y:tempy*90,
         x:tempx*90
       };
       console.log(tempy,tempx);
     }

   }

   class rightRote{
       constructor(){
               this.scaleTime = 100;
               this.width = Laya.stage.width/2; 
               this.height = Laya.stage.height;
               this.x = 0;
               this.y = 0;
               this.moveX = 0;
               this.moveY = 0;

               this.tx= Laya.stage.width  -700;
               this.twidth = 200;
               this.theight = 200;
               this.ty = Laya.stage.height - 400;
           }
           draw(loadingElse) {
             console.log(1234556);
             let leftHand = loadingElse.get('contrl');
             let leftHandImg = new Laya.Image(leftHand);
             leftHandImg.height = 200;
             leftHandImg.width = 200;
             leftHandImg.pos(this.tx, Laya.stage.height - 400);
             Laya.stage.addChild(leftHandImg);
           }
          scaleBig(e)
           {        
               utl.takeSpeed.z = 0;
               console.log('MOUSE_UP');
               utl.tachRightFlag = false;
               // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
           }
           outEvent(){
             utl.tachRightFlag = false;
           }
         
          scaleSmall(x,y)
           {    
             if(this.tx<x&&x<this.tx+this.twidth&&this.ty<y&&y<this.ty+this.theight
               ){
               console.log(y,this.ty,this.ty+this.theight);
               return true
             }else{
               return false
             }
               //缩小至0.8的缓动效果
               // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
           }
           getRoteImg(pobj) {
             let rotate = 0;
             if (pobj.x1 == pobj.x2){
               rotate=0;
             }
             if (pobj.x1 > pobj.x2) {
               let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
               rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
             } else if (pobj.x1 < pobj.x2) {
               let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
               rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
             }
             return rotate
           }
           leftFormatMovePosition(px,py) {
             utl.tachSpeed.z = -60;
           }

   }

   // Math.floor(Math.random() * (max - min + 1)) + min;
   class Enemy extends Laya.Script3D {
   	constructor() {
   		super();
   		this.tempy = 0;
   		this.box = null;
   		this.time = 0;
   		this.speed = .0006;
   		this.takeSpeed= {
   			x:0,
   			y:0
   		};
   		this.tempSpeed= {
   			x:-90,
   			y:90
   		};
   	}
   	onAwake() {
   		//得到3D对象
   		this.box = this.owner;
   		utl.entitys.add(this);
   		let x=Math.floor(Math.random() * (90 +90 + 1)) -90;
   		let y=Math.floor(Math.random() * (90 +90 + 1)) -90;
   		
   		this.box.transform.rotate(new Laya.Vector3( 0,0,y * Math.PI / 180 / 100 ), true);
   		this.box.transform.rotate(new Laya.Vector3(-x, 0,0 ), true);
   		this.toTiome();
   	}
   	fuckOver(){
   		this.box.destroy();
   		utl.entitys.delete(this);
   	}
   	toTiome(){
   		
   		if(!this.box.destroyed){
   			this.time++;
               this.box.transform.rotate(new Laya.Vector3(-this.speed, 0,0 ), true);
   			this.box.transform.rotate(new Laya.Vector3( 0,0,this.takeSpeed.y * Math.PI / 180 / 100 ), true);
   			let box = this.box.getChildByName('box');
   			box.transform.translate(new Laya.Vector3(0,0,this.takeSpeed.x/10000), true);
   			let leng = Laya.Vector3.scalarLength(box.transform.position);
   			if(leng<36.1){
   				box.transform.translate(new Laya.Vector3(0,  0,-this.takeSpeed.x/10000), true);
   			}
   			if(leng<40){
   				box.transform.translate(new Laya.Vector3(0,  0,-this.takeSpeed.x/10000), true);
   			}
   			box.getChildByName('fly').transform.localRotationEulerX = this.takeSpeed.x/5; 
           	box.getChildByName('fly').transform.localRotationEulerY = -this.takeSpeed.y / 2;
   			if (this.tempSpeed.x < this.takeSpeed.x) {
   				this.takeSpeed.x -= 2;
   			}
   			if (this.tempSpeed.x > this.takeSpeed.x) {
   				this.takeSpeed.x += 2;
   			}
   			if (this.tempSpeed.y < this.takeSpeed.y) {
   				this.takeSpeed.y -= 2;
   			}
   			if (this.tempSpeed.y > this.takeSpeed.y) {
   				this.takeSpeed.y += 2;
   			}
   			
               // this.box.transform.translate(new Laya.Vector3(0,-this.speed,0),true)
   			if(this.time%800==0 ){
   				let x=Math.floor(Math.random() * (90 +90 + 1)) -90;
   				let y=Math.floor(Math.random() * (90 +90 + 1)) -90;
   				this.tempSpeed= {
   					x,
   					y
   				};
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

   let address = 'http://172.16.25.101:3000';

   let Event = Laya.Event;
   let result = {};
   // var io = require("../io.js");
   let websocket = null;
   let timeFrame = new Map();


   const getServiceAddress = () => {
   	let hr = new HttpRequest();

   	function onHttpRequestProgress(e) {
   		console.log(123);
   	}

   	function onHttpRequestComplete(e) {
   		result.serviceAddress = JSON.parse(hr.data).data;
   		login();
   		console.log(3458888, result);
   	}

   	function onHttpRequestError(e) {
   		console.log(534543, e);
   	}
   	hr.once(Event.PROGRESS, undefined, onHttpRequestProgress);
   	hr.once(Event.COMPLETE, undefined, onHttpRequestComplete);
   	hr.once(Event.ERROR, undefined, onHttpRequestError);
   	hr.send(address + '/get-socketAddress', '', 'get', 'text');

   };

   const socketMain = () => {
   	// const socket = new WebSocket('ws://xuxin.love:3000');
   	// // wx.connectSocket({
   	// //   url: 'ws://xuxin.love:3000'
   	// // })
   	// // wx.onSocketOpen(function(res) {
   	// //  wx.onSocketMessage((e)=>{
   	// //  	console.log(e)
   	// //  })

   	// // })
   	// return
   	// utl.socket = io('ws://192.168.0.104:3000');
   	// utl.socket = io('http://121.196.222.174:3000');
   	utl.socket = io('https://hunchun828.top');
   	utl.socket.on(utl.id, (s) => {
   		if(s.list.length==0){
   			return
   		}
   		utl.frameAddIndex++;
   		for(let obj of s.list){
   			if(utl.frameTimesMap.has(obj.id)){
   				utl.frameTimesMap.get(obj.id).push(...obj.list);
   			}else{
   				utl.frameTimesMap.set(obj.id,obj.list);
   			}
   		}
   		
   	});
   	utl.socket.on('event', function(data) {});
   	utl.socket.on('disconnect', function() {});
   	//------------------------------web-------------------
   };

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
   // import {getServiceAddress} from "../net/index"
   let temp = 0, spled = { x: 0, y: 0, z: 0 }, dfew = 0;
   let flagod = false;
   let fireFlag = false;
   let touchs = [
       // ['newTouch',{flag:false,Tclass:newTouch}],
       ['newTor', { flag: false, Tclass: newTwo }],
       // ['fire',{flag:false,Tclass:fire}],
       // ['rightTouch',{flag:false,Tclass:rightTouch}],
       ['leftRote', { flag: false, Tclass: leftRote }],
       ['rightRote', { flag: false, Tclass: rightRote }]
   ];
   window.dfg = -60;
   let flag = true;

   // function updateMove(obj) {
   //     utl.box.transform.translate(new Laya.Vector3(utl.speedMove / 5, 0, 0), true)
   // }
   function updateMove(value) {
       utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = value.x;
       utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = value.sx;
       utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = value.sy;
   }
   let frameTimes$1 = [];
   class GameUI extends Laya.Scene {
       constructor() {
           super();
           this.isTwoTouch = false;
           this.twoFirst = true;
           this.fucntkTemp = 0;
           this.temprx = 0;
           this.tempry = 0;
           this.temprz = 0;
           this.spled = 0;
           this.spledy = 0;
           this.loadScene("test/game1.scene");
           this.newScene = Laya.stage.addChild(new Laya.Scene3D());
           this.loadingElse = new Map(utl.loadingElse);
          
           this.townPosition = new Laya.Vector3(0, 40, 0);
           this.onW = new Laya.Vector3(0, 0, 0, 0);
           socketMain();

           utl.newScene = this.newScene;
           this.initTouch();
           // this.addMouseEvent();
           this.log = '434';
           this.info = new Laya.Text();
           this.info.text = this.log;
           this.info.fontSize = 50;
           this.info.color = "#00ff7e";
           this.info.size(Laya.stage.width, Laya.stage.height);
           this.info.pos(310, 10);
           Laya.stage.addChild(this.info);
           utl.info = this.info;
           this.drawUi();
           temp = this;

           // this.newScene.addChild(utl.models.get('light'));  
           // var directionLight = this.newScene.addChild(new Laya.DirectionLight());
           // directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
           // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));

           // socketMain()



           Laya.timer.loop(30, this, this.flying);
           // Laya.timer.loop(30, this, this.update);

           // let map2 = utl.models.get('cube')
           // map2.getChildByName('on').active = false
           // console.log(map2)
           // this.newScene.addChild(map2);
           // utl.entityMap.set('cube',map2)

           let light = utl.models.get('light');
           // // camera.active=false
           // camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

           utl.light = light;
           this.newScene.addChild(light);



           let town = utl.models.get('town');
           this.newScene.addChild(town);
           utl.town = town;
           window.town = town;
           utl.town.transform.position = this.townPosition;


           

           let kui = utl.models.get('kui');
           utl.kui = kui;
           this.newScene.addChild(kui);

           let plane = utl.models.get('plane');
           utl.plane = plane;
           window.pan = plane;
           this.newScene.addChild(plane);
           // let pas = plane.getChildByName('pas')
           // for (let i = 1; i < 6; i++) {
           //     let tp = plane.getChildByName('p' + i)

           //     tp.addChild(pas.clone())
           // }
           // let g2 = this.pler.getChildByName('shipmain').getChildByName('g2')
           // g2.normalizedViewport = new Laya.Viewport(.75, 0.0, 0.4, 0.4);

       }
       addMouseEvent() {

           //鼠标事件监听
           this.sp.on(Laya.Event.CLICK, this, this.onMouseDown);
       }
       onMouseDown() {
           // let point = new Laya.Vector2();
           // point.x = Laya.MouseManager.instance.mouseX;
           // point.y = Laya.MouseManager.instance.mouseY;
           console.log(6666666666);

       }
       drawPoint(x,z){
           this.sp.graphics.drawCircle(x,z, 1, "#008982");
       }
       drawUi() {
           this.sp = new Laya.Sprite();
           Laya.stage.addChild(this.sp);
           this.sp.graphics.drawRect(0, 0, 300, 300, "#00000066");
           utl.mapSp = this.sp;
           this.addMouseEvent();
           let adds = this.loadingElse.get('addsStop');
           let addsImg = new Laya.Image(adds);
           addsImg.height = 150;
           addsImg.width = 150;
           addsImg.pos(200, Laya.stage.height - 200);
           utl.addsImg = addsImg;
           Laya.stage.addChild(addsImg);


           // let rightHandself = this.loadingElse.get('addsStop')
           // let rightHandselfImg = new  Laya.Image(rightHandself);
           // rightHandselfImg.height = 150
           // rightHandselfImg.width =150
           // rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
           // Laya.stage.addChild(rightHandselfImg);

           for (let touch of touchs) {
               touch[1].object.draw(this.loadingElse);
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
       initTouch() {
           for (let touch of touchs) {
               touch[1].object = new touch[1].Tclass();
           }
       }
       onFire() {
           if (utl.fireOnOff) {
               utl.msType = 'FIRE';
               // let ship = utl.box.getChildByName('shipmain')
               // let shipcar = ship.getChildByName('ship')
               // let aum =utl.bullet.clone();

               // // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
               // let script = aum.addComponent(Bullet);
               // this.newScene.addChild(aum)
           }

       }
       updateOneFlay(id){
           let list = utl.frameTimesMap.get(id);
           let pler = utl.flyers.get(id); 

           if (list&&list.length > 20) {
               utl.frameTimesMap.set(id,[]);
               return
           }

           if (list&&list.length > 0) {
               let time = list.shift();
               let plerPosition = new Laya.Vector3( time.x, time.y, time.z);
               
               // this.plerPosition.x = time.x
               // this.plerPosition.y = time.y
               // this.plerPosition.z = time.z
              
               pler.transform.position = plerPosition;
               pler.transform.localRotationEulerX = time.rx;
               pler.transform.localRotationEulerY = time.ry;
               pler.transform.localRotationEulerZ = time.rz;

               // let sx = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX
               // let sy = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY

               // let nowx = utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX


               
               pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx*2;
               pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy;

               if(id==utl.id){
                   // this.townPosition.x = time.x
                   // this.townPosition.z = time.z
                   this.townPosition = new Laya.Vector3( time.x, 36, time.z);
                   utl.town.transform.position = this.townPosition;
                   pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx;
                   this.sp.graphics.drawCircle((time.x+300)/600*300,(time.z+300)/600*300, 3, "#ff0000");
               }else{
                   // this.drawPoint((time.x+300)/600*300,(time.z+300)/600*300)
                   this.sp.graphics.drawCircle((time.x+300)/600*300,(time.z+300)/600*300, 3, "#008982");
               }

               // utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx/2


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
       contFrame(){
           if(utl.stopFlag){
               if(utl.frameAddIndex>utl.frameGetIndex+10){
                   utl.stopFlag = false;
               }
           }else{
               if(utl.frameAddIndex==utl.frameGetIndex){
                   utl.stopFlag = true;
               }
           }
          
       }
       update() {
           this.sp.graphics.clear();
           this.sp.graphics.drawRect(0, 0, 300, 300, "#00000066");
           let fs = utl.flyers;
           let frams = utl.frameTimesMap;
           this.log = utl.frameAddIndex-utl.frameGetIndex+"|"+utl.frameTimesMap.size;
           utl.info.text = this.log;
           this.contFrame();
           if(utl.stopFlag){
               return
           }
           

           utl.frameGetIndex++;
           if(utl.frameAddIndex>20+utl.frameGetIndex){
               for(let fkey of frams.keys()){
                   frams.set(fkey,[]);
               }
               utl.frameGetIndex =utl.frameAddIndex;
               return
           }
           for(let key of frams.keys()){
               
               if(fs.has(key)){
                   this.updateOneFlay(key);
               }else{
                   let pler = utl.models.get('pler').clone();
                   this.newScene.addChild(pler);
                   fs.set(key,pler);
                   this.updateOneFlay(key);
                   if(utl.id!=key){
                       pler.getChildByName('shipmain').getChildByName('g1').active = false;
                   }else{
                       let g2 = pler.getChildByName('shipmain').getChildByName('g2');
                       g2.normalizedViewport = new Laya.Viewport(.75, 0.0, 0.4, 0.4);
                       // window.did = pler.getChildByName('shipmain').getChildByName('g1')
                   }
               }
           }
           return
           let list = utl.frameTimesMap.get(utl.id);
           if (list&&list.length > 0) {
               let time = list.shift();

               this.plerPosition.x = time.x;
               this.plerPosition.y = time.y;
               this.plerPosition.z = time.z;
               this.townPosition.x = time.x;
               this.townPosition.z = time.z;
               utl.pler.transform.position = this.plerPosition;
               utl.town.transform.position = this.townPosition;
               utl.pler.transform.localRotationEulerX = time.rx;
               utl.pler.transform.localRotationEulerY = time.ry;
               utl.pler.transform.localRotationEulerZ = time.rz;

               // let sx = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX
               // let sy = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY

               // let nowx = utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX


               utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx;
               utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx*2;
               utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy;
               // utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx/2


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
       flying() {
           for (let obj of touchs) {
               obj[1].flag = false;
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
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y);
                   } else {
                       obj[1].flag = false;
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
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y);
                   }
                   if (obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch2.position.x, touch2.position.y);
                   }
                   if (!obj[1].object.scaleSmall(touch.position.x, touch.position.y) && !obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                       obj[1].flag = false;
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
               // utl.takeSpeed.x = 0
               // utl.takeSpeed.y = 0
           }
           let touchsMap = new Map(touchs);
           if (!touchsMap.get('leftRote').flag && !touchsMap.get('rightRote').flag) {
               utl.tachSpeed.z = 0;
           }
           if (!touchsMap.get('newTor').flag) {
               utl.tachSpeed.x = 0;
               utl.tachSpeed.y = 0;
               // Laya.Tween.to(utl.tachSpeed, {
               //     y:0,
               //     update: new Laya.Handler(this, null, [utl.tachSpeed])
               //   }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, null, [utl.tachSpeed]), 0);
           }
           // if(!fireFlag){
           // utl.fireOnOff = touchsMap.get('rightTouch').flag
           // utl.roteLeftFlag = touchsMap.get('leftRote').flag
           // utl.roteRightFlag = touchsMap.get('rightRote').flag
           // }
           // this.info.text = flagod+','+touchCount
           this.flyUpdate();
           this.update();
       }
       flyUpdate() {
           this.getTakeSpeed();
           utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = -utl.takeSpeed.x / 6;
           utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerZ = utl.takeSpeed.y / 2;
           let serviceX = Math.abs(utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerZ);
           let serviceY = Math.abs(utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX);

           let speed = 0;
           if (serviceX > serviceY) {
               speed = (45 - serviceX) / 45 * utl.flySpeed + 1 / 2 * utl.flySpeed;
           } else {
               speed = (45 - serviceY) / 45 * utl.flySpeed + 1 / 2 * utl.flySpeed;
           }



           // utl.kui.transform.rotate(new Laya.Vector3(0, 0, -utl.takeSpeed.y * Math.PI / 180 / 50), true)
           // utl.kui.transform.rotate(new Laya.Vector3(0, -utl.tempSpeed.z * Math.PI / 180 / 50, 0), true)
           // utl.kui.transform.rotate(new Laya.Vector3(utl.takeSpeed.x * Math.PI / 180 / 50, 0, 0), true)


           // utl.kui.transform.rotate(new Laya.Vector3(-utl.takeSpeed.x * Math.PI / 180 / 50, 0, 0), true)//上下
           // utl.kui.transform.rotate(new Laya.Vector3(0, utl.takeSpeed.z * Math.PI / 180 / 50, 0), true)
           utl.kui.transform.rotate(new Laya.Vector3(0, 0, utl.takeSpeed.y * Math.PI / 180 / 50), true);
           utl.kui.transform.translate(new Laya.Vector3(0, speed, 0), true);
           let op = utl.kui.transform.position;
           op.y += utl.takeSpeed.x / 900;
           utl.kui.transform.position = op;
           let vl = utl.kui.transform.rotationEuler;

           if(op.x>300){
               op.x=300;
           }
           if(op.x<-300){
               op.x=-300;
           }
            if(op.z>300){
               op.z=300;
           }
           if(op.z<-300){
               op.z=-300;
           }

           if(op.y>60){
               // op.y=60
               op.y-=(op.y-60);
           }
           if(op.y<.5){
               op.y=.5;
           }
           utl.kui.transform.position = op;
           // console.log(vl)
           // utl.kui.transform.rotationEuler = new Laya.Vector3(window.dfg, vl.y, vl.z)


           // if(){

           // }

           // if(Math.abs(utl.takeSpeed.y)>Math.abs(utl.takeSpeed.x)){
           //     utl.kui.transform.rotate(new Laya.Vector3(0, 30 * Math.PI / 180 / 50, 0), true)
           // }else if(Math.abs(utl.takeSpeed.y)<Math.abs(utl.takeSpeed.x)){
           //     utl.kui.transform.rotate(new Laya.Vector3(0, -30 * Math.PI / 180 / 50, 0), true)
           // }
           // utl.tempSpeed = utl.takeSpeed
           // console.log(utl.kui.transform.rotationEuler.y)
           this.downSpeed();
           this.getFrame();
           // console.log(utl.kui.transform.rotationEuler.x,utl.kui.transform.rotationEuler.y,utl.kui.transform.rotationEuler.z)
       }
       getTakeSpeed() {
           if (utl.tachSpeed.x < utl.takeSpeed.x) {
               utl.takeSpeed.x -= 2;
           }
           if (utl.tachSpeed.x > utl.takeSpeed.x) {
               utl.takeSpeed.x += 2;
           }
           if (utl.tachSpeed.y < utl.takeSpeed.y) {
               utl.takeSpeed.y -= 2;
           }
           if (utl.tachSpeed.y > utl.takeSpeed.y) {
               utl.takeSpeed.y += 2;
           }
           // utl.takeSpeed.x = utl.tachSpeed.x
           // utl.takeSpeed.y = utl.tachSpeed.y
       }
       getFrame() {
           let { x, y, z } = utl.kui.transform.position;
           let rx = utl.kui.transform.localRotationEulerX;
           let ry = utl.kui.transform.localRotationEulerY;
           let rz = utl.kui.transform.localRotationEulerZ;
           let sx = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX;
           let sy = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerZ;
           // let str = JSON.stringify({
           //     playerId:utl.id,
           //     frame:{ x, y, z, rx, ry, rz, sx, sy }
           // });
           utl.socket.emit('123456',{
               playerId:utl.id,
               frame:{ x, y, z, rx, ry, rz, sx, sy }
           });
          
           
           // frameTimes.push({ x, y, z, rx, ry, rz, sx, sy })
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
           let touchCount = this.newScene.input.touchCount();
           if (touchCount == 0) {
               // let l = utl.kui.getChildByName('Cube').getChildByName('left')
               // let r = utl.kui.getChildByName('Cube').getChildByName('right')

               // let vl = utl.kui.transform.rotationEuler
               // utl.kui.transform.rotationEuler = new Laya.Vector3(-90, vl.y, vl.z)
               //  = this.onW 
               // utl.takeSpeed.y = 0
               // utl.takeSpeed.x = 0
               // utl.takeSpeed.z = 0
               // if(utl.tachSpeed.x<0){ 
               //     utl.tachSpeed.x+=5
               // }
               // if(utl.tachSpeed.x>0){
               //     utl.tachSpeed.x-=5
               // }
               // if(utl.tachSpeed.y<0){ 
               //     utl.tachSpeed.y+=5
               // }
               // if(utl.tachSpeed.y>0){
               //     utl.tachSpeed.y-=5
               // }
               if (utl.tachSpeed.z < 0) {
                   utl.tachSpeed.z += 5;
               }
               if (utl.tachSpeed.z > 0) {
                   utl.tachSpeed.z -= 5;
               }


               // let td =  Math.abs(utl.kui.transform.rotationEuler.x+90)
               //  if(utl.kui.transform.rotationEuler.x<-89){ 
               //     let vl = utl.kui.transform.rotationEuler
               //     utl.kui.transform.rotationEuler = new Laya.Vector3(vl.x+td/10, vl.y, vl.z)
               // }
               // if(utl.kui.transform.rotationEuler.x>-91){ 
               //     let vl = utl.kui.transform.rotationEuler
               //     utl.kui.transform.rotationEuler = new Laya.Vector3(vl.x-td/10, vl.y, vl.z)
               // }





           }
       }
       gunMove() {
           let ship = utl.box.getChildByName('camermain');
           let acObj = ship.getChildByName('ac');



           if (utl.roteGun.x != utl.roteGunTemp.x) {
               if (Math.abs(utl.roteGun.x - utl.roteGunTemp.x) > .1) {
                   utl.roteGunTemp.x = utl.roteGun.x > utl.roteGunTemp.x ? utl.roteGunTemp.x + .1 : utl.roteGunTemp.x - .1;
               } else {
                   if (utl.roteGun.x == 0) {
                       utl.roteGunTemp.x = 0;
                   }

               }
           }
           if (utl.roteGun.y != utl.roteGunTemp.y) {
               if (Math.abs(utl.roteGun.y - utl.roteGunTemp.y) > .1) {
                   utl.roteGunTemp.y = utl.roteGun.y > utl.roteGunTemp.y ? utl.roteGunTemp.y + .1 : utl.roteGunTemp.y - .1;
               } else {
                   if (utl.roteGun.y == 0) {
                       utl.roteGunTemp.y = 0;
                   }

               }
           }
           let x = utl.roteGunTemp.x;
           let y = utl.roteGunTemp.y;




           acObj.transform.rotate(new Laya.Vector3(0, 0, -utl.roteGunback.y * Math.PI / 180), true);
           acObj.transform.rotate(new Laya.Vector3(0, -utl.roteGunback.x * Math.PI / 180, 0), true);

           acObj.transform.rotate(new Laya.Vector3(0, x * Math.PI / 180, 0), true);
           acObj.transform.rotate(new Laya.Vector3(0, 0, y * Math.PI / 180), true);



           utl.roteGunback.x = x;
           utl.roteGunback.y = y;
       }
       checkFire() {
           let bmain = utl.bullet.getChildByName('ship');
           let bcube = bmain.getChildByName('Cube');
           let from = bcube.getChildByName('e1').transform.position;
           let to = bcube.getChildByName('e2').transform.position;
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

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
   class InitUI extends Laya.Scene {
       constructor() {
           super();
           this.loadScene("test/init.scene");
           this.info = new Laya.Text();
           this.info.fontSize = 50;
           this.info.color = "#FFFFFF";
           this.info.size(Laya.stage.width, Laya.stage.height);
           this.info.x = Laya.stage.width/2;
           this.info.y = 380;
          Laya.stage.addChild(this.info);
       }

       
   }

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
   let ls = [
       {index:2,title:'start game'},
       {index:3,title:'start observer'}
   ];
   class Level extends Laya.Scene {
       constructor() {
           super();
           this.loadScene("test/level.scene");
           
           this.isTouchFlag = false;
           this.touchPosition = {
               position:{
                   x:0
               }
           };
           this.touchDown = {};
           this.touchUp = {};
           this.boxLangth = 3;
           this.boxedLangth = 0;

           this.newScene = new Laya.Scene3D();
           Laya.stage.addChild(this.newScene);
           this.createText();
           // this.doLoad();
           //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
           this.camera = new Laya.Camera(0, 0.1, 1000);
           this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
           this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
           
           //相机设置清楚标记,使用固定颜色
           this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
           //使用默认的颜色
           //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
           //设置摄像机视野范围（角度）
           this.camera.fieldOfView = 45;
           //为相机添加视角控制组件(脚本)
           this.newScene.addChild(this.camera);
           
           // //添加平行光
           // let directionLight = new Laya.DirectionLight();
           // scene.addChild(directionLight);
           // //设置平行光颜色
           // directionLight.color = new Laya.Vector3(1, 1, 1);
           // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
           



           // let sprited = new Laya.Sprite3D();
           // scene.addChild(sprited);
           // //正方体
           // let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
           // sprited.addChild(box1);
           
           // box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
          




           // let sprite = new Laya.Sprite3D();
           // scene.addChild(sprite);
           // //正方体
           // let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31)
           // this.box = new Laya.MeshSprite3D(tem);
           // sprite.addChild(this.box);
           //  var material = new Laya.BlinnPhongMaterial();
           // // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
           // //         material.albedoTexture = tex;
           // // }));
           // material.albedoColor=new Laya.Vector3(.5,.5,2);
           // material.diffuseColor=new Laya.Vector3(.5,.5,2);
           // this.box.meshRenderer.material = material;

           // let scale = new Laya.Vector3(0, 1, 1);
           // this.box.transform.localScale = scale;
           // let scale1 = new Laya.Vector3(1, 1, 1);
           // this.box.transform.localScale = scale1;
           // this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
           this.createLevel();
           Laya.timer.loop(30,this,this.onUpdate);
           Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
           Laya.stage.on(Laya.Event.MOUSE_UP,this, this.onMouseUp);
          
       }
       onMouseUp(){
           let point = {};
           let outHitResult = new Laya.HitResult(); 
           let _outHitAllInfo = new Array();
           point.x = Laya.MouseManager.instance.mouseX;
           point.y = Laya.MouseManager.instance.mouseY;
           if(
               Math.abs(point.x - this.touchDown.x)<5&&
               Math.abs(point.y - this.touchDown.y)<5){
               let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
               //产生射线
               this.camera.viewportPointToRay(point,ray);
               //拿到射线碰撞的物体
               this.newScene.physicsSimulation.rayCast(ray,outHitResult);
               //如果碰撞到物体
               // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
                if (outHitResult.succeeded){
                    let index = outHitResult.collider.owner.parent.name.charAt(0);
                    index++;
                    if(index==1){
                       utl.playStatusObj = {
                           doingIndex:1
                       };
                       this.removeSelf();
                       Laya.stage.offAll();
                       Laya.Scene.open('test/players.scene');
                    }
                    if(index==2){
                       utl.playStatusObj = {
                           doingIndex:2
                       };
                       this.removeSelf();
                       Laya.stage.offAll();
                       Laya.Scene.open('test/load.scene');
                    }
                    
                }
               
           }
       }
       onMouseDown() {
           //记录点击到舞台上的点
           let point = {};
           let outHitResult = new Laya.HitResult(); 
           let _outHitAllInfo = new Array();
           point.x = Laya.MouseManager.instance.mouseX;
           point.y = Laya.MouseManager.instance.mouseY;
           this.touchDown = point;
           let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
           //产生射线
           this.camera.viewportPointToRay(point,ray);
           //拿到射线碰撞的物体
           this.newScene.physicsSimulation.rayCast(ray,outHitResult);
           //如果碰撞到物体
           // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
           if (outHitResult.succeeded){
               console.log(outHitResult.collider.owner.parent.name);
           }
           
           // if (outHitResult.succeeded)
           // {
           //     //删除碰撞到的物体
           //     // this.text.text = "碰撞到了" + this.outHitResult.collider.owner.name ;
           //     console.log("碰撞到物体！！",this.outHitResult.collider.owner.name)
           // }
       }
       onUpdate() {
           let touchCount = this.newScene.input.touchCount();

           if(touchCount!=0){
                let touchPosition  = this.newScene.input.getTouch(0);

               if(this.touchPosition){
                   this.isTouchFlag = true;
                   let movePositionx = this.touchPosition - touchPosition.position.x;
                   this.camera.transform.translate(new Laya.Vector3(movePositionx/80,0, 0));
                   this.updatatxt();
                   this.touchPosition = touchPosition.position.x;
               }else{
                   this.touchPosition = touchPosition.position.x;
               }
               // console.log(3333333,this.touchPosition.position.x - touchPosition.position.x)
               
           }else{
               this.touchPosition = null;
               this.isTouchFlag = false;
           }

        }  
        updatatxt(){
            for(let i in ls){
                let box = this.newScene.getChildByName(i+'flckbox');
                let info = Laya.stage.getChildByName(i+'flcktxt');
                let outPos =  new Laya.Vector3();
                this.camera.viewport.project(box.transform.position, this.camera.projectionViewMatrix, outPos);
                info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
            }
             
        } 
       createLevel(){
           
           let initx = 0;
           let color = new Laya.Vector3(1,5,1);
           let textColor = '#1aff00';
           for(let i in ls){
               if(utl.playStatusObj.doingIndex==i){
                   color = new Laya.Vector3(5,5,5);
                   textColor = '#000000';
               }else if(i>utl.playStatusObj.doingIndex){
                   color = new Laya.Vector3(0,0,0);
                   textColor = '#ffffff';
               }else{
                   color = new Laya.Vector3(1,5,1);
                   textColor = '#FF1B16'; 
               }
               let sprite = new Laya.Sprite3D();
               this.newScene.addChild(sprite);
               //正方体
               let tem = Laya.PrimitiveMesh.createBox(1, 1, 1);
               let box = new Laya.MeshSprite3D(tem);
               sprite.name = i + 'flckbox';
               sprite.addChild(box);
               let material = new Laya.BlinnPhongMaterial();
               material.albedoColor=color;
               material.diffuseColor=color;
               box.meshRenderer.material = material;
               sprite.transform.position = new Laya.Vector3(initx - 2*i, -1, 0);

               let rigidBody = box.addComponent(Laya.Rigidbody3D);
               let boxShape = new Laya.BoxColliderShape(1, 1, 1);
               rigidBody.colliderShape = boxShape;
               rigidBody.linearFactor=new Laya.Vector3(0, 0, 0);
               // rigidBody.mass = 0;







               let info = new Laya.Text();
               let outPos =  new Laya.Vector3();
               info.text = ls[i].title;
               info.fontSize = 40;
               info.name = i+ 'flcktxt';
               info.color = textColor;
               info.width = 50;
               info.font = "Microsoft YaHei";
               info.bold = true;
               info.size(Laya.stage.width, Laya.stage.height);
               Laya.stage.addChild(info);  
               this.camera.viewport.project(sprite.transform.position, this.camera.projectionViewMatrix, outPos);
               info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
           }

       }
       downLoadSprite3D(load){
           return new Promise((resolve, reject)=>{
               Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                   utl.models.set(load[0],sp);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       Laya.Scene.open('test/main.scene');
                   }
                   resolve();
               }));
           })
       }
       downLoad(load){
           return new Promise((resolve, reject)=>{
               Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                   utl.models.set(load[0],texture);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       Laya.Scene.open('test/main.scene');
                   }
                   resolve();
               }));
           })
       }
       doLoad(){
           utl.loadIndex = 0;
           for(let obj of utl.loadingSprite3D){
               this.downLoadSprite3D(obj);
           }
           for(let objElse of utl.loadingElse){
               this.downLoad(objElse);
           }
       }
       createText() {
           const 
               Text = Laya.Text;
           
           this.txt = new Text();
           Laya.stage.addChild(this.txt);
           //给文本的text属性赋值
           this.txt.text = '左右滑动屏幕选择进入关卡';
           //设置宽度，高度自动匹配
           this.txt.width = 500;
           //自动换行
           this.txt.wordWrap = true;

           this.txt.align = "center";
           this.txt.fontSize = 40;
           this.txt.font = "Microsoft YaHei";
           this.txt.color = "#1aff00";
           this.txt.bold = true;
           this.txt.leading = 5;

           // //设置描边属性
           // txt.stroke = 10;
           // txt.strokeColor = "#00ffc6";

           // txt.borderColor = "#00ffc6";

           this.txt.x = (Laya.stage.width - this.txt.width) / 2;
           this.txt.y = Laya.stage.height -100;
       }
       
   }

   const loadFile =  [
   	[
           // ['light','res/LayaScene_fly/Conventional/light.lh'],
           // ['town','res/LayaScene_fly/Conventional/town.lh'],
           // ['pler','res/LayaScene_fly/Conventional/pler.lh'],
           // ['kui','res/LayaScene_fly/Conventional/kui.lh'],
           // ['plane','res/LayaScene_fly/Conventional/dimian.lh'],
   		['light','https://hunchun828.top/img/LayaScene_fly/Conventional/light.lh'],
           ['town','https://hunchun828.top/img/LayaScene_fly/Conventional/town.lh'],
           ['pler','https://hunchun828.top/img/LayaScene_fly/Conventional/pler.lh'],
           ['kui','https://hunchun828.top/img/LayaScene_fly/Conventional/kui.lh'],
           ['plane','https://hunchun828.top/img/LayaScene_fly/Conventional/dimian.lh'],
   	],
       [
           // ['light','https://hunchun828.top/img/LayaScene_start/Conventional/light.lh'],
           // ['Plane','https://hunchun828.top/img/LayaScene_start/Conventional/Plane.lh'],
           // ['bullet','https://hunchun828.top/img/LayaScene_start/Conventional/bullet.lh'],
           // ['monster','https://hunchun828.top/img/LayaScene_start/Conventional/bullet.lh'],
           ['Plane','res/LayaScene_SampleScene/Conventional/Plane.lh'],
           ['hero','res/LayaScene_SampleScene/Conventional/hero.lh'],
           // ['bullet','res/LayaScene_start/Conventional/bullet.lh'],
           
           // ['light','https://hunchun828.top/img/LayaScene_fly/Conventional/light.lh'],
           // ['town','https://hunchun828.top/img/LayaScene_fly/Conventional/town.lh'],
           // ['pler','https://hunchun828.top/img/LayaScene_fly/Conventional/pler.lh'],
           // ['kui','https://hunchun828.top/img/LayaScene_fly/Conventional/kui.lh'],
           // ['plane','https://hunchun828.top/img/LayaScene_fly/Conventional/dimian.lh'],
   	]
   ];

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
     
     let fileLangth = 0;

   class InitUI$1 extends Laya.Scene {
       constructor() {
           super();
           this.loadScene("test/load.scene");
           

           this.boxLangth = 3;
           this.boxedLangth = 0;

           let scene = new Laya.Scene3D();
           Laya.stage.addChild(scene);
           this.createText();
           this.doLoad();
           //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
           this.camera = new Laya.Camera(0, 0.1, 100);
           this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
           this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
           
           //相机设置清楚标记,使用固定颜色
           this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
           //使用默认的颜色
           //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
           //设置摄像机视野范围（角度）
           this.camera.fieldOfView = 45;
           //为相机添加视角控制组件(脚本)
           scene.addChild(this.camera);
           
           // //添加平行光
           // let directionLight = new Laya.DirectionLight();
           // scene.addChild(directionLight);
           // //设置平行光颜色
           // directionLight.color = new Laya.Vector3(1, 1, 1);
           // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
           



           let sprited = new Laya.Sprite3D();
           scene.addChild(sprited);
           //正方体
           let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
           sprited.addChild(box1);
           
           box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
          




           let sprite = new Laya.Sprite3D();
           scene.addChild(sprite);
           //正方体
           let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31);
           this.box = new Laya.MeshSprite3D(tem);
           sprite.addChild(this.box);
           //  var material = new Laya.BlinnPhongMaterial();
           // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
           //         material.albedoTexture = tex;
           // }));
           // this.box.meshRenderer.material = material;

           let scale = new Laya.Vector3(0, 1, 1);
           this.box.transform.localScale = scale;
           let scale1 = new Laya.Vector3(1, 1, 1);
           this.box.transform.localScale = scale1;
           this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
          
       }
       downLoadSprite3D(load){
           return new Promise((resolve, reject)=>{
               Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                   console.log(load[0]);
                   let index = utl.playStatusObj.doingIndex;
                   utl.models.set(load[0],sp);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   let material = new Laya.BlinnPhongMaterial();
                   material.albedoColor=new Laya.Vector3(1,5,1);
                   material.diffuseColor=new Laya.Vector3(1,5,1);
                   this.box.meshRenderer.material = material;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       if(index==1){
                           Laya.Scene.open(`test/game${index}.scene`);
                       }
                       if(index==2){
                           Laya.Scene.open(`test/weightObservation.scene`);
                       }
                       // Laya.stage.addChild(GameUI);
                       // Laya.Scene.open(`test/game${index}.scene`)
                   }
                   resolve();
               }));
           })
       }
       downLoad(load){
           return new Promise((resolve, reject)=>{
               Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                   let index = utl.playStatusObj.doingIndex;
                   utl.models.set(load[0],texture);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(fileLangth + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(fileLangth + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   let material = new Laya.BlinnPhongMaterial();
                   material.albedoColor=new Laya.Vector3(1,5,1);
                   material.diffuseColor=new Laya.Vector3(1,5,1);
                   this.box.meshRenderer.material = material;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       // Laya.stage.addChild(GameUI);
                       // Laya.Scene.open('test/main.scene')
                       if(index==1){
                           Laya.Scene.open(`test/game${index}.scene`);
                       }
                       if(index==2){
                           Laya.Scene.open(`test/weightObservation.scene`);
                       }
                   }
                   resolve();
               }));
           })
       }
       doLoad(){
           utl.loadIndex = 0;
           let index = utl.playStatusObj.doingIndex;
           let load3D = loadFile[index-1];
           console.log(load3D,utl.loadingSprite3D);
           fileLangth = load3D.length;

           for(let obj of load3D){
               this.downLoadSprite3D(obj);
           }
           for(let objElse of utl.loadingElse){
               this.downLoad(objElse);
           }
       }
       createText() {
           const 
               Text = Laya.Text;
           
           this.txt = new Text();
           Laya.stage.addChild(this.txt);
           //给文本的text属性赋值
           this.txt.text = "正在加载0";
           //设置宽度，高度自动匹配
           this.txt.width = 400;
           //自动换行
           this.txt.wordWrap = true;

           this.txt.align = "center";
           this.txt.fontSize = 40;
           this.txt.font = "Microsoft YaHei";
           this.txt.color = "#1aff00";
           this.txt.bold = true;
           this.txt.leading = 5;

           // //设置描边属性
           // txt.stroke = 10;
           // txt.strokeColor = "#00ffc6";

           // txt.borderColor = "#00ffc6";

           this.txt.x = (Laya.stage.width - this.txt.width) / 2;
           this.txt.y = (Laya.stage.height - this.txt.textHeight) / 2 + 100;
       }
       
   }

   class speedTouch$1 {
     constructor() {
       // this.changeSpeed.pos(Laya.stage.width-Laya.stage.height/5, Laya.stage.height/5*3);
       //     this.changeSpeed.graphics.drawRect(0, 0, 100, Laya.stage.height/5*1, "#00000066");
       //     this.changeSpeed.graphics.drawRect(0, 50, 100, 70, "#00bef7");

       // this.width = 100
       // this.height = 20
       this.x = 0;
       this.y = 0;
       // this.moveX = 0
       // this.moveY = 0
       this.changeSpeed = new Laya.Sprite();
       Laya.stage.addChild(this.changeSpeed);
       this.changeSpeed.pos(Laya.stage.width - Laya.stage.height / 5, Laya.stage.height / 5 * 3+50);
       

       this.tx = Laya.stage.width - Laya.stage.height / 5;
       this.twidth = 100;
       this.theight = Laya.stage.height / 5 * 1;
       this.ty = Laya.stage.height / 5 * 3+50;
     }
     draw() {
       this.changeSpeed.graphics.drawRect(0, 0, 100, Laya.stage.height / 5 * 1, "#00000066");
       this.changeSpeed.graphics.drawRect(0, 50, 100, 70, "#00bef7");
     }
     scaleBig(e) {
       utl.takeSpeed.z = 0;
       console.log('MOUSE_UP');
       utl.tachRightFlag = false;
       // Laya.Tween.to(this,{scaleX:1,scaleY:1},this.scaleTime);
     }
     outEvent() {
       utl.tachRightFlag = false;
     }

     scaleSmall(x, y) {
       if (this.tx< x && x < this.tx + this.twidth  && y > this.ty && y < this.ty + this.theight
       ) {
         return true
       } else {
         return false
       }
       //缩小至0.8的缓动效果
       // Laya.Tween.to(this,{scaleX:0.8,scaleY:0.8},this.scaleTime);
     }
     getRoteImg(pobj) {
       let rotate = 0;
       if (pobj.x1 == pobj.x2) {
         rotate = 0;
       }
       if (pobj.x1 > pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90;
       } else if (pobj.x1 < pobj.x2) {
         let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2);
         rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270;
       }
       return rotate
     }
     leftFormatMovePosition(px, py) {
       let value = py - this.ty;
       utl.boxSpeed = 0.001*(1-value/this.theight);
       this.changeSpeed.graphics.clear();
       this.changeSpeed.graphics.drawRect(0, 0, 100, Laya.stage.height / 5 * 1, "#00000066");
       this.changeSpeed.graphics.drawRect(0, value, 100,50, "#00bef7");
     }

   }

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
     let temp$1 =0,spled$1 = {x:0,y:0,z:0},dfew$1=0;
     let flagod$1 = false;
     let fireFlag$1 = false;
     let touchs$1 = [
       ['newTouch',{flag:false,Tclass:speedTouch$1}],
       ['newTor',{flag:false,Tclass:newTwo}],
       ['fire',{flag:false,Tclass:speedTouch}],
       ['rightTouch',{flag:false,Tclass:newTwo$1}],
       ['leftRote',{flag:false,Tclass:leftRote}],
       ['rightRote',{flag:false,Tclass:rightRote}]
     ];

   class GameUI$1 extends Laya.Scene {
       constructor() {
           super();
           this.isTwoTouch = false;
           this.twoFirst = true;
           this.fucntkTemp =0;
           this.temprx=0;
           this.tempry=0;
           this.temprz=0;
           this.shipRx = 0;
           this.shipRy = 0;
           this.spled = 0;
           this.spledy=0;
           this.loadScene("test/TestScene.scene");
           this.newScene = Laya.stage.addChild(new Laya.Scene3D());
           this.loadingElse = new Map(utl.loadingElse);


           utl.newScene = this.newScene;
           this.initTouch();
           this.info = new Laya.Text();
           this.info.text = '555777777775';
           this.info.fontSize = 50;
           this.info.color = "#FFFFFF";
           this.info.size(Laya.stage.width, Laya.stage.height);
           this.info.pos(0,100);
           Laya.stage.addChild(this.info);  
           utl.info =  this.info;
           this.drawUi();
           Laya.Gyroscope.instance.on(Laya.Event.CHANGE, this, onDeviceorientation);
           function onDeviceorientation(absolute, rotationInfo) {
               // this.info.text =
               //     "alpha:" + Math.floor(rotationInfo.alpha) + '\n' +
               //     "beta :" + Math.floor(rotationInfo.beta) + '\n' +
               //     "gamma:" + Math.floor(rotationInfo.gamma);
               if(utl.operationYype==2){
                   utl.takeSpeed.x =  Math.floor(rotationInfo.gamma);
                   utl.takeSpeed.y =  Math.floor(rotationInfo.beta);
               }
           }
           temp$1 = this;
           this.newScene.addChild(utl.models.get('light'));  
          


           Laya.timer.loop(30,this,this.onUpdate);

          

           var sfe = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(1)));
           var material = new Laya.BlinnPhongMaterial();
           sfe.transform.position = new Laya.Vector3(1,20, 3);
           Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                   material.albedoTexture = tex;
           }));
           sfe.meshRenderer.material = material;

           let fuckdd = utl.models.get('fuckdd');
           this.newScene.addChild(fuckdd);


           let maton = utl.models.get('maton');
           this.newScene.addChild(maton);

           utl.box = utl.models.get('pler');
           this.newScene.addChild(utl.box);

           utl.bullet = utl.models.get('bullet');
           this.newScene.addChild(utl.bullet);
           
           let ship = utl.box.getChildByName('shipmain');
           let shipcar = ship.getChildByName('ship');
           utl.c1 = shipcar.getChildByName('c1');
           utl.c2 = shipcar.getChildByName('c2');
          
           // Laya.timer.loop(1,this,this.onFire);
           let camera = ship.getChildByName('c1');
           camera.clearColor = new Laya.Vector4(0, 0, 0, 1);

           utl.camera = camera;



           let nimabi = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(5, 11,42)));
           var materialr = new Laya.BlinnPhongMaterial();
           Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(null, function(tex) {
                   materialr.albedoTexture = tex;
           }));
           nimabi.meshRenderer.material = materialr;
           nimabi.transform.position = new Laya.Vector3(1,20, 6);
           nimabi.addComponent(Bullet);




           
          
           this.createBall();


           let  sum= utl.models.get('sun');
           this.newScene.addChild(sum);
           // Laya.loader.load('https://xuxin.love/img/fly/controll.png', Laya.Handler.create(this, function() {
           //     let monkey2 = Laya.loader.getRes('https://xuxin.love/img/fly/controll.png');
           //     let ape2 = new Laya.Sprite();
           //     Laya.stage.addChild(ape2);
           //     ape2.graphics.drawTexture(monkey2, 100, 100);
           //     ape2.width = 400
           //     ape2.height = 400
           //     ape2.x = 250;
           //     ape2.y = Laya.stage.height - 500;
           // }));

           
           
           // utl.models.get('cube').active=false  
       }
       drawUi(){
              console.log(55555555555555);

           // let fudf = utl.models.get('cotrll')
           // let ape2 = new Laya.Sprite();
           // Laya.stage.addChild(ape2);
           // ape2.graphics.drawTexture(fudf, 100, 100);
           // // ape2.width = 400
           // // ape2.height = 400
           // // ape2.x = 0;
           // // ape2.y = Laya.stage.height - 500;
           // ape2.pos(0,Laya.stage.height - 500)
           let leftHandself = this.loadingElse.get('cotrll');
           let leftHandselfImg = new  Laya.Image(leftHandself);
           leftHandselfImg.height = 200;
           leftHandselfImg.width =200;
           leftHandselfImg.pos(Laya.stage.width  -700, Laya.stage.height - 200);
           Laya.stage.addChild(leftHandselfImg);


           let rightHandself = this.loadingElse.get('cotrll');
           let rightHandselfImg = new  Laya.Image(rightHandself);
           rightHandselfImg.height = 200;
           rightHandselfImg.width =200;
           rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
           Laya.stage.addChild(rightHandselfImg);




           let leftHand = this.loadingElse.get('cotrll');
           let leftHandImg = new  Laya.Image(leftHand);
           leftHandImg.height = 450;
           leftHandImg.width =450;
           leftHandImg.pos(300, Laya.stage.height - 600);
           Laya.stage.addChild(leftHandImg);


           let rightHand = this.loadingElse.get('cotrll');
           let rightHandImg = new  Laya.Image(rightHand);
           rightHandImg.height = 300;
           rightHandImg.width =300;
           rightHandImg.pos(Laya.stage.width - 600, Laya.stage.height - 500);
           Laya.stage.addChild(rightHandImg);


           let col = this.loadingElse.get('fire');
           let dialog = new  Laya.Image(col);
           dialog.height = 600;
           dialog.width =100;
           dialog.pos(Laya.stage.width - 100, Laya.stage.height - 650);
           Laya.stage.addChild(dialog);
           // let ape3 = new Laya.Sprite();
           // Laya.stage.addChild(ape3);
           // ape3.graphics.drawTexture(col, 100, 100);
           // ape3.width = 100
           // ape3.height = 100
           // ape3.x = Laya.stage.width/2+200;
           // ape3.y = Laya.stage.height - 500;
           utl.showbox = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
           utl.showbox.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
           var material = new Laya.BlinnPhongMaterial();
           material.color = new Laya.Color(1, 1, 1, 1);
           utl.showbox.meshRenderer.material = material;
           
       }
       initTouch(){
           for(let touch of touchs$1){
               touch[1].event = new touch[1].Tclass();
           }
       }
       onFire(){
           if(utl.fireOnOff){
               // let ship = utl.box.getChildByName('shipmain')
               // let shipcar = ship.getChildByName('ship')
               let aum =utl.bullet.clone();
               
               // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
               let script = aum.addComponent(Bullet);
               this.newScene.addChild(aum);
           }
           
       }
       createBall(){
           let cube = utl.models.get('cube').clone();
                           // cube.active=true  
                           // let scale = new Laya.Vector3(3, 3, 3);
                           // cube.transform.localScale = scale;
                          
                           cube.addComponent(Bullet);
                           console.log('--------------------',cube);
                           this.newScene.addChild(cube);
                            // cube.transform.position =new Laya.Vector3(0,0,0)
           let ems = utl.models.get('ems');                  
           this.newScene.addChild(cube);
           for(let i =1;i<5;i++){
               let cubeq = utl.models.get('cube').clone();
               cubeq.addComponent(Bullet);
               console.log(ems.getChildByName(i+''));
               let pos = ems.getChildByName(i+'').transform;
               this.newScene.addChild(cubeq);
               cubeq.transform.position = new Laya.Vector3(pos.position.x,pos.position.y,pos.position.z);

             
           }


           // let cube1 = utl.models.get('sphere').clone()
           //                 cube1.active=true  
           //                 // let scale = new Laya.Vector3(3, 3, 3);
           //                 // cube.transform.localScale = scale;
                          
           //                 cube1.addComponent(Enemy);
           //                 this.newScene.addChild(cube1)
           //                  cube1.transform.position =new Laya.Vector3(10,10,10)                 
           // for(let z =-1;z<2;z++){
           //     for(let i =-1;i<3;i++){
           //         for(let l =-1;l<4;l++){
           //             // let box4 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 3,6)));
           //             // let material1 = new Laya.BlinnPhongMaterial();
           //             // box4.meshRenderer.material = material1;
           //             // box4.transform.position =new Laya.Vector3(i*40,l*40,z*40)
           //             // box4.addComponent(Enemy);
           //             // this.newScene.addChild(box4)
           //                 let cube = utl.models.get('cube').clone()
           //                 cube.active=true  
           //                 // let scale = new Laya.Vector3(3, 3, 3);
           //                 // cube.transform.localScale = scale;
           //                 cube.transform.position =new Laya.Vector3(i*60,l*80,z*40)
           //                 cube.addComponent(Enemy);
           //                 this.newScene.addChild(cube)
           //         }
           //     }
           // }
       }
       flying(touchCount){

           // this.info.text = touchCount
           flagod$1=false;
           fireFlag$1 = false;
           for(let obj of touchs$1){
               obj[1].flag = false;
           }   
           // let touchCount = this.scene.input.touchCount();
           if (1 === touchCount){
               //判断是否为两指触控，撤去一根手指后引发的touchCount===1
               // if(this.isTwoTouch){
               //     return;
               // }
               let touch = this.newScene.input.getTouch(0);
               // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
                   
               //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
               // }

               // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
               //     flagod=true
               //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
               // }
               // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
               //     fireFlag = true
               //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
               // }
               for(let obj of touchs$1){
                   if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                       obj[1].flag = true;
                       obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
                   }
               }
               
           }
           else if (2 === touchCount){
               // this.isTwoTouch = true;
               //获取两个触碰点
               let touch = this.newScene.input.getTouch(0);
               let touch2 = this.newScene.input.getTouch(1);
               //是否为新一次触碰，并未发生移动
               // if (this.twoFirst){
               //     //获取触碰点的位置
               //     // this.disVector1.x = touch.position.x - touch2.position.x;
               //     // this.disVector1.y = touch.position.y - touch2.position.y;
               //     // this.distance = Laya.Vector2.scalarLength(this.disVector1);
               //     // this.sprite3DSacle = this.owner.transform.scale;
               //     this.twoFirst = false;

               // }
               // else{
                   //--------------------------------
                   // if(this.newTouch.scaleSmall(touch.position.x,touch.position.y)){
                       
                   //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                   // }
                   // if(this.newTouch.scaleSmall(touch2.position.x,touch2.position.y)){
                       
                   //     this.newTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                   // }

                   // if(this.newTor.scaleSmall(touch.position.x,touch.position.y)){
                   //     flagod=true
                   //     this.newTor.leftFormatMovePosition(touch.position.x,touch.position.y)
                   // }
                   // if(this.newTor.scaleSmall(touch2.position.x,touch2.position.y)){
                   //     flagod=true
                   //     this.newTor.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                   // }

                   // if(this.fireTouch.scaleSmall(touch.position.x,touch.position.y)){
                   //     fireFlag=true
                   //     this.fireTouch.leftFormatMovePosition(touch.position.x,touch.position.y)
                   // }
                   // if(this.fireTouch.scaleSmall(touch2.position.x,touch2.position.y)){
                   //     fireFlag=true
                   //     this.fireTouch.leftFormatMovePosition(touch2.position.x,touch2.position.y)
                   // }
   //---------------------------------------
                   for(let obj of touchs$1){
                       if(obj[1].event.scaleSmall(touch.position.x,touch.position.y)){
                           obj[1].flag = true;
                           obj[1].event.leftFormatMovePosition(touch.position.x,touch.position.y);
                       }
                       if(obj[1].event.scaleSmall(touch2.position.x,touch2.position.y)){
                           obj[1].flag = true;
                           obj[1].event.leftFormatMovePosition(touch2.position.x,touch2.position.y);
                       }
                   }   
                   

                   
                   // this.disVector2.x = touch.position.x - touch2.position.x;
                   // this.disVector2.y = touch.position.y - touch2.position.y;
                   // let distance2 = Laya.Vector2.scalarLength(this.disVector2);
                   // //根据移动的距离进行缩放
                   // let factor =  0.001 * (distance2 - this.distance);
                   // this.sprite3DSacle.x += factor;
                   // this.sprite3DSacle.y += factor;
                   // this.sprite3DSacle.z += factor;
                   // this.owner.transform.scale = this.sprite3DSacle;
                   // this.distance = distance2;
               // }   
           }
           else if (0 === touchCount){
               // this.text.text = "触控点归零";
               this.first = true;
               this.twoFirst = true;
               // this.lastPosition.x = 0;
               // this.lastPosition.y = 0;
               this.isTwoTouch = false;
               // utl.takeSpeed.x = 0
               // utl.takeSpeed.y = 0
           }
           let touchsMap = new Map(touchs$1);
           if(!touchsMap.get('newTor').flag){
               utl.takeSpeed.x = 0;
               utl.takeSpeed.y = 0;
           }
           if(!touchsMap.get('rightTouch').flag){
               utl.roteGun.x = 0;
               utl.roteGun.y = 0;
           }
           // if(!fireFlag){
               utl.fireOnOff = touchsMap.get('rightTouch').flag;
               utl.roteLeftFlag = touchsMap.get('leftRote').flag;
               utl.roteRightFlag = touchsMap.get('rightRote').flag;
           // }
           // this.info.text = flagod+','+touchCount

       }
       gunMove(){
           let shipcar = utl.bullet.getChildByName('ship');
           let obj = shipcar.getChildByName('Cube');

            let ship = utl.box.getChildByName('camermain');
            let acObj = ship.getChildByName('ac');

           

            if(utl.roteGun.x!=utl.roteGunTemp.x){
                    if(Math.abs(utl.roteGun.x-utl.roteGunTemp.x)>.1){
                       utl.roteGunTemp.x = utl.roteGun.x>utl.roteGunTemp.x?utl.roteGunTemp.x+.1:utl.roteGunTemp.x-.1;
                   }else{
                       if(utl.roteGun.x==0){
                           utl.roteGunTemp.x = 0;
                       }
                       
                   }
               }
               if(utl.roteGun.y!=utl.roteGunTemp.y){
                   if(Math.abs(utl.roteGun.y-utl.roteGunTemp.y)>.1){
                       utl.roteGunTemp.y = utl.roteGun.y>utl.roteGunTemp.y?utl.roteGunTemp.y+.1:utl.roteGunTemp.y-.1;
                   }else{
                       if(utl.roteGun.y==0){
                           utl.roteGunTemp.y = 0;
                       }
                      
                   }
               }
               let x = utl.roteGunTemp.x;       
               let y = utl.roteGunTemp.y;

            


           acObj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
           acObj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
         
           acObj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
           acObj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

           obj.transform.rotate(new Laya.Vector3(0,0,-utl.roteGunback.y* Math.PI / 180),true);
           obj.transform.rotate(new Laya.Vector3(0,-utl.roteGunback.x* Math.PI / 180,0),true);
         
           obj.transform.rotate(new Laya.Vector3(0,x* Math.PI / 180,0),true);
           obj.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),true);

           utl.roteGunback.x = x;
           utl.roteGunback.y = y;
       }
       checkFire(){
            let bmain =utl.bullet.getChildByName('ship');
           let bcube = bmain.getChildByName('Cube');
           let from = bcube.getChildByName('e1').transform.position;
           let to = bcube.getChildByName('e2').transform.position;
           this.newScene.physicsSimulation.raycastFromTo(from, to, utl.hitResult);
           if( utl.hitResult.collider&&utl.hitResult.collider.owner.name=='baga'){
               // utl.hitResult.collider.owner.active=false 
               // console.log(utl.hitResult.normal) 
               // utl.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
               // console.log(1111)
           }
          
           // console.log(utl.hitResult.collider)
       }
       setTween(){
           Laya.Tween.to(letterText,{y:100},3000,Laya.Ease.elasticInOut,null,i*1000);
       }
       onUpdate() {
           
           let touchCount = this.newScene.input.touchCount();
           
           this.flying(touchCount);
           // return
           for(let obj of utl.firs){
               obj.toTiome();
           }
           if(utl.box){
              
               let ship = utl.box.getChildByName('shipmain');
               let camera = ship.getChildByName('Main Camera');
               let shipcar = ship.getChildByName('ship');

               // shipc.getChildByName('Cube')
               let shipc = utl.bullet.getChildByName('ship');

               let bcube = shipc; 
               if(utl.takeSpeed.x!=utl.speed.x){
                    if(Math.abs(utl.takeSpeed.x-utl.speed.x)>1){
                       utl.speed.x = utl.takeSpeed.x>utl.speed.x?utl.speed.x+.4:utl.speed.x-.4;
                   }else{
                       if(utl.takeSpeed.x==0){
                           utl.speed.x = 0;
                       }
                       
                   }
               }
               if(utl.takeSpeed.y!=utl.speed.y){
                   if(Math.abs(utl.takeSpeed.y-utl.speed.y)>1){
                       utl.speed.y = utl.takeSpeed.y>utl.speed.y?utl.speed.y+1:utl.speed.y-1;
                   }else{
                       if(utl.takeSpeed.y==0){
                           utl.speed.y = 0;
                       }
                      
                   }
               }
               let x = utl.speed.x;       
               let y = utl.speed.y;
              
                   // let x = Math.floor(utl.speed.x)        
                   // let y = Math.floor(utl.speed.y)

                   // let z = utl.speed.z*90/100
              
               // console.log(utl.box.transform.rotation.x)
                   
               let tz = Math.cos(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove;
               let tx = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.y)*utl.speedMove;
               let ty = Math.sin(Math.PI/180*utl.box.transform.rotationEuler.x)*utl.speedMove;

               // this.info.text = x+','+y
              
              
               // ship.transform.rotate(new Laya.Vector3(this.temprx* Math.PI / 180,0,0),true);
               let ry = (y - this.tempry);
               let rx = (x - this.temprx);
               let sy = y/30;
               let sx = -x/30;

               
               // utl.box.transform.rotate(new Laya.Vector3(0,-this.fucntkTemp* Math.PI / 180,0),true);
               // utl.bullet.transform.rotate(new Laya.Vector3(0,-this.fucntkTemp* Math.PI / 180,0),true);

               utl.box.transform.rotate(new Laya.Vector3(0,0,sy* Math.PI / 180,),true);
               utl.box.transform.rotate(new Laya.Vector3(0,sx* Math.PI / 180,0),true);

               utl.bullet.transform.rotate(new Laya.Vector3(0,0,sy* Math.PI / 180,),true);
               utl.bullet.transform.rotate(new Laya.Vector3(0,sx* Math.PI / 180,0),true);
               // shipcar.transform.rotate(new Laya.Vector3(0,-rx* Math.PI / 180,0),true);
               // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);


               // this.fucntkTemp = sx
               
               
               shipcar.transform.rotate(new Laya.Vector3(0, this.temprx* Math.PI / 180,0),true);
               shipcar.transform.rotate(new Laya.Vector3(this.tempry* Math.PI / 180,0,0),true);

               shipcar.transform.rotate(new Laya.Vector3(-y* Math.PI / 180,0,0),true);
               shipcar.transform.rotate(new Laya.Vector3(0,-x* Math.PI / 180,0),true);



               // bcube.transform.rotate(new Laya.Vector3(0, this.temprx* Math.PI / 180,0),true);
               // bcube.transform.rotate(new Laya.Vector3(this.tempry* Math.PI / 180,0,0),true);

               // bcube.transform.rotate(new Laya.Vector3(-y* Math.PI / 180,0,0),true);
               // bcube.transform.rotate(new Laya.Vector3(0,-x* Math.PI / 180,0),true);

               utl.box.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true);
               utl.bullet.transform.translate(new Laya.Vector3(utl.speedMove,0,0),true);
               
               let max = 100;

               // if(utl.box.transform.position.x>max||utl.box.transform.position.x<-max||utl.box.transform.position.y<-max||utl.box.transform.position.y>max){
               //         utl.box.transform.translate(new Laya.Vector3(-utl.speedMove,0,0),true)
               //     utl.bullet.transform.translate(new Laya.Vector3(-utl.speedMove,0,0),true)
               //     utl.isOutGropund = false
               // }else{
               //    utl.isOutGropund = true
               // }
               //-----------------------------------c超过编辑二
               // shipcar.transform.rotation =  (new Laya.Vector3(-90,90,0),true)
               // shipcar.transform.rotate(new Laya.Vector3(-ry* Math.PI / 180,0,0),true);

               // ship.transform.rotate(new Laya.Vector3(0,0,-x* Math.PI / 180),true);

               
               // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)

               // camera.transform.rotate(new Laya.Vector3(0,0,-y* Math.PI / 180),true);

               // if(Math.abs(this.shipRx)<45){
               //      this.shipRx += x
               //      shipcar.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
               // }
               
               // shipcar.transform.rotate(new Laya.Vector3(-x* Math.PI / 180,0,0),true);
               // ship.transform.rotate(new Laya.Vector3(0,0,this.tempry* Math.PI / 180),true);
               if(utl.roteLeftFlag){
                   utl.box.transform.rotate(new Laya.Vector3(1* Math.PI / 180,0,0),true);
                   utl.bullet.transform.rotate(new Laya.Vector3(1* Math.PI / 180,0,0),true);
               }
               if(utl.roteRightFlag){
                   utl.box.transform.rotate(new Laya.Vector3(-1* Math.PI / 180,0,0),true);
                   utl.bullet.transform.rotate(new Laya.Vector3(-1* Math.PI / 180,0,0),true);
               }


               
               this.shipRy = 0;


               // ship.transform.rotation =  new Laya.Vector3(-x* Math.PI / 180,temp.rotation.y,temp.rotation.z)
               // utl.box.transform.rotate(new Laya.Vector3(0,0,y* Math.PI / 180),false);
               // utl.box.transform.rotate(new Laya.Vector3(y* Math.PI / 180,0,0),true);
               
               // camera.transform.translate(new Laya.Vector3(0,-ty,tz))
               this.temprx = x;
               this.tempry = y;
               // if(this.temprx>70){
               //     ship.transform.rotate(new Laya.Vector3(x* Math.PI / 180,0,0),true);
               //     this.temprx -= x
               // }
                // this.onFire()
                this.gunMove();
                this.onFire();
                // this.checkFire()
           }
           
           
       }
      
       creabox(py){
           for(let i=0;i<2;i++){
               for(let l=0;l<2;l++){
                   let box5 = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1,1,1)));
                   box5.transform.rotate(new Laya.Vector3(2 * Math.PI / 180,0, 10 * Math.PI / 180), true, true);
                   let material1 = new Laya.BlinnPhongMaterial();
                    box5.transform.position = new Laya.Vector3(l,py+3, i);
                  
                   let bg = box5.addComponent(Laya.Rigidbody3D);
                   //创建盒子形状碰撞器
                   let boxShape1 = new Laya.BoxColliderShape(1, 1,1);
                   //设置盒子的碰撞形状
                   bg.colliderShape = boxShape1;
                   //设置刚体的质量
                   bg.friction = 2;
                   //物理碰撞体设置弹力
                   bg.restitution = 0.3;
                   bg.mass = 10;

               }
           }
           
       }
       creab(){
           for(let f=0;f<2;f++){
               this.creabox(f);
           }
       }
       
   }
   class BoxMove extends Laya.Script3D { 
   constructor() {
   super();
   }
   onStart() {console.log("3333");}

   onTriggerEnter()
   {
       utl.entity.get('obx').removeSelf();
       temp$1.creab();
   console.log("onTriggerEnter");
   }
   onTriggerStay()
   {
   console.log("onTriggerStay");
   }
   onTriggerExit()
   {
   console.log("onTriggerExit");
   }
   onEnable() {
   } 
   onDisable() {
   }
   }
   class BoxMove3 extends Laya.Script3D { 
   constructor() {
   super();
   }
   onStart() {console.log("3333");}

   onTriggerEnter()
   {
   console.log("onTriggerEnter3");
   }
   onTriggerStay()
   {
   console.log("onTriggerStay3");
   }
   onTriggerExit()
   {
   console.log("onTriggerExit3");
   }
   onEnable() {
   } 
   onDisable() {
   }
   }

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
   let ls$1 = [
       {index:2,title:'team1'},
       {index:3,title:'team2'}
   ];
   class Level$1 extends Laya.Scene {
       constructor() {
           super();
           this.loadScene("test/players.scene");
           
           this.isTouchFlag = false;
           this.touchPosition = {
               position:{
                   x:0
               }
           };
           this.touchDown = {};
           this.touchUp = {};
           this.boxLangth = 3;
           this.boxedLangth = 0;

           this.newScene = new Laya.Scene3D();
           Laya.stage.addChild(this.newScene);
           this.createText();
           // this.doLoad();
           //创建相机，构造函数的三个参数为相机横纵比，近距裁剪，远距裁剪
           this.camera = new Laya.Camera(0, 0.1, 1000);
           this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
           this.camera.transform.rotate(new Laya.Vector3( -15, 0, 0), true, false);
           
           //相机设置清楚标记,使用固定颜色
           this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
           //使用默认的颜色
           //this.camera.clearColor = new Laya.Vector4(0, 0.2, 0.6, 1);
           //设置摄像机视野范围（角度）
           this.camera.fieldOfView = 45;
           //为相机添加视角控制组件(脚本)
           this.newScene.addChild(this.camera);
           
           // //添加平行光
           // let directionLight = new Laya.DirectionLight();
           // scene.addChild(directionLight);
           // //设置平行光颜色
           // directionLight.color = new Laya.Vector3(1, 1, 1);
           // directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
           



           // let sprited = new Laya.Sprite3D();
           // scene.addChild(sprited);
           // //正方体
           // let box1 = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(this.boxLangth, 0.3, 0.3));
           // sprited.addChild(box1);
           
           // box1.transform.position = new Laya.Vector3(0.0, 0.0, 2);
          




           // let sprite = new Laya.Sprite3D();
           // scene.addChild(sprite);
           // //正方体
           // let tem = Laya.PrimitiveMesh.createBox(3, 0.31, 0.31)
           // this.box = new Laya.MeshSprite3D(tem);
           // sprite.addChild(this.box);
           //  var material = new Laya.BlinnPhongMaterial();
           // // Laya.Texture2D.load("res/loading.png", Laya.Handler.create(null, function(tex) {
           // //         material.albedoTexture = tex;
           // // }));
           // material.albedoColor=new Laya.Vector3(.5,.5,2);
           // material.diffuseColor=new Laya.Vector3(.5,.5,2);
           // this.box.meshRenderer.material = material;

           // let scale = new Laya.Vector3(0, 1, 1);
           // this.box.transform.localScale = scale;
           // let scale1 = new Laya.Vector3(1, 1, 1);
           // this.box.transform.localScale = scale1;
           // this.box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
           this.createLevel();
           Laya.timer.loop(30,this,this.onUpdate);
           Laya.stage.on(Laya.Event.MOUSE_DOWN,this, this.onMouseDown);
           Laya.stage.on(Laya.Event.MOUSE_UP,this, this.onMouseUp);
          
       }
       onMouseUp(){
           let point = {};
           let outHitResult = new Laya.HitResult(); 
           let _outHitAllInfo = new Array();
           point.x = Laya.MouseManager.instance.mouseX;
           point.y = Laya.MouseManager.instance.mouseY;
           if(
               Math.abs(point.x - this.touchDown.x)<5&&
               Math.abs(point.y - this.touchDown.y)<5){
               let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
               //产生射线
               this.camera.viewportPointToRay(point,ray);
               //拿到射线碰撞的物体
               this.newScene.physicsSimulation.rayCast(ray,outHitResult);
               //如果碰撞到物体
               // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
                if (outHitResult.succeeded){
                    let index = outHitResult.collider.owner.parent.name.charAt(0);
                    index++;
                    if(index==1){
                        utl.playerId ='player-1';
                       utl.playStatusObj = {
                           doingIndex:1
                       };
                       this.removeSelf();
                       Laya.stage.offAll();
                       Laya.Scene.open('test/load.scene');
                    }
                    if(index==2){
                        utl.playerId ='player-2';
                       utl.playStatusObj = {
                           doingIndex:1
                       };
                       this.removeSelf();
                       Laya.stage.offAll();
                       Laya.Scene.open('test/load.scene');
                    }
                    
                }
               
           }
       }
       onMouseDown() {
           //记录点击到舞台上的点
           let point = {};
           let outHitResult = new Laya.HitResult(); 
           let _outHitAllInfo = new Array();
           point.x = Laya.MouseManager.instance.mouseX;
           point.y = Laya.MouseManager.instance.mouseY;
           this.touchDown = point;
           let ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
           //产生射线
           this.camera.viewportPointToRay(point,ray);
           //拿到射线碰撞的物体
           this.newScene.physicsSimulation.rayCast(ray,outHitResult);
           //如果碰撞到物体
           // Laya.Physics.rayCastAll(ray, _outHitAllInfo, 30, 10);
           if (outHitResult.succeeded){
               console.log(outHitResult.collider.owner.parent.name);
           }
           
           // if (outHitResult.succeeded)
           // {
           //     //删除碰撞到的物体
           //     // this.text.text = "碰撞到了" + this.outHitResult.collider.owner.name ;
           //     console.log("碰撞到物体！！",this.outHitResult.collider.owner.name)
           // }
       }
       onUpdate() {
           let touchCount = this.newScene.input.touchCount();

           if(touchCount!=0){
                let touchPosition  = this.newScene.input.getTouch(0);

               if(this.touchPosition){
                   this.isTouchFlag = true;
                   let movePositionx = this.touchPosition - touchPosition.position.x;
                   this.camera.transform.translate(new Laya.Vector3(movePositionx/80,0, 0));
                   this.updatatxt();
                   this.touchPosition = touchPosition.position.x;
               }else{
                   this.touchPosition = touchPosition.position.x;
               }
               // console.log(3333333,this.touchPosition.position.x - touchPosition.position.x)
               
           }else{
               this.touchPosition = null;
               this.isTouchFlag = false;
           }

        }  
        updatatxt(){
            for(let i in ls$1){
                let box = this.newScene.getChildByName(i+'flckbox');
                let info = Laya.stage.getChildByName(i+'player');
                let outPos =  new Laya.Vector3();
                this.camera.viewport.project(box.transform.position, this.camera.projectionViewMatrix, outPos);
                info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
            }
             
        } 
       createLevel(){
           
           let initx = 0;
           let color = new Laya.Vector3(1,5,1);
           let textColor = '#1aff00';
           for(let i in ls$1){
               if(utl.playStatusObj.doingIndex==i){
                   color = new Laya.Vector3(5,5,5);
                   textColor = '#000000';
               }else if(i>utl.playStatusObj.doingIndex){
                   color = new Laya.Vector3(0,0,0);
                   textColor = '#ffffff';
               }else{
                   color = new Laya.Vector3(1,5,1);
                   textColor = '#FF1B16'; 
               }
               let sprite = new Laya.Sprite3D();
               this.newScene.addChild(sprite);
               //正方体
               let tem = Laya.PrimitiveMesh.createBox(1, 1, 1);
               let box = new Laya.MeshSprite3D(tem);
               sprite.name = i + 'flckbox';
               sprite.addChild(box);
               let material = new Laya.BlinnPhongMaterial();
               material.albedoColor=color;
               material.diffuseColor=color;
               box.meshRenderer.material = material;
               sprite.transform.position = new Laya.Vector3(initx - 2*i, -1, 0);

               let rigidBody = box.addComponent(Laya.Rigidbody3D);
               let boxShape = new Laya.BoxColliderShape(1, 1, 1);
               rigidBody.colliderShape = boxShape;
               rigidBody.linearFactor=new Laya.Vector3(0, 0, 0);
               // rigidBody.mass = 0;







               let info = new Laya.Text();
               let outPos =  new Laya.Vector3();
               info.text = ls$1[i].title;
               info.fontSize = 40;
               info.name = i+ 'player';
               info.color = textColor;
               info.width = 50;
               info.font = "Microsoft YaHei";
               info.bold = true;
               info.size(Laya.stage.width, Laya.stage.height);
               Laya.stage.addChild(info);  
               this.camera.viewport.project(sprite.transform.position, this.camera.projectionViewMatrix, outPos);
               info.pos((outPos.x-100)/Laya.stage.clientScaleX, outPos.y / Laya.stage.clientScaleY);
           }

       }
       downLoadSprite3D(load){
           return new Promise((resolve, reject)=>{
               Laya.Sprite3D.load(load[1], Laya.Handler.create(null, (sp)=> {
                   utl.models.set(load[0],sp);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       Laya.Scene.open('test/main.scene');
                   }
                   resolve();
               }));
           })
       }
       downLoad(load){
           return new Promise((resolve, reject)=>{
               Laya.loader.load(load[1], Laya.Handler.create(this, function(texture) {
                   utl.models.set(load[0],texture);
                   ++utl.loadIndex;
                   this.boxedLangth = utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length);
                   this.txt.text = "正在加载"+~~(utl.loadIndex/(utl.loadingSprite3D.length + utl.loadingElse.length)*100)+'%';
                   let scale = new Laya.Vector3(this.boxedLangth, 1, 1);
                   this.box.transform.localScale = scale;
                   this.box.transform.position = new Laya.Vector3(-this.boxLangth/2+this.boxedLangth*3/2, 0.0, 2);
                   if(this.boxedLangth==1){
                       this.removeSelf();
                       Laya.Scene.open('test/main.scene');
                   }
                   resolve();
               }));
           })
       }
       doLoad(){
           utl.loadIndex = 0;
           for(let obj of utl.loadingSprite3D){
               this.downLoadSprite3D(obj);
           }
           for(let objElse of utl.loadingElse){
               this.downLoad(objElse);
           }
       }
       createText() {
           const 
               Text = Laya.Text;
           
           this.txt = new Text();
           Laya.stage.addChild(this.txt);
           //给文本的text属性赋值
           this.txt.text = '左右滑动屏幕选择进入关卡';
           //设置宽度，高度自动匹配
           this.txt.width = 500;
           //自动换行
           this.txt.wordWrap = true;

           this.txt.align = "center";
           this.txt.fontSize = 40;
           this.txt.font = "Microsoft YaHei";
           this.txt.color = "#1aff00";
           this.txt.bold = true;
           this.txt.leading = 5;

           // //设置描边属性
           // txt.stroke = 10;
           // txt.strokeColor = "#00ffc6";

           // txt.borderColor = "#00ffc6";

           this.txt.x = (Laya.stage.width - this.txt.width) / 2;
           this.txt.y = Laya.stage.height -100;
       }
       
   }

   class FireBg{
   	constructor(x,y) {
   		this.time = 0;
           this.visible = true;
           this.draw(x,y);
   	}
   	onAwake() {
   		//得到3D对象
           utl.firBgs.add(this);
   		console.log(323);
   		this.toTiome();
   	}
       draw(x,y){
           this.sp = new Laya.Sprite();
           Laya.stage.addChild(this.sp);
           // let pheight = Laya.stage.height 
           // let {height,width} = Laya.stage
           this.sp.graphics.drawPoly(x, y, [0, 10, 5, 0, 10, 10], "#ffffff");
           utl.mapSp = this.sp;
       }
   	toTiome() {
   		this.time++;
           if(this.time>5){
               this.sp.visible = false;
               this.visible = false;
               utl.firBgs.delete(this);
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

   class Bullet1 extends Laya.Script3D {
   	constructor() {
   		super();
   		
   	}
   	onAwake() {
   		//得到3D对象
   	
   		console.log(323);
   		this.toTiome();
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
   		let box = this.owner.parent.parent;
           box.destroy();
   	}
       checkStatus(){
   		let p1 = this.box.getChildByName('box').getChildByName('fir').transform.position;
   		for(let e of utl.entitys){
   			let box = e.box.getChildByName('box').getChildByName('fly');
   			let p2 = box.transform.position;
   			let length = Laya.Vector3.scalarLength({x:p1.x-p2.x,y:p1.y-p2.y,z:p1.z-p2.z});
               if(length<10){
                   console.log('zhuangdaole');
                   e.fuckOver();
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

   // Math.floor(Math.random() * (max - min + 1)) + min;
   class Enemy1 extends Laya.Script3D {
   	constructor() {
   		super();
   		
   	}
   	onAwake() {
           console.log(567);
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

   // javascript-astar 0.4.1
   // http://github.com/bgrins/javascript-astar
   // Freely distributable under the MIT License.
   // Implements the astar search algorithm in javascript using a Binary Heap.
   // Includes Binary Heap (with modifications) from Marijn Haverbeke.
   // http://eloquentjavascript.net/appendix2.html
   // (function(definition) {
   //   /* global module, define */
   //   if (typeof module === 'object' && typeof module.exports === 'object') {
   //     module.exports = definition();
   //   } else if (typeof define === 'function' && define.amd) {
   //     define([], definition);
   //   } else {
   //     var exports = definition();
   //     window.astar = exports.astar;
   //     window.Graph = exports.Graph;
   //   }
   // })(function() {

   function pathTo(node) {
     var curr = node;
     var path = [];
     while (curr.parent) {
       path.unshift(curr);
       curr = curr.parent;
     }
     return path;
   }

   function getHeap() {
     return new BinaryHeap(function(node) {
       return node.f;
     });
   }

   var astar = {
     /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {Graph} graph
     * @param {GridNode} start
     * @param {GridNode} end
     * @param {Object} [options]
     * @param {bool} [options.closest] Specifies whether to return the
                path to the closest node if the target is unreachable.
     * @param {Function} [options.heuristic] Heuristic function (see
     *          astar.heuristics).
     */
     search: function(graph, start, end, options) {
       graph.cleanDirty();
       options = options || {};
       var heuristic = options.heuristic || astar.heuristics.manhattan;
       var closest = options.closest || false;

       var openHeap = getHeap();
       var closestNode = start; // set the start node to be the closest if required

       start.h = heuristic(start, end);
       graph.markDirty(start);

       openHeap.push(start);

       while (openHeap.size() > 0) {

         // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
         var currentNode = openHeap.pop();

         // End case -- result has been found, return the traced path.
         if (currentNode === end) {
           return pathTo(currentNode);
         }

         // Normal case -- move currentNode from open to closed, process each of its neighbors.
         currentNode.closed = true;

         // Find all neighbors for the current node.
         var neighbors = graph.neighbors(currentNode);

         for (var i = 0, il = neighbors.length; i < il; ++i) {
           var neighbor = neighbors[i];

           if (neighbor.closed || neighbor.isWall()) {
             // Not a valid node to process, skip to next neighbor.
             continue;
           }

           // The g score is the shortest distance from start to current node.
           // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
           var gScore = currentNode.g + neighbor.getCost(currentNode);
           var beenVisited = neighbor.visited;

           if (!beenVisited || gScore < neighbor.g) {

             // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
             neighbor.visited = true;
             neighbor.parent = currentNode;
             neighbor.h = neighbor.h || heuristic(neighbor, end);
             neighbor.g = gScore;
             neighbor.f = neighbor.g + neighbor.h;
             graph.markDirty(neighbor);
             if (closest) {
               // If the neighbour is closer than the current closestNode or if it's equally close but has
               // a cheaper path than the current closest node then it becomes the closest node
               if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                 closestNode = neighbor;
               }
             }

             if (!beenVisited) {
               // Pushing to heap will put it in proper place based on the 'f' value.
               openHeap.push(neighbor);
             } else {
               // Already seen the node, but since it has been rescored we need to reorder it in the heap
               openHeap.rescoreElement(neighbor);
             }
           }
         }
       }

       if (closest) {
         return pathTo(closestNode);
       }

       // No result was found - empty array signifies failure to find path.
       return [];
     },
     // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
     heuristics: {
       manhattan: function(pos0, pos1) {
         var d1 = Math.abs(pos1.x - pos0.x);
         var d2 = Math.abs(pos1.y - pos0.y);
         return d1 + d2;
       },
       diagonal: function(pos0, pos1) {
         var D = 1;
         var D2 = Math.sqrt(2);
         var d1 = Math.abs(pos1.x - pos0.x);
         var d2 = Math.abs(pos1.y - pos0.y);
         return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
       }
     },
     cleanNode: function(node) {
       node.f = 0;
       node.g = 0;
       node.h = 0;
       node.visited = false;
       node.closed = false;
       node.parent = null;
     }
   };

   /**
    * A graph memory structure
    * @param {Array} gridIn 2D array of input weights
    * @param {Object} [options]
    * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
    */
   function Graph(gridIn, options) {
     options = options || {};
     this.nodes = [];
     this.diagonal = !!options.diagonal;
     this.grid = [];
     for (var x = 0; x < gridIn.length; x++) {
       this.grid[x] = [];

       for (var y = 0, row = gridIn[x]; y < row.length; y++) {
         var node = new GridNode(x, y, row[y]);
         this.grid[x][y] = node;
         this.nodes.push(node);
       }
     }
     this.init();
   }

   Graph.prototype.init = function() {
     this.dirtyNodes = [];
     for (var i = 0; i < this.nodes.length; i++) {
       astar.cleanNode(this.nodes[i]);
     }
   };

   Graph.prototype.cleanDirty = function() {
     for (var i = 0; i < this.dirtyNodes.length; i++) {
       astar.cleanNode(this.dirtyNodes[i]);
     }
     this.dirtyNodes = [];
   };

   Graph.prototype.markDirty = function(node) {
     this.dirtyNodes.push(node);
   };

   Graph.prototype.neighbors = function(node) {
     var ret = [];
     var x = node.x;
     var y = node.y;
     var grid = this.grid;

     // West
     if (grid[x - 1] && grid[x - 1][y]) {
       ret.push(grid[x - 1][y]);
     }

     // East
     if (grid[x + 1] && grid[x + 1][y]) {
       ret.push(grid[x + 1][y]);
     }

     // South
     if (grid[x] && grid[x][y - 1]) {
       ret.push(grid[x][y - 1]);
     }

     // North
     if (grid[x] && grid[x][y + 1]) {
       ret.push(grid[x][y + 1]);
     }

     if (this.diagonal) {
       // Southwest
       if (grid[x - 1] && grid[x - 1][y - 1]) {
         ret.push(grid[x - 1][y - 1]);
       }

       // Southeast
       if (grid[x + 1] && grid[x + 1][y - 1]) {
         ret.push(grid[x + 1][y - 1]);
       }

       // Northwest
       if (grid[x - 1] && grid[x - 1][y + 1]) {
         ret.push(grid[x - 1][y + 1]);
       }

       // Northeast
       if (grid[x + 1] && grid[x + 1][y + 1]) {
         ret.push(grid[x + 1][y + 1]);
       }
     }

     return ret;
   };

   Graph.prototype.toString = function() {
     var graphString = [];
     var nodes = this.grid;
     for (var x = 0; x < nodes.length; x++) {
       var rowDebug = [];
       var row = nodes[x];
       for (var y = 0; y < row.length; y++) {
         rowDebug.push(row[y].weight);
       }
       graphString.push(rowDebug.join(" "));
     }
     return graphString.join("\n");
   };

   function GridNode(x, y, weight) {
     this.x = x;
     this.y = y;
     this.weight = weight;
   }

   GridNode.prototype.toString = function() {
     return "[" + this.x + " " + this.y + "]";
   };

   GridNode.prototype.getCost = function(fromNeighbor) {
     // Take diagonal weight into consideration.
     if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
       return this.weight * 1.41421;
     }
     return this.weight;
   };

   GridNode.prototype.isWall = function() {
     return this.weight === 0;
   };

   function BinaryHeap(scoreFunction) {
     this.content = [];
     this.scoreFunction = scoreFunction;
   }

   BinaryHeap.prototype = {
     push: function(element) {
       // Add the new element to the end of the array.
       this.content.push(element);

       // Allow it to sink down.
       this.sinkDown(this.content.length - 1);
     },
     pop: function() {
       // Store the first element so we can return it later.
       var result = this.content[0];
       // Get the element at the end of the array.
       var end = this.content.pop();
       // If there are any elements left, put the end element at the
       // start, and let it bubble up.
       if (this.content.length > 0) {
         this.content[0] = end;
         this.bubbleUp(0);
       }
       return result;
     },
     remove: function(node) {
       var i = this.content.indexOf(node);

       // When it is found, the process seen in 'pop' is repeated
       // to fill up the hole.
       var end = this.content.pop();

       if (i !== this.content.length - 1) {
         this.content[i] = end;

         if (this.scoreFunction(end) < this.scoreFunction(node)) {
           this.sinkDown(i);
         } else {
           this.bubbleUp(i);
         }
       }
     },
     size: function() {
       return this.content.length;
     },
     rescoreElement: function(node) {
       this.sinkDown(this.content.indexOf(node));
     },
     sinkDown: function(n) {
       // Fetch the element that has to be sunk.
       var element = this.content[n];

       // When at 0, an element can not sink any further.
       while (n > 0) {

         // Compute the parent element's index, and fetch it.
         var parentN = ((n + 1) >> 1) - 1;
         var parent = this.content[parentN];
         // Swap the elements if the parent is greater.
         if (this.scoreFunction(element) < this.scoreFunction(parent)) {
           this.content[parentN] = element;
           this.content[n] = parent;
           // Update 'n' to continue at the new position.
           n = parentN;
         }
         // Found a parent that is less, no need to sink any further.
         else {
           break;
         }
       }
     },
     bubbleUp: function(n) {
       // Look up the target element and its score.
       var length = this.content.length;
       var element = this.content[n];
       var elemScore = this.scoreFunction(element);

       while (true) {
         // Compute the indices of the child elements.
         var child2N = (n + 1) << 1;
         var child1N = child2N - 1;
         // This is used to store the new position of the element, if any.
         var swap = null;
         var child1Score;
         // If the first child exists (is inside the array)...
         if (child1N < length) {
           // Look it up and compute its score.
           var child1 = this.content[child1N];
           child1Score = this.scoreFunction(child1);

           // If the score is less than our element's, we need to swap.
           if (child1Score < elemScore) {
             swap = child1N;
           }
         }

         // Do the same checks for the other child.
         if (child2N < length) {
           var child2 = this.content[child2N];
           var child2Score = this.scoreFunction(child2);
           if (child2Score < (swap === null ? elemScore : child1Score)) {
             swap = child2N;
           }
         }

         // If the element needs to be moved, swap it, and continue.
         if (swap !== null) {
           this.content[n] = this.content[swap];
           this.content[swap] = element;
           n = swap;
         }
         // Otherwise, we are done.
         else {
           break;
         }
       }
     }
   };

   const Astar = {
     astar: astar,
     Graph: Graph
   };
   // module.exports={
   //   astar: astar,
   //   Graph: Graph
   // };
   // });

   let address$1 = 'http://172.16.25.101:3000';

   let Event$1 = Laya.Event;
   let result$1 = {};

   let websocket$1 = null;
   let allBoy = [];
   function createGraph() {
   	let list = [];
   	for (let i = 0; i < 500; i++) {
   	    let list1 = [];
   	    for (let o = 0; o < 500; o++) {
   	        list1.push(1);
   	    }
   	    list.push(list1);
   	}

   	utl.graph = new Astar.Graph(list);
   }
   function resetGraph(){
   	for(let obj of utl.graph.grid){
   		for(let indexObj of obj){
   			indexObj.weight = 1;
   		}
   	}
   }


   const getServiceAddress$1 = () => {
   	let hr = new HttpRequest();

   	function onHttpRequestProgress(e) {
   		console.log(123);
   	}

   	function onHttpRequestComplete(e) {
   		result$1.serviceAddress = JSON.parse(hr.data).data;
   		login();
   		console.log(3458888, result$1);
   	}

   	function onHttpRequestError(e) {
   		console.log(534543, e);
   	}
   	hr.once(Event$1.PROGRESS, undefined, onHttpRequestProgress);
   	hr.once(Event$1.COMPLETE, undefined, onHttpRequestComplete);
   	hr.once(Event$1.ERROR, undefined, onHttpRequestError);
   	hr.send(address$1 + '/get-socketAddress', '', 'get', 'text');

   };




   const socketMain$1 = () => {
   	// utl.socket = io('https://hunchun828.top');
   	utl.socket = io('http://192.168.0.101:3000');
   	utl.socket.on('123456', (s) => {
   		utl.frames.push(s);
   	});
   	utl.socket.on('event', function(data) {});
   	utl.socket.on('disconnect', function() {});
   	//------------------------------web-------------------
   };

   /**
    * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
    * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
    * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
    */
   // import {getServiceAddress} from "../net/index"
   let updateFlag = true;

   let touchs$2 = [
       ['speedTouch', { flag: false, Tclass: speedTouch$1 }],
       ['newTor', { flag: false, Tclass: newTwo }],
       ['fire', { flag: false, Tclass: speedTouch }],
       // ['rightTouch',{flag:false,Tclass:rightTouch}],
       // ['leftRote', { flag: false, Tclass: leftRote }],
       // ['rightRote', { flag: false, Tclass: rightRote }]
   ];


   class GameUI$2 extends Laya.Scene {
       constructor() {
           super();
           this.isTwoTouch = false;
           this.twoFirst = true;
           this.fucntkTemp = 0;
           this.temprx = 0;
           this.tempry = 0;
           this.temprz = 0;
           this.spled = 0;
           this.spledy = 0;
           this.loadScene("test/weightObservation.scene");
           this.newScene = Laya.stage.addChild(new Laya.Scene3D());
           this.loadingElse = new Map(utl.loadingElse);

           this.townPosition = new Laya.Vector3(0, 40, 0);
           this.outPos = new Laya.Vector3();
           this.onW = new Laya.Vector3(0, 0, 0);
           socketMain$1();

           utl.newScene = this.newScene;
           this.initTouch();
           // this.addMouseEvent();
           this.log = '434';
           this.info = new Laya.Text();
           this.info.text = this.log;
           this.info.fontSize = 50;
           this.info.color = "#00ff7e";
           this.info.size(Laya.stage.width, Laya.stage.height);
           this.info.pos(50, 50);
           Laya.stage.addChild(this.info);
           utl.info = this.info;
           this.drawUi();

           // this.newScene.addChild(utl.models.get('light'));  
           var directionLight = this.newScene.addChild(new Laya.DirectionLight());
           directionLight.color = new Laya.Vector3(0.3, 0.3, 0.1);
           directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -1));
           this.newScene.addChild(directionLight);
           // socketMain()



           Laya.timer.loop(50, this, this.flying);
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





           this.pler = utl.models.get('Plane').clone();
           utl.main = this.pler;
           this.newScene.addChild(this.pler);

           // this.pler = utl.models.get('hero').clone()
           // utl.main = this.pler
           // this.newScene.addChild(this.pler);
           // this.creatEntity()
           console.log(utl.models);

       }
       addMouseEvent() {

           //鼠标事件监听
           this.sp.on(Laya.Event.CLICK, this, this.onMouseDown);
       }
       onMouseDown() {
           // let point = new Laya.Vector2();
           // point.x = Laya.MouseManager.instance.mouseX;
           // point.y = Laya.MouseManager.instance.mouseY;
           console.log(6666666666);

       }
       drawUi() {
           this.sp = new Laya.Sprite();
           Laya.stage.addChild(this.sp);
           // let pheight = Laya.stage.height 
           // let {height,width} = Laya.stage
           this.sp.graphics.drawRect(0, 0, 300, 300, "#00000066");
           utl.mapSp = this.sp;
           this.addMouseEvent();

           let findImg = new Laya.Image(this.loadingElse.get('tat'));
           findImg.height = 60;
           findImg.width = 60;
           utl.findImg = findImg;
           Laya.stage.addChild(findImg);

           // let rightHandself = this.loadingElse.get('addsStop')
           // let rightHandselfImg = new  Laya.Image(rightHandself);
           // rightHandselfImg.height = 150
           // rightHandselfImg.width =150
           // rightHandselfImg.pos(Laya.stage.width - 400, Laya.stage.height - 200);
           // Laya.stage.addChild(rightHandselfImg);

           for (let touch of touchs$2) {
               touch[1].object.draw(this.loadingElse);
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

           let p = null;
           this.sp.graphics.drawCircle(p.x, p.z, 1, "#008982");
       }
       initTouch() {
           for (let touch of touchs$2) {
               touch[1].object = new touch[1].Tclass();
           }
       }
       // onFire() {
       //     if (utl.fireOnOff) {
       //         utl.msType = 'FIRE'
       //         // let ship = utl.box.getChildByName('shipmain')
       //         // let shipcar = ship.getChildByName('ship')
       //         // let aum =utl.bullet.clone();

       //         // // let ball =new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1,1));
       //         // let script = aum.addComponent(Bullet);
       //         // this.newScene.addChild(aum)
       //     }

       // }
       updateOneFlay() {
           //  let list = utl.frameTimesMap.get(id)
           //  let pler = utl.flyers.get(id) 

           //  if(utl.frameAddIndex+10<utl.frameGetIndex){
           //      list = []
           //      return
           //  }

           //  if (list&&list.length > 0) {
           let time = frameTimes.shift();
           let plerPosition = new Laya.Vector3(time.x, time.y, time.z);

           // this.plerPosition.x = time.x
           // this.plerPosition.y = time.y
           // this.plerPosition.z = time.z

           this.pler.transform.position = plerPosition;
           this.pler.transform.localRotationEulerX = time.rx;
           this.pler.transform.localRotationEulerY = time.ry;
           this.pler.transform.localRotationEulerZ = time.rz;

           this.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx * 2;
           this.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy;


           // this.townPosition = new Laya.Vector3(time.x, 36, time.z)
           // utl.town.transform.position = this.townPosition
           this.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx;



           //  }
       }
       update() {
           this.updateOneFlay();
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
           let list = utl.frameTimesMap.get(utl.id);
           if (list && list.length > 0) {
               let time = list.shift();

               this.plerPosition.x = time.x;
               this.plerPosition.y = time.y;
               this.plerPosition.z = time.z;
               this.townPosition.x = time.x;
               this.townPosition.z = time.z;
               utl.pler.transform.position = this.plerPosition;
               utl.town.transform.position = this.townPosition;
               utl.pler.transform.localRotationEulerX = time.rx;
               utl.pler.transform.localRotationEulerY = time.ry;
               utl.pler.transform.localRotationEulerZ = time.rz;

               // let sx = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX
               // let sy = utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY

               // let nowx = utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX


               utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx;
               utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX = time.sx * 2;
               utl.pler.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerY = time.sy;
               // utl.pler.getChildByName('shipmain').getChildByName('g1').transform.localRotationEulerX = time.sx/2

        18310825053;
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
               let entity = this.pler.getChildByName('diren').clone();
               this.pler.addChild(entity);
               entity.addComponent(Enemy);
               let fly = entity.getChildByName('box').getChildByName('fly').getChildByName('fly');
               fly.addComponent(Enemy1); 
           }
       }
       onFire() {
           if (utl.fireTf) {

               //     let bullet1 = utl.models.get('bullet').clone()
               //     this.newScene.addChild(bullet1)
               //     let bullet2 = utl.models.get('bullet').clone()
               //     this.newScene.addChild(bullet2)
               //     let bu1 = this.pler.getChildByName('main').getChildByName('box').getChildByName('fly').getChildByName('bu1')
               //     let bu2 = this.pler.getChildByName('main').getChildByName('box').getChildByName('fly').getChildByName('bu2')

               //     let { x, y, z } = bu1.transform.position
               //     let ro = bu1.transform.rotationEuler

               //     bullet1.transform.position = new Laya.Vector3(x, y, z)
               //     bullet1.transform.rotationEuler = new Laya.Vector3(ro.x, ro.y, ro.z)

               //     let p1 = bu2.transform.position
               //     let ro1 = bu2.transform.rotationEuler
               //     bullet2.transform.position = new Laya.Vector3(p1.x, p1.y, p1.z)
               //     bullet2.transform.rotationEuler = new Laya.Vector3(ro1.x, ro1.y, ro1.z)
               //     bullet1.addComponent(Bullet);
               //     bullet2.addComponent(Bullet);
               let bullet = this.pler.getChildByName('zidan').clone();
               this.pler.addChild(bullet);

               let qiu = this.pler.getChildByName('main');
               let localPosition = qiu.getChildByName('box').transform.localPosition;
               let lo1 = bullet.getChildByName('box');
               lo1.transform.localPosition = new Laya.Vector3(localPosition.x, localPosition.y, localPosition.z);

               let x = qiu.transform.rotationEuler.x;
               let y = qiu.transform.rotationEuler.y;
               let z = qiu.transform.rotationEuler.z;
               bullet.transform.rotationEuler = new Laya.Vector3(x, y, z);
               bullet.addComponent(Bullet);
               let Cube = bullet.getChildByName('box').getChildByName('fir');
               Cube.addComponent(Bullet1);
           }


       }
       flying() {
           for (let obj of touchs$2) {
               obj[1].flag = false;
           }
           let touchCount = this.newScene.input.touchCount();
           if (1 === touchCount) {
               //判断是否为两指触控，撤去一根手指后引发的touchCount===1
               // if(this.isTwoTouch){
               //     return;
               // }
               let touch = this.newScene.input.getTouch(0);
               for (let obj of touchs$2) {
                   if (obj[1].object.scaleSmall(touch.position.x, touch.position.y)) {
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y);
                   } else {
                       obj[1].flag = false;
                   }
               }

           }
           else if (2 === touchCount) {
               // this.isTwoTouch = true;
               //获取两个触碰点
               let touch = this.newScene.input.getTouch(0);
               let touch2 = this.newScene.input.getTouch(1);
               for (let obj of touchs$2) {
                   if (obj[1].object.scaleSmall(touch.position.x, touch.position.y)) {
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch.position.x, touch.position.y);
                   }
                   if (obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                       obj[1].flag = true;
                       obj[1].object.leftFormatMovePosition(touch2.position.x, touch2.position.y);
                   }
                   if (!obj[1].object.scaleSmall(touch.position.x, touch.position.y) && !obj[1].object.scaleSmall(touch2.position.x, touch2.position.y)) {
                       obj[1].flag = false;
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
               for (let obj of touchs$2) {
                   obj[1].object.scaleSmall(-1000, -1000);//时间归零
                   obj[1].flag = false;
               }
               utl.socket.emit('123456',{
                   playerId:utl.id,
                   frame:{ x:0, y:0}
               });
           }
           // if(this.newScene.input.getTouch(0)!=0){
           //     utl.takeSpeed.x = utl.tachSpeed.x
           //     utl.takeSpeed.y = utl.tachSpeed.y
           // }
           let touchsMap = new Map(touchs$2);
           // if (!touchsMap.get('leftRote').flag && !touchsMap.get('rightRote').flag) {
           //     utl.tachSpeed.z = 0
           // }
           // utl.takeSpeed.x = utl.tachSpeed.x
           // utl.takeSpeed.y = utl.tachSpeed.y
           utl.fireTake = utl.fireTach;
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
           this.findUpdata();

       }
       createBox(frame){
           let mastetr = utl.models.get('hero').clone();
           utl.entitys.set(frame.id,mastetr);
           this.newScene.addChild(mastetr);
           let plerPosition = new Laya.Vector3(frame.x, frame.y, frame.z);
           mastetr.transform.position = plerPosition;
       }
       flyUpdate(frames) {
           for(let frame of frames){
               if(utl.entitys.has(frame.id)){
                   let obj = utl.entitys.get(frame.id);
                   let plerPosition = new Laya.Vector3(frame.x, 2, frame.y);
                   obj.transform.position = plerPosition;
               }else{
                   this.createBox(frame);
               }
               
           }
       }
       findUpdata() {
           if(utl.frames.length==0){
               updateFlag = false;
               return
           }
           if(!updateFlag){
               if(utl.frames.length<3){
                   return
               }else{
                   updateFlag = true;
               }
           }
           let time = utl.frames.shift();
           this.flyUpdate(time.list);

           // car.viewport.project(tat.transform.position, car.projectionViewMatrix, this.outPos);
           // utl.findImg.pos(this.outPos.x / Laya.stage.clientScaleX - 30, this.outPos.y / Laya.stage.clientScaleY - 30)
       }
       fireUpdate() {
           for (let fir of utl.firs) {
               fir.toTiome();
           }
       }
       getTakeSpeed() {
           if (utl.tachSpeed.x < utl.takeSpeed.x) {
               utl.takeSpeed.x -= 5;
           }
           if (utl.tachSpeed.x > utl.takeSpeed.x) {
               utl.takeSpeed.x += 5;
           }
           if (utl.tachSpeed.y < utl.takeSpeed.y) {
               utl.takeSpeed.y -= 5;
           }
           if (utl.tachSpeed.y > utl.takeSpeed.y) {
               utl.takeSpeed.y += 5;
           }
           // utl.takeSpeed.x = utl.tachSpeed.x
           // utl.takeSpeed.y = utl.tachSpeed.y
       }
       getFrame() {
           let { x, y, z } = utl.kui.transform.position;
           let rx = utl.kui.transform.localRotationEulerX;
           let ry = utl.kui.transform.localRotationEulerY;
           let rz = utl.kui.transform.localRotationEulerZ;
           let sx = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerX;
           let sy = utl.kui.getChildByName('shipmain').getChildByName('ship').transform.localRotationEulerZ;

           //  utl.socket.emit('123456',{
           //      playerId:utl.id,
           //      frame:{ x, y, z, rx, ry, rz, sx, sy }
           //  });


           frameTimes.push({ x, y, z, rx, ry, rz, sx, sy });
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
               utl.tachSpeed.x += 5;
           }
           if (utl.tachSpeed.x > 0) {
               utl.tachSpeed.x -= 5;
           }
           if (utl.tachSpeed.y < 0) {
               utl.tachSpeed.y += 5;
           }
           if (utl.tachSpeed.y > 0) {
               utl.tachSpeed.y -= 5;
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
           this.getTakeSpeed();
           // }
       }
       gunMove() {
           let ship = utl.box.getChildByName('camermain');
           let acObj = ship.getChildByName('ac');



           if (utl.roteGun.x != utl.roteGunTemp.x) {
               if (Math.abs(utl.roteGun.x - utl.roteGunTemp.x) > .1) {
                   utl.roteGunTemp.x = utl.roteGun.x > utl.roteGunTemp.x ? utl.roteGunTemp.x + .1 : utl.roteGunTemp.x - .1;
               } else {
                   if (utl.roteGun.x == 0) {
                       utl.roteGunTemp.x = 0;
                   }

               }
           }
           if (utl.roteGun.y != utl.roteGunTemp.y) {
               if (Math.abs(utl.roteGun.y - utl.roteGunTemp.y) > .1) {
                   utl.roteGunTemp.y = utl.roteGun.y > utl.roteGunTemp.y ? utl.roteGunTemp.y + .1 : utl.roteGunTemp.y - .1;
               } else {
                   if (utl.roteGun.y == 0) {
                       utl.roteGunTemp.y = 0;
                   }

               }
           }
           let x = utl.roteGunTemp.x;
           let y = utl.roteGunTemp.y;




           acObj.transform.rotate(new Laya.Vector3(0, 0, -utl.roteGunback.y * Math.PI / 180), true);
           acObj.transform.rotate(new Laya.Vector3(0, -utl.roteGunback.x * Math.PI / 180, 0), true);

           acObj.transform.rotate(new Laya.Vector3(0, x * Math.PI / 180, 0), true);
           acObj.transform.rotate(new Laya.Vector3(0, 0, y * Math.PI / 180), true);



           utl.roteGunback.x = x;
           utl.roteGunback.y = y;
       }
       checkFire() {
           let bmain = utl.bullet.getChildByName('ship');
           let bcube = bmain.getChildByName('Cube');
           let from = bcube.getChildByName('e1').transform.position;
           let to = bcube.getChildByName('e2').transform.position;
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

   /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

   class GameConfig {
       static init() {
           //注册Script或者Runtime引用
           let reg = Laya.ClassUtils.regClass;
   		reg("script/games/game1.js",GameUI);
   		reg("script/InitUI.js",InitUI);
   		reg("script/level.js",Level);
   		reg("script/Ioading.js",InitUI$1);
   		reg("script/GameUI.js",GameUI$1);
   		reg("script/hand/fire.js",speedTouch);
   		reg("script/players/scene.js",Level$1);
   		reg("script/observation/game.js",GameUI$2);
       }
   }
   GameConfig.width = 640;
   GameConfig.height = 1136;
   GameConfig.scaleMode ="full";
   GameConfig.screenMode = "none";
   GameConfig.alignV = "top";
   GameConfig.alignH = "left";
   GameConfig.startScene = "test/level.scene";
   GameConfig.sceneRoot = "";
   GameConfig.debug = false;
   GameConfig.stat = false;
   GameConfig.physicsDebug = false;
   GameConfig.exportSceneToJson = true;

   GameConfig.init();

   class Main {
   	constructor() {
   		//根据IDE设置初始化引擎		
   		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
   		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
   		Laya["Physics"] && Laya["Physics"].enable();
   		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
   		Laya.stage.scaleMode = GameConfig.scaleMode;
   		Laya.stage.screenMode = GameConfig.screenMode;
   		Laya.stage.alignV = GameConfig.alignV;
   		Laya.stage.alignH = GameConfig.alignH;
   		//兼容微信不支持加载scene后缀场景
   		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

   		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
   		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
   		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
   		if (GameConfig.stat) Laya.Stat.show();
   		Laya.alertGlobalError(true);

   		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
   		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
   	}

   	onVersionLoaded() {
   		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
   		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
   	}

   	onConfigLoaded() {
   		//加载IDE指定的场景
   		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
   	}
   }
   //激活启动类
   new Main();

}());