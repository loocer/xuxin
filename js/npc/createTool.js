import Enemy1 from './enemy1/index'
import { rnd } from '../utils/tools'
import {
  groundWidth,
  groundHeight,
  screenWidth,
  screenHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
const create1 = ()=>{
    for(let i=0;i<20;i++){
      let mosterHouse = databus.pools.getItemByClass('mosterHouse', Enemy1)
      mosterHouse.init(rnd(0,groundWidth),rnd(0,groundHeight))
      databus.mosterHouse.add(mosterHouse)
    }
}
export default [create1]