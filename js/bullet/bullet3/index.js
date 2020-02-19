import DataBus from '../../main/databus'
import Bullet from './bullet'
let databus = new DataBus()
export const create =(player) => {
  let bullet = databus.pools.getItemByClass('bullet3', Bullet)
  let px = player.x + 10 * Math.cos(player.rotateLag * Math.PI / 180 + 45)
  let py = player.y + 10 * Math.sin(player.rotateLag * Math.PI / 180 + 45)
  player.shootX = px
  player.shootY = py
  bullet.init(
    px,
    py,
    databus.shootSpeed
  )
  databus.bullets.add(bullet)
}