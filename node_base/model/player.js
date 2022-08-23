class Player {
   constructor(room,id) {
      this.id = id;
      this.state = true
      this.room = room
      this.indexRyId = 0//当前推送的id
      this.frame = []
      this.killNum = 0
   }
   getPushMsg() {
      // let list = []
      // if(this.frame.length<10){
      //    list = this.frame
      // }else{
      //    list = this.frame.splice(0,10);
      // }
      let list = [...this.frame]
      this.frame = []
      return {
         list,
         id:this.id
      }
   }
   addFrame(obj){
      this.frame.push(obj)
   }
}
module.exports = Player