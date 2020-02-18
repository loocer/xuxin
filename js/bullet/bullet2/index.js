import DataBus from '../../main/databus'
import Bullet from './bullet'
let databus = new DataBus()
export const create =(player) => {
  databus.createSpeed = 30
  let px = player.x + 10 * Math.cos(player.rotateLag * Math.PI / 180 + 45)
  let py = player.y + 10 * Math.sin(player.rotateLag * Math.PI / 180 + 45)
  for(let i =0;i<7;i++){
    let mx = databus.bullets2[i].x
    let my = databus.bullets2[i].y
    let bullet = databus.pools.getItemByClass('bullet2', Bullet)
    player.shootX = px
    player.shootY = py
    bullet.init(
      px,
      py,
      mx,
      my,
    )
    databus.bullets.add(bullet)
  }
  
}