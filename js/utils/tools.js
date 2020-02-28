export function getRoteImg(pobj, acObj) {
  if (pobj.x1 == pobj.x2){
    acObj.rotate=0
  }
  if (pobj.x1 > pobj.x2) {
    let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
    acObj.rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 90
  } else if (pobj.x1 < pobj.x2) {
    let atanrotate = (pobj.y1 - pobj.y2) / (pobj.x1 - pobj.x2)
    acObj.rotate = ~~(Math.atan(atanrotate) / Math.PI * 180) + 270
  }
}
export function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}
export const normal = ()=>{
  wx.getSystemInfo({
    success(res) {
      if (res.system.substring(0, 3) == 'ios') {
        wx.setPreferredFramesPerSecond(30)
      } else {
        wx.setPreferredFramesPerSecond(30)
      }
    }
  })
}
export const slow =()=>{
  wx.getSystemInfo({
    success(res) {
      if (res.system.substring(0, 3) == 'ios') {
        wx.setPreferredFramesPerSecond(50)
      } else {
        wx.setPreferredFramesPerSecond(10)
      }
    }
  })
}