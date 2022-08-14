(function () {
    'use strict';

    var utl = {
        id:Date.parse(new  Date())+'',
        entityMap:new Map(),
        playerId:'zzw',



        boxs:new Map(),
        sendMessage:[],
        sendTime:0,
        messgeTime:0,
        websocket:null,

        playStatusObj:{
            doingIndex:1
        },
    	tachLeftFlag:false,//左边点击
    	tachRightFlag:false,//左边点击
    	box:null,
        userId:Date.parse(new  Date())+'',
        models:new Map(),
        realBox:null,
        box4:null,
        camera:null,
        bestGround:250,
        speedMove:.1,
        speed:{
        	z:0,
        	x:0,
        	y:0
        },
        c1:null,
        c2:null,
        walkingDirection:1,//1：up,2:down,3:left,4:right
        netPlayers:null,
        isOutGropund:true,
        hitResult:new Laya.HitResult(),
        target:{
            x:0,
            y:0
        },
        roteGun:{
            x:0,
            y:0
        },
        roteGunback:{
            x:0,
            y:0
        },
        roteGunTemp:{
            x:0,
            y:0
        },
        takeSpeed:{
        	z:0,
        	x:0,
        	y:0
        },
        roteLeftFlag:false,
        roteRightFlag:false,
        entity:new Map(),
        operationYype:1,//1:虚拟手柄 2:屏幕方向
        loadIndex:0,
        fireOnOff:false,
        msType:'move',
        updates:[],
        firs:[],
        loadingElse:[
             ['adds','https://xuxin.love/img/redcode/icon/adds.png'],
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

    /**
     * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
     * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
     * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
     */
    let ls = [
        {index:2,title:'start game'},
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
                     utl.playStatusObj = {
                        doingIndex:1
                     };
                     this.removeSelf();
                     Laya.stage.offAll();
                     Laya.Scene.open('test/load.scene');
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
                // material.albedoColorA=new Laya.Vector3(130,288,242);
                // material.albedoColorB=242
                // material.albedoColorG=288
                // material.albedoColorR=130


                // material.diffuseColorB=242
                // material.diffuseColorG=288
                // material.diffuseColorR=130


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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/level.js",Level);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode ="fixedwidth";
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
