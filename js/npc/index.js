import Enemy1 from './enemy1/index'
import { rnd } from '../utils/tools'
import {
  groundWidth,
  groundHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
export const create1 = ()=>{
  if(databus.frame==100){
    for(let i=0;i<20;i++){
      let mosterHouse = databus.pools.getItemByClass('mosterHouse', Enemy1)
      mosterHouse.init(rnd(0,groundWidth),rnd(0,groundHeight))
      databus.mosterHouse.add(mosterHouse)
    }
  }
}