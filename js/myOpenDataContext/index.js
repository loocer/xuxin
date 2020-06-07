let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext('2d');

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;

let sysInfo = wx.getSystemInfoSync(),
  width = sysInfo.windowWidth,
  height = sysInfo.windowHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

// sharedCanvas.width = sharedCanvas.width * ratio;
// sharedCanvas.height = sharedCanvas.width * ratio;

let itemCanvas = wx.createCanvas();
let ctx = itemCanvas.getContext('2d');
//==================================

context.scale(ratio, ratio)


//==================================
let startY = 0, moveY = 0, list = [],isGetFlag=false;
let myScore = undefined;
let myfriends = []
let allInfo = {}


// getUserInfo();

// 初始化标题返回按钮等元素
function initEle(data) {
  renderGameOver(ctx)
}
let showRanking=()=>{
  if (list.length == 0) {
    wx.getFriendCloudStorage({
      keyList: ['score'],
      success: function (res) {
        isGetFlag=true
        list = res
        paixu(res.data)
        // initEle(data)
        initRanklist()
      }
    });
  } else {
    initRanklist()
  }
}
let addNewScore= (data)=>{
  getMyScore().then((score)=>{
    console.log(score, data.score)
    
    if (data.score > score){
      var kvDataList = new Array();
      kvDataList.push({
        key: "score",
        value: data.score + ''
      });
      wx.setUserCloudStorage({
        KVDataList: kvDataList
      })
    }
  })

}



function paixu(arry){
  arry.sort(function (a, b) {
    return -(a.KVDataList[0].value - b.KVDataList[0].value)
  })
  for (let obj of arry){
    let atlas = wx.createImage();
    atlas.src = obj.avatarUrl
    obj.atlas = atlas
  }
  list = arry
  allInfo.allHeight = list.length*40
  allInfo.maxMoveTop = allInfo.allHeight - screenHeight
}
function initRanklist() {
  let panelWidth = 500
  context.fillStyle = 'rgba(0, 0, 0,1)';
  context.fillRect(0, 0, screenWidth, screenHeight);
  context.fillStyle = '#fff';
  let tempx = 20, tempy =0
  let index =  -moveY/100
  let temp = 1
  for (let obj of list){
    tempy = index*100
    let name =obj.nickname.substring(0, 4)
    let core =obj.KVDataList[0].value
    context.font = '40px Arial';
    context.fillText(
      temp,
      tempx +20,
      tempy + 50
    )
    context.drawImage(
      obj.atlas,
      0, 0, 200, 200,
      tempx + 110,
      tempy,
      100,80
    )
    context.fillText(
      name,
      tempx + 250,
      tempy + 50
    )
    context.fillText(
      core,
      tempx + 500,
      tempy + 50
    )
    
    index++
    temp++
  }
}

// 绘制自己的排名
function drawMyRank() {
  if (myInfo.avatarUrl && myScore) {
    let avatar = wx.createImage();
    avatar.src = myInfo.avatarUrl;
    avatar.onload = function () {
      context.drawImage(avatar, 180, 960 + 24, 70, 70);
    }
    context.fillStyle = '#fff';
    context.font = '28px Arial';
    context.textAlign = 'left';
    context.fillText(myInfo.nickName, 270, 960 + 72);
    context.font = 'bold 36px Arial';
    context.textAlign = 'right';
    context.fillText(myScore || 0, 630, 960 + 76);
    // 自己的名次
    if (myRank !== undefined) {
      context.font = 'italic 44px Arial';
      context.textAlign = 'center';
      context.fillText(myRank + 1, 126, 960 + 80);
    }
  }
  // context.fillRect(40, 480, screenWidth - 40 * 2, 60);
}
// 因为头像绘制异步的问题，需要重新绘制
function reDrawItem(y) {
  context.clearRect(80, 350, 750 - 80 * 2, 590);
  context.fillStyle = '#302F30';
  context.fillRect(80, 350, 750 - 80 * 2, 590);
  context.drawImage(itemCanvas, 0, y, 750 - 80 * 2, 590, 80, 350, 750 - 80 * 2, 590);
  //
  // context.drawImage(itemCanvas, 40, y+175, screenWidth - 40 * 2, 295);
}
function sortByScore(data) {
  let array = [];
  data.map(item => {

    array.push({
      avatarUrl: item.avatarUrl,
      nickname: item.nickname,
      openid: item.openid,
      score: item['KVDataList'][1] && item['KVDataList'][1].value != 'undefined' ? item['KVDataList'][1].value : (item['KVDataList'][0] ? item['KVDataList'][0].value : 0) // 取最高分
    })

  })
  array.sort((a, b) => {
    return a['score'] < b['score'];
  });
  myRank = array.findIndex((item) => {
    return item.nickname === myInfo.nickName && item.avatarUrl === myInfo.avatarUrl;
  });
  if (myRank === -1)
    myRank = array.length;

  return array;
}
// 开放域的getUserInfo 不能获取到openId, 可以在主域获取，并从主域传送
function getUserInfo() {
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: res => {
      myInfo = res.data[0];
    },
    fail: res => {

    }
  })
}

