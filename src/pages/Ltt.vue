<template>
  <div class="page">
    <div class="title">轨迹描绘实验 (LTT)</div>
    <div class="tips">
      在两条线中间划线, 不要穿越过或接触两线,描绘中不能将离开屏幕,不能中断
    </div>
    <div class="hb">
      <canvas id="canvas" width="500" height="500" />
      <canvas id="stoken" width="500" height="500"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import svgIcon from "./svgCanvas.js";

let canv: any, ctx: any, canvRect: any;
let hbCanv:any, hbCtx:any
let mapPath: any = [
  {
    points: [],
  },
];

let startDraw = false;

function bindEventAndDraw() {
  hbCanv.addEventListener("mousedown", (event: any) => {
    const { x, y } = event;
    onTouchStart(x, y);
  });
  hbCanv.addEventListener("mousemove", (event: any) => {
    const { x, y } = event;
    onTouchMove(x, y);
  });
  hbCanv.addEventListener("mouseup", (event: any) => {
    const { x, y } = event;
    console.log("dddddddd");
    onTouchEnd(x, y);
  });
  hbCanv.addEventListener("touchstart", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchStart(x, y);
  });
  hbCanv.addEventListener("touchmove", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchMove(x, y);
  });
  //   canv.addEventListener("touchend", (event: any) => {

  //   });
}

function onTouchStart(x, y) {
  // console.log(`touchu${x+','+y}`)
  // 转换一下坐标系
  startDraw = true;
}
function onTouchMove(x, y) {
  // console.log(`move${x+','+y}`)
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;
  /// 最后一个点(移动设备, touchend 没有这个点)
  if (!startDraw) return;
  mapPath[0].points.push({
    x: cx,
    y: cy,
  });
  drawTheLines(mapPath);

  console.log(`x:${cx}--y:${cy}`);
  //// 判断点是否在 path 内部
  const bb = ctx.isPointInPath(cx, cy, "nonzero");
  console.log(bb);
}

function onTouchEnd(x, y) {
  startDraw = false;
  /// 查看所在位置是否正确
  //   console.log(checkNumers)
}

function drawTheLines(paths) {
  const colors = ["red", "green", "blue", "orange", "purple"];
  paths.forEach((path: any, index: number) => {
    hbCtx.beginPath();
    hbCtx.strokeStyle = colors[index];
    hbCtx.moveTo(path.points[0].x, path.points[0].y);
    path.points.slice(1).forEach((point: any) => {
      hbCtx.lineTo(point.x, point.y);
    });
    hbCtx.stroke();
  });
}

onMounted(() => {
  canv = document.getElementById("canvas");
  canvRect = canv.getBoundingClientRect();
  ctx = canv.getContext("2d");

  hbCanv = document.getElementById('stoken')
  hbCtx = hbCanv.getContext("2d")

  bindEventAndDraw();
  /// 画出来
  svgIcon.lttSvg.draw(ctx);
});
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-top: 50px;
}
.tips {
  margin-top: 10px;
}
.hb{
  position: relative;
}
#stoken{
  position: absolute;
  left: 0;
  top: 0;
}
</style>
