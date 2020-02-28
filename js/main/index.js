import '../libs/weapp-adapter'
import '../libs/symbol'

import Main from './main'
import DataBus from './databus'
import {
  normal
} from '../utils/tools'
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
} from '../utils/common'
let databus = new DataBus()
export const run = () => {

  const image = wx.createImage()
  image.src = 'images/bg/loader.png'


  // const canvas = wx.createCanvas();
  const ctx = canvas.getContext('2d',{antialias:true})
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
      imageUrl: 'images/share.png',
    }
  })
  normal()

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.height = height * window.devicePixelRatio;
  canvas.width = width * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  databus.banner = wx.createBannerAd({
    adUnitId: 'adunit-5d516669164fc3c6',
    adIntervals: 50,
    style: {
      left: (screenWidth - 400) / 2,
      top: 10,
      width: 400,
    }
  })
  databus.banner.onError((e) => {
    console.log(e)
  })
  databus.videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-dc5ba2a345c46dc9'
  })
  databus.videoAd.onError((e) => {
    console.log(e)
  })
  wx.setInnerAudioOption({
    mixWithOther:true
  })
  // databus.audio =  new Audio()
  // databus.audio.src = '../../audio/jiqiang.mp3'
  // databus.audio.play()
  
  // databus.audio.loop = true
  wx.getStorage({
    key: 'isShowLearn',
    success(res) {
      databus.isShowLearn = res.data
    },
    fail(res) {
      databus.isShowLearn = true
      console.log(res)
    }
  })
  let downloadTaskList = []
  let list = []
  let index = 0

  function downLoadPic() {
    list = []
    downloadTaskList = []
    index = 0
    for (let obb of netResourse) {
      let task = wx.cloud.downloadFile({
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
        fail: () => {}
      })
      downloadTaskList.push(task)
    }
  }
  image.onload = function () {
    wx.cloud.init({
      env: 'test-x1dzi'
    })
    downLoadPic()
    setTimeout(() => {
      if (netResourse.length != list.length) {
        wx.showToast({
          title: '网络无连接，加载失败，正在重新加载！',
          icon: 'none',
          duration: 2000
        })
        for (let obj of downloadTaskList) {
          obj.abort()
        }
        run()
      }
    }, 20000)


  }
}