// 获取自己的分数
function getMyScore() {
  return new Promise((resive)=>{
    wx.getUserCloudStorage({
      keyList: ['score', 'maxScore'],
      success: res => {
        let data = res;
        if (data.KVDataList.length == 0) {
          resive(0)
        }else{
          resive(data.KVDataList[0].value)
        }
      }
    });
  })
  
}

function saveMaxScore(maxScore) {
  wx.setUserCloudStorage({
    KVDataList: [{ 'key': 'maxScore', 'value': ('' + maxScore) }],
    success: res => {
      console.log(res);
    },
    fail: res => {
      console.log(res);
    }
  });
}

function getFriendsRanking() {
  wx.getFriendCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res.data;
      console.log(res.data);
      // drawRankList(data);
      initRanklist(sortByScore(data));
      drawMyRank();
    }
  });
}
function drawLearn(){

}
function getGroupRanking(ticket) {
  wx.getGroupCloudStorage({
    shareTicket: ticket,
    keyList: ['score', 'maxScore'],
    success: res => {
      console.log('getGroupCloudStorage:success');
      console.log(res.data);
      let data = res.data;
      initRanklist(sortByScore(data));
      drawMyRank();
    },
    fail: res => {
      console.log('getGroupCloudStorage:fail');
      console.log(res.data);
    }
  });
}
// getGroupRanking();
wx.onMessage(data => {
  if (data.command=='addScore'){
    addNewScore(data.data)
  }
  if (data.command=='learn'){
    drawLearn()
  }
  if (data.command == 'showRanking') {
    isGetFlag=false
    let getFlag = setInterval(()=>{
      if (isGetFlag){
        clearInterval(getFlag)
      }
      showRanking()
    },500)
    // while (!isGetFlag) {
    //    showRanking()
    // }
  }
  
  // list = data.data
  // getFriendsRanking()
  // if (data.type === 'friends') {
  //   // sharedCanvas.height = screenHeight;
  //   getFriendsRanking();
  //   getMyScore();
  // } else if (data.type === 'group') {
  //   getGroupRanking(data.text);
  //   getMyScore();
  // } else if (data.type === 'updateMaxScore') {
  //   // 更新最高分
  //   console.log('更新最高分');
  //   getMyScore();
  // }
});


// 触摸移动事件
wx.onTouchMove(e => {
  
  let touch = e.touches[0].clientY;
  
  startY = !startY ? touch: startY
  moveY = (startY - touch)*2 + moveY
  startY = touch
  // console.log('++++++++', moveY, touch, startY)
  initRanklist()
  // // 触摸移动第一次触发的位置
  // if (startY === undefined) {
  //   startY = touch.clientY + moveY;
  // }
  // moveY = startY - touch.clientY;
  // reDrawItem(moveY);
});
wx.onTouchEnd(e => {
  // console.log(e)
  // let touch = e.touches[0];
  // startY =0
  // startY = undefined;
  if (moveY < 0) { // 到顶
    moveY = 0;
  } else if (moveY > (list.length-2)*100) { // 到底
    moveY = (list.length - 2) * 100;
  }
  initRanklist()
  // reDrawItem(moveY);
});
wx.onTouchStart(e => {

  // reDrawItem(moveY);
});
wx.onTouchStart(e => {
  let touch = e.touches[0];
  startY = touch.moveY
  // startY = undefined;
  // if (moveY < 0) { // 到顶
  //   moveY = 0;
  // } else if (moveY > itemCanvas.height - 590) { // 到底
  //   moveY = itemCanvas.height - 590;
  // }
  // reDrawItem(moveY);
});