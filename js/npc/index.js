
import { rnd } from '../utils/tools'
import createTool from './createTool'
import {
  groundWidth,
  groundHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
export const create1 = ()=>{
  console.log(333)
  if(databus.addEnemyFlag){
    console.log(333)
    createTool[databus.checkIndex]()
    databus.checkIndex++
    databus.addEnemyFlag= false
  }
}