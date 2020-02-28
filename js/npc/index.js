

import createTool from './createTool'
import {
  groundWidth,
  groundHeight
} from '../utils/common'
import DataBus from '../main/databus'
let databus = new DataBus()
export const create1 = ()=>{
  if(databus.addEnemyFlag){
    
    if(databus.checkIndex>createTool.length-1){
      databus.checkIndex=createTool.length-1
    }
    createTool[databus.checkIndex]()
    databus.checkIndex++
    databus.addEnemyFlag= false
  }
}