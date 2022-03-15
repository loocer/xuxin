 import utl from "../utl.js"
export default class newtach{
    constructor(){
           this.status = 0
           this.x =0
           this.y = 0
           this.move = null
           this.startPoint = null
           this.endPoint = null
          this.sp = new Laya.Sprite();
          this.point = new Laya.Vector2();
          this.startP = null
            Laya.stage.addChild(this.sp);
        }
        reset(){
          if(!this.startPoint){
            return
          }
           if(!this.endPoint){
            return
          }
          if(this.startPoint.x-this.endPoint.x<10&&
            this.startPoint.y-this.endPoint.y<10&&
            this.endPoint.x<400&&
            this.endPoint.y<400
            ){
            let p = this.startPoint
            let x = p.x/400 * 500
            let y = p.y/400 * 500
            utl.camera.transform.position = new Laya.Vector3(-x, 30, 500-y)
          }else 
          {
            
              let p = this.startPoint
            let p2 = this.trsV2ToV3(p)
            if(
            p2.x<0&&
            p2.z>0&&
            p2.x>-500&&
            p2.z<500){
              let x = ~~p2.x
              let y = ~~p2.z
              let msg ={
                userId:'zzw',
                heros:[
                  {
                    id:'cube',
                    coordinate:{
                      x:-x,y
                    }
                  }
                ]
              }
              utl.socket.emit('123456', msg);
            }
            
            
          }
          this.startPoint =null
          this.endPoint = null
        }
        drawSelect(p){
          if(this.status == 0){
            this.startPoint = p
            this.status = 1
            this.startP =  this.trsV2ToV3(p)
            return
          }
          if(this.status == 1){
            this.endPoint = p
            let p1 = this.startPoint
            this.sp.graphics.clear()
            this.sp.graphics.drawLines(p1.x, p1.y, [0, 0, p.x - p1.x, 0,p.x - p1.x, p.y - p1.y, 0, p.y - p1.y,0, 0], "#ff0000", 5);
            this.selectAll(p)
          }
          
        }
        trsV2ToV3(p){
            
             // let point =  touch.position
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            let outs = [];
                //产生射线
            utl.camera.viewportPointToRay(p,this._ray);
                //拿到射线碰撞的物体
            utl.newScene.physicsSimulation.rayCastAll(this._ray,outs);
                //如果碰撞到物体
            if (outs.length !== 0)
            {

                    for (let i = 0; i <  outs.length; i++){
                        if(outs[i].collider.owner.name=="plane"){
                          return new Laya.Vector3(outs[0].point.x,outs[0].point.y,outs[0].point.z)
                        }
                    }
                        //在射线击中的位置添加一个立方体
                      
            }
        }
        selectAll(p22){

            let p1 = this.startP
            let p2 = this.trsV2ToV3(p22)
            if(!p1){
               return
             }
            let absx1x = p1.x
            let absx2x = p2.x
            let absx1z = p1.z
            let absx2z = p2.z
            let msx = absx1x>absx2x?absx1x:absx2x
            let msz = absx1z>absx2z?absx1z:absx2z
            let mix = absx1x<absx2x?absx1x:absx2x
            let miz = absx1z<absx2z?absx1z:absx2z
           
            for (let en of  utl.entityMap.values()) {
              let pos = en.transform.position
              let fx = pos.x
              let fz = pos.z
              if(fx<msx&&
                fx>mix&&
                fz<msz&&
                fz>miz){
                  en.getChildByName('on').active = true 
                  en.getChildByName('off').active = false
              }else{
                en.getChildByName('on').active = false 
                  en.getChildByName('off').active = true
              }
              
            }
        }
        leftFormatMovePosition(out,tnum) {
          let xx = 0
          let zz =0
          if(out){
            xx = out.x.toFixed(1); 
            zz = out.y.toFixed(1); 
          }else{
             xx = 0
            zz =0
          }
          if(tnum==0){
            this.sp.graphics.clear()
            this.status = 0
            this.reset()
            
            
              return
          }
          if(this.status == tnum){
            let x = (this.x -  xx).toFixed(1)/10
            let z = -(this.z -  zz).toFixed(1)/10
            this.move = [x,z]
          }else{
            this.x = xx
            this.z = zz
            this.move = [0,0]
          }
         if(tnum==2){
           this.sp.graphics.clear()
              utl.camera.transform.translate(new Laya.Vector3(this.move[0],this.move[1],0),true);
              if(utl.camera.transform.position.x>0||
                 utl.camera.transform.position.x<-500||
                 utl.camera.transform.position.z<0||
                 utl.camera.transform.position.z>500
                ){
                  utl.camera.transform.translate(new Laya.Vector3(-this.move[0],-this.move[1],0),true);
              }
          }
          this.status = tnum
          this.x = xx
          this.z = zz
        }
}