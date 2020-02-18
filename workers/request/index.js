worker.onMessage(function (data) {
  console.log('11111111',data.msg)
  let databus = data.msg
  let temp = []
  databus.corpses.forEach((item) => {
    if (item.visible) {
      temp.push(item)
    }
  })
  databus.corpses = temp
  temp = []
  databus.enemys.forEach((item) => {
    if (item.visible) {
      temp.push(item)
    }
  })
  databus.enemys = temp
  temp = []
  databus.bullets.forEach((item) => {
    if (item.visible) {
      temp.push(item)
    }
  })
  databus.bullets = temp

  temp = []
  databus.gameTools.forEach((item) => {
    if (item.visible) {
      temp.push(item)
    }
  })
  databus.gameTools = temp
  worker.postMessage({
    msg: databus
  })
})