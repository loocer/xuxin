let Room = require('./model/room.js')
let boxs =require('./tools/rooms')
class Main{
   constructor(io){
     this.rooms = []
     this.io = io
     this.createRoom()
     // this.work()
   }
   createRoom(){
      let room = new Room(this.io)
	  room.work(this.io)
      this.rooms.push(room)
      boxs.set(room.id,room)
   }
   // work(){
   //    for(let room of this.rooms){
   //       room.work(this.io)
   //    }
   //    // setTimeout(()=>{
   //    //    this.update()
   //    //    this.pushMsg()
   //    //    this.work()
   //    // },200)
   // //    setInterval(()=>{
        
   // //   },300)
   // }
   // pushMsg(io){
   //     for(let room of this.rooms){
   //          room.pushMsg(this.io)
   //     }
   // }
   // update(){
   //  for (let en of  boxs.values()) {
   //       en.update()
   //    }
   // }
}
// module.exports=main


// const gameGo = {
//     createRoom:(io)=>{
//         let main = new Main(io);
//         main.createRoom()
//     },
//     receive:()=>{

//     }
// }
module.exports=Main