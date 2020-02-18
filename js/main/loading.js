import {
  groundWidth,
  groundHeight,
  screenWidth,
  screenHeight
} from '../utils/common'
export const  renderLoding = (ctx, finish) => {
  let length = (screenWidth - 300) / 2
  let leftP = (screenWidth - 386) / 2
  // let iniY = (screenHeight - panelWidth * (200 / 470)) / 2 
  /*---------------------外框-------------------------》*/

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#82E4F2";
  ctx.beginPath();
  ctx.arc(leftP, screenHeight - 100, 8, Math.PI / 2, Math.PI / 2 * 3, false);

  ctx.moveTo(leftP, screenHeight - 108);
  ctx.lineTo(screenWidth - leftP, screenHeight - 108);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(leftP, screenHeight - 92);
  ctx.lineTo(screenWidth - leftP, screenHeight - 92);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(screenWidth - leftP, screenHeight - 100, 8, Math.PI / 2 * 3, Math.PI / 2, false);
  ctx.stroke();

  /*----------------------------------------------《*/
  let langthWidth = screenWidth - 2 * leftP
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.moveTo(leftP, screenHeight - 100);
  ctx.lineTo(langthWidth * finish + leftP, screenHeight - 100);
  ctx.stroke();
  if (finish == 1) {
    // new Main(ctx)
  }
}
export const initRender = (ctx, core,image) => {
  console.log(core,ctx)
  let panelWidth = 400
  let iniY = (screenHeight - panelWidth * (200 / 470)) / 2
  let iniX = screenWidth / 2 - panelWidth / 2
  ctx.clearRect(0, 0, groundWidth, groundHeight)
  ctx.fillStyle = "#82E4F2"
  ctx.font = "20px Arial"
  ctx.fillText(~~core + '%',
    screenWidth / 2 - 20,
    iniY + panelWidth * (200 / 470) - 40
  )
  ctx.drawImage(image, 0, 0, 470, 200, iniX, iniY - 50, panelWidth, panelWidth * (200 / 470))
  renderLoding(ctx, core / 100)
}