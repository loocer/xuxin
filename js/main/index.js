import '../libs/weapp-adapter'
import '../libs/symbol'

import Main from './main'
import DataBus from './databus'
import {
  netResourse
} from '../utils/picss.js'
import {
  initRender
} from './loading'
import {
  groundWidth,
  groundHeight,
  screenWidth,
  loadingImage,
  screenHeight
} from '../utils/common'
let databus = new DataBus()
export const run = () => {
  
  const image = wx.createImage()
  image.src = 'images/bg/loader.png'


  // const canvas = wx.createCanvas();
    const ctx = canvas.getContext('2d')
  const wground = groundWidth
  const hground = groundHeight

  let sysInfo = wx.getSystemInfoSync(),
    width = sysInfo.windowWidth,
    height = sysInfo.windowHeight;

  wx.setScreenBrightness({
    value: .8
  })
  wx.showShareMenu({
    withShareTicket: true
  })
  wx.onShareAppMessage(function () {
    return {
      title: '子弹上膛，一梭子下去死一片，就是这么燃！',
      // imageUrlId: 'EaPjTeGFSY-aOIUlhIIWOw',
      imageUrl: canvas.toTempFilePathSync({
          destWidth: 500,
          destHeight: 400
        })
    }
  })
  wx.getSystemInfo({
    success(res) {
      if (res.system.substring(0, 3) == 'ios') {
        wx.setPreferredFramesPerSecond(30)
      } else {
        wx.setPreferredFramesPerSecond(30)
      }
    }
  })

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.height = height * window.devicePixelRatio;
  canvas.width = width * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  databus.banner =  wx.createBannerAd({
    adUnitId:'adunit-5d516669164fc3c6',
    adIntervals:50,
    style:{
      left:(screenWidth - 400)/2,
      top:10,
      width:400,
    }
  })
  databus.banner.onError((e)=>{
    console.log(e)
  })
  wx.getStorage({
    key: 'isShowLearn',
    success (res) {
      databus.isShowLearn = res.data
    },
    fail(res){
      databus.isShowLearn = true
      console.log(res)
    }
  })
  image.onload = function () {
    wx.cloud.init({
      env: 'test-x1dzi'
    })
    let list = []
    let index = 0
    console.log(netResourse)
    for (let obb of netResourse) {
      console.log(obb)
      wx.cloud.downloadFile({
        fileID: obb.fileId, // 文件 ID
        success: res => {
          index++
          let obj = obb
          obj.url = res.tempFilePath
          list.push(obj)
          initRender(ctx, index / netResourse.length * 100, image)
          if (netResourse.length == list.length) {
            databus.allImages = list
            loadingImage()
            new Main(ctx)
          }

        },
        fail: console.error
      })
    }
  }
}