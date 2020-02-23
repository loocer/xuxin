export const icon = [{
    name: 'boom-icon',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/icon/boom.png',
  },
  {
    name: 'addspeed-icon',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/icon/add-speed.png',
  }, {
    name: 'fire-color',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/icon/firing.png'
  },
  {
    name: 'mosterHouse',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/icon/moster-house.png'
  },{
    name: 'bullets',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/icon/bullets.png'
  }
]
export const over = [{
  name: 'over1',
  fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/button/over1.png'
}, {
  name: 'over2',
  fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/bg/BG.png'
},
{
  name: 'over3',
  fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/button/fwe.png'
}]
export const hand = [{
  name: 'hand',
  fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/button/hand.png'
}]
export const booms = [{
    name: 'boom1',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/booms/1.png',
  },
  {
    name: 'boom2',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/booms/2.png',
  },
  {
    name: 'boom3',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/booms/3.png',
  },
  {
    name: 'boom4',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/booms/4.png',
  },
  {
    name: 'boom5',
    fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/booms/5.png',
  }
]
export const antBug = (() => {
  let list = []
  for (let i = 1; i < 6; i++) {
    list.push({
      name: 'antBugs' + i,
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/enemy_ant/${i}.png`,
    })
  }
  return list
})()
export const bihuBug = (() => {
  let list = []
  for (let i = 1; i < 6; i++) {
    list.push({
      name: 'bihuBugs' + i,
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/enemy_bihu/${i}.png`,
    })
  }
  return list
})()
export const yellowBug = (() => {
  let list = []
  for (let i = 1; i < 21; i++) {
    list.push({
      name: 'yellowBugs' + i,
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/enemy_yellowBug/${i}.png`,
    })
  }
  return list
})()

export const learnBg = (() => {
  let list = []
  for (let i = 1; i < 4; i++) {
    list.push({
      name: 'learnBg' + i,
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/bg/learn${i}.png`,
    })
  }
  return list
})()
export const blackBug = (() => {
  let list = []
  for (let i = 1; i < 6; i++) {
    list.push({
      name: 'blackBugs' + i,
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/enemy_blackBug/${i}.png`,
    })
  }
  return list
})()
export const bullet = (() => {
  let list = [{
      name: 'bullet1',
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/bullets/bullet.png`,
    },
    {
      name: 'bullet2',
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/bullets/tanst.png`,
    },
    {
      name: 'bullet3',
      fileId: `cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/bullets/ggg.png`,
    }
  ]
  return list
})()
export const netResourse = [{
  name: 'title',
  fileId: 'cloud://imge8-5z6gt.696d-imge8-5z6gt-1300789023/button/tittle.png',
}, ...booms, ...icon, ...yellowBug, ...over, ...antBug, ...bihuBug, ...blackBug, ...bullet, ...hand,...learnBg]