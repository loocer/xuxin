// export const 
export const screenWidth = window.innerWidth
export const screenHeight = window.innerHeight

export const HAND_WIDTH = 120
export const HAND_HEIGHT = 120
import DataBus from '../main/databus'
import * as pics from './picss.js'
let databus = new DataBus()
export let groundWidth = databus.groundWidth
export let groundHeight = databus.groundHeight
export const GAME_IMG = new Map();

export const rightPositions = {
  x: 100,
  y: screenHeight - HAND_WIDTH - 40,
  touched: false,
  touchedx: 0,
  touchedy: 0,
  rotate: 0
}
export const leftPositions = {
  x: 40,
  y: screenHeight - HAND_WIDTH - 40,
  touched: false,
  touchedx: 0,
  touchedy: 0,
  rotate: 0
}
export const groundBg = (() => {
  let img = new Image()
  img.src = 'images/bg.jpg'
  return img
})()
export const bloodBg = (() => {
  let img = new Image()
  img.src = 'images/bg/Rectangle.png'
  return img
})()
export const scoreBg = (() => {
  let img = new Image()
  img.src = 'images/bg/score-bg.png'
  return img
})()


export const duobi = (() => {
  let imags = []
  for (let i = 1; i < 5; i++) {
    imags.push('images/duobi/' + i + '.png')
  }
  return imags
})()
export const playerFire = () => {
  let img = new Image()
  img.src = getImgByName('fire-color').url
  return img
}
export const playerImag = (i) => {
  let img = new Image()
  img.src = 'images/player/p' + i + '.png'
  return img
}
export const slowSpeed = () => {
  let img = new Image()
  img.src = getImgByName('slowSpeed').url
  return img
}
export const boomsImage = () => {
  let list = []
  for (let bo of pics.booms) {
    let atlas = new Image()
    atlas.src = bo.url
    list.push(atlas)
  }
  return list
}
export const bleed1 = (() => {
  let del1s = []
  for (let i = 0; i < 9; i++) {
    let atlas = new Image()
    atlas.src = `images/bleed.png`
    del1s.push(atlas)
  }
  return del1s
})()
export const initPics = () => {
  let del1s = []
  let atlas = new Image()
  atlas.src = `images/bg/init-bg.png`
  del1s.push(atlas)
  let atlas2 = new Image()
  atlas2.src = `images/button/tittle.png`
  del1s.push(atlas2)
  let atlas3 = new Image()
  atlas3.src = `images/button/restar.png`
  del1s.push(atlas3)
  let atlas4 = new Image()
  atlas4.src = `images/bg/runking-bg.png`
  del1s.push(atlas4)
  return del1s
}
export const biHuBody = (() => {
  let atlas = new Image()
  atlas.src = `images/body/bihu.png`
  return atlas
})()
export const boomIcon = () => {
  let atlas = new Image()
  atlas.src = getImgByName('boom-icon').url
  return atlas
}

export const bulletsIcon = () => {
  let atlas = new Image()
  atlas.src = getImgByName('bullets').url
  return atlas
}
export const playerBg = () => {
  let atlas = new Image()
  atlas.src = 'images/accelerate.png'
  return atlas
}
export const houseIcon = () => {
  let atlas = new Image()
  atlas.src = getImgByName('mosterHouse').url
  return atlas
}
export const speedIcon = () => {
  let atlas = new Image()
  atlas.src = getImgByName('addspeed-icon').url
  return atlas
}
export const hand = () => {
  let atlas = new Image()
  atlas.src = getImgByName('hand').url
  return atlas
}
export const yellowBug_Image = () => {
  let list = []
  for (let i = 1; i < 21; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('yellowBugs' + i).url
    list.push(atlas)
  }
  for (let i = 20; i > 0; i--) {
    let atlas = new Image()
    atlas.src = getImgByName('yellowBugs' + i).url
    list.push(atlas)
  }
  return list
}
const spider = () => {
  let list = []
  for (let i = 1; i < 6; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('antBugs' + i).url
    list.push(atlas)
  }
  for (let i = 5; i > 0; i--) {
    let atlas = new Image()
    atlas.src = getImgByName('antBugs' + i).url
    list.push(atlas)
  }
  return list
}
const bihu = () => {
  let list = []
  for (let i = 1; i < 6; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('bihuBugs' + i).url
    list.push(atlas)
  }
  return list
}
const bullet = () => {
  let list = []
  for (let i = 1; i < 4; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('bullet' + i).url
    list.push(atlas)
  }
  return list
}
const over = ()=>{
  let list = []
  for (let i = 1; i <4; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('over' + i).url
    list.push(atlas)
  }
  return list
}
const learnBg = ()=>{
  let list = []
  for (let i = 1; i <4; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('learnBg' + i).url
    list.push(atlas)
  }
  return list
}
const blackBug = () => {
  let list = []
  for (let i = 1; i < 6; i++) {
    let atlas = new Image()
    atlas.src = getImgByName('blackBugs' + i).url
    list.push(atlas)
  }
  for (let i = 5; i >0; i--) {
    let atlas = new Image()
    atlas.src = getImgByName('blackBugs' + i).url
    list.push(atlas)
  }
  return list
}

export const loadingImage = () => {
  GAME_IMG.set('spider', spider())
  GAME_IMG.set('yellow_bugs', yellowBug_Image())
  GAME_IMG.set('bihu_bugs', bihu())
  GAME_IMG.set('black_bugs', blackBug())
  GAME_IMG.set('bullets', bullet())
  GAME_IMG.set('hand', hand())
  GAME_IMG.set('over',over())
  GAME_IMG.set('houseIcon',houseIcon())
  GAME_IMG.set('learnBg',learnBg())
  GAME_IMG.set('speedIcon',speedIcon())
}

const getImgByName = (name) => {
  for (let obj of databus.allImages) {
    if (obj.name == name) {
      return obj
    }
  }
}
