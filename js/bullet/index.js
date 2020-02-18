import *as bullet1  from './bullet1/index'
import *as bullet2  from './bullet2/index'
const bulletList = [
  ['bullet1',bullet1.create],
  ['bullet2',bullet2.create]
]
export default new Map(bulletList)