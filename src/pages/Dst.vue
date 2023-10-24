<template>
  <div class="page">
    <div class="title">数字符号试验(DST)</div>
    <div class="tips">
      受试者在测定90s内按顺序依次写出的与数字相应的符号数,正确为 1 分,
      倒转为半分, 错误为0分
    </div>
    <div class="rule">
      <div class="item" v-for="(item, index) in defaultNumbers" :key="index">
        <div style="border-bottom: 1px solid #333">{{ item.number }}</div>
        <div>{{ item.icon }}</div>
      </div>
    </div>
    <div class="bigCanvas">
      <div class="part">
        <div
          class="item"
          v-for="(item, index) in [2, 1, 3, 7, 2]"
          :key="index"
          :style="{ borderLeft: index == 0 ? '1px solid #333' : 'none' }"
        >
          <div style="border-bottom: 1px solid #333">{{ item }}</div>
          <div></div>
        </div>
      </div>
      <canvas id="canvas" />
      <img style="width: 50; height: 50" id="renderedImg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ssim from "ssim.js";
import { nextTick, onMounted } from "vue";
import {
  getPHashFingerprint,
  cosineSimilarity,
  hammingDistance,
} from "../utils/index";
import { createWorker } from 'tesseract.js';

const defaultNumbers = [
  {
    number: 1,
    icon: "-",
  },
  {
    number: 2,
    icon: "y",
  },
  {
    number: 3,
    icon: "]",
  },
  {
    number: 4,
    icon: "L",
  },
  {
    number: 5,
    icon: "U",
  },
  {
    number: 6,
    icon: "0",
  },
  {
    number: 7,
    icon: "",
  },
  {
    number: 8,
    icon: "x",
  },
  {
    number: 9,
    icon: "=",
  },
];

let cavs: any;
let ctx: any;
let myPaths: any = [];
let canvRect: any;
let startDraw = false;

function bindEventAndDraw() {
  cavs.addEventListener("mousedown", (event: any) => {
    const { x, y } = event;
    onTouchStart(x, y);
  });
  cavs.addEventListener("mousemove", (event: any) => {
    const { x, y } = event;
    onTouchMove(x, y);
  });
  cavs.addEventListener("mouseup", (event: any) => {
    const { x, y } = event;
    console.log("dddddddd");
    startDraw = false;
    onTouchEnd(x, y);
  });
  cavs.addEventListener("touchstart", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchStart(x, y);
  });
  cavs.addEventListener("touchmove", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchMove(x, y);
  });
}

function onTouchStart(x, y) {
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;
  startDraw = true;
  myPaths.push({
    points: [
      {
        x: cx,
        y: cy,
      },
    ],
  });
}
function onTouchMove(x, y) {
  if (!startDraw) return;
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;
  const lastPath = myPaths[myPaths.length - 1];
  lastPath.points.push({
    x: cx,
    y: cy,
  });

  drawThePic(myPaths);
}

function onTouchEnd(x, y) {
  /// 一段画完了,  按需 截取 然后对比图形

  checkThePathSSIM();
}

function testPic(imageData) {
  var newCanvas = document.createElement("canvas");
  newCanvas.width = 32;
  newCanvas.height = 32;

  // 将图像数据放入新 Canvas
  var newCtx = newCanvas.getContext("2d");
  newCtx.putImageData(imageData, 0, 0);

  // 创建图像对象
  var img = document.getElementById("renderedImg");
  const imgUrl = newCanvas.toDataURL("image/png");
  img.src = imgUrl;


  testTerrocs(img)

  //  // 保存到本地
  // const downloadLink = document.createElement('a');
  // downloadLink.download = 'my_image.png';
  // downloadLink.href = imgUrl;
  // downloadLink.click();
}


 async function testTerrocs(imgUrl) {
  const worker = await createWorker('eng');
  const ret = await worker.recognize(imgUrl);
  console.log(ret.data.text);
  await worker.terminate();
}

function drawThePic(paths) {
  const colors = ["#333", "red", "green", "blue", "orange", "purple"];
  paths.forEach((path: any, index: number) => {
    ctx.beginPath();
    ctx.strokeStyle = "#333";
    ctx.moveTo(path.points[0].x, path.points[0].y);
    path.points.slice(1).forEach((point: any) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });

  console.log(paths);
}

/// 开个线程, 取意义比对截取的图形
function checkThePathSSIM() {
  const img1 = ctx.getImageData(0, 32, 32, 32);
  const img2 = ctx.getImageData(32, 32, 32, 32);
  // console.log(img1)
  // const { mssim, performance } = ssim(img1, img2, { k1: 0.02 ,k2: 0.03,bitDepth:8,windowSize:13,ssim:'original', maxSize:32});
  // console.log('mssim:'+mssim + '---:'+performance)
// testTerrocs(img1)
  testPic(img1)


  //   const cos1 =getPHashFingerprint(img1)
  //   const cos2 = getPHashFingerprint(img2)
  //   const vector1 = cos1.split('').map(bit => parseInt(bit));
  //   const vector2 = cos2.split('').map(bit => parseInt(bit));

  //  const siml =  cosineSimilarity(vector1,vector2)

  // console.log(siml);
}

onMounted(() => {
  nextTick(() => {
    cavs = document.getElementById("canvas");
    const dom = document.getElementsByClassName("bigCanvas")[0];
    const rect = dom.getBoundingClientRect();
    canvRect = rect;
    cavs.width = rect.width;
    cavs.height = rect.height;
    ctx = cavs.getContext("2d", { willReadFrequently: true });
    bindEventAndDraw();
  });
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

.rule {
  margin-top: 20px;
  display: inline-grid;
  grid-template-columns: repeat(9, auto);
  grid-column-gap: 20px;
}
.item {
  border: 1px solid #333;
  font-size: 18px;

  div {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.bigCanvas {
  margin-top: 30px;
  position: relative;
}

#canvas {
  position: absolute;
  top: 0;
}

.part {
  display: grid;
  grid-template-columns: repeat(9, auto);
}
</style>
