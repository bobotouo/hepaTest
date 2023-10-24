<template>
  <div class="page">
    <div class="title">数字连接试验A (NCTA)</div>
    <div class="tips">
      请将任意排列的1至25数字按顺序连接起来。在正式开始之后,将会记录完成的时间
    </div>
    <div mt-20px>完成总用时:{{ totalTime +'s' }}</div>
    <div class="backelements">
      <div
        class="circle"
        v-for="(item, index) in pointsArray"
        :key="index"
        :style="{
          position: 'absolute',
          top: item.y - 25 + 'px',
          left: item.x - 25 + 'px',
        }"
      >
        <div class="circle-label">{{ index + 1 }}</div>
      </div>
      <div class="tip-label" :style="labelLocation(0)">开始</div>
      <div class="tip-label" :style="labelLocation(1)">结束</div>
      <canvas @touchend.native.prevent="touchendddd" width="550" height="600" id="canvas" />
      <view @click="startLink" class="start-btn" v-if="!startClick">
        点我开始
      </view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from "vue";


let startClick = false
let totalTime = 0

const pointsArray = [
  {
    x: 280,
    y: 400,
  },
  {
    x: 300,
    y: 240,
  },
  {
    x: 505,
    y: 290,
  },
  {
    x: 490,
    y: 510,
  },
  {
    x: 450,
    y: 400,
  },
  {
    x: 340,
    y: 550,
  },
  {
    x: 390,
    y: 480,
  },
  {
    x: 200,
    y: 320,
  },
  {
    x: 200,
    y: 480,
  },
  {
    x: 150,
    y: 555,
  },
  {
    x: 120,
    y: 385,
  },
  {
    x: 110,
    y: 255,
  },
  {
    x: 440,
    y: 210,
  },
  {
    x: 360,
    y: 295,
  },
  {
    x: 510,
    y: 125,
  },
  {
    x: 370,
    y: 125,
  },
  {
    x: 240,
    y: 155,
  },
  {
    x: 440,
    y: 75,
  },
  {
    x: 510,
    y: 40,
  },
  {
    x: 270,
    y: 60,
  },
  {
    x: 140,
    y: 90,
  },
  {
    x: 40,
    y: 160,
  },
  {
    x: 70,
    y: 460,
  },
  {
    x: 50,
    y: 330,
  },
  {
    x: 40,
    y: 540,
  },
];

let canv: any = null;
let ctx: any;
let canvRect: any;
/// 撤销所需保存的路径

let startDraw = false;

let lastIndex = -1; //// 上次所在元素位置 -1为元素外,
let lastll = -1; //// 上一次 鼠标位置
let mapPath: any = [
  {
    points: [],
  },
]; 

/// 线段路径
let indexPaths: any = {};

/// touchend 最后坐标位置保存
 let lastTouchPoint:any = {}


/// label 位置
function labelLocation(index:number){
    if(index == 0){
        return {
            top:pointsArray[0].y-30 + 'px',
            left: pointsArray[0].x-52 + 'px'
        }
    }
    return {
        top:pointsArray[pointsArray.length-1].y+30 +'px',
        left:pointsArray[pointsArray.length-1].x-25+'px'
    }

}

function canvasSetting() {
  // 设置
  canv = document.getElementById("canvas");
  canvRect = canv.getBoundingClientRect();
  ctx = canv.getContext("2d");
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#333";
  ctx.lineCap = "round";
}

function bindEventAndDraw() {
  canv.addEventListener("mousedown", (event: any) => {
    const { x, y } = event;
    onTouchStart(x, y);
  });
  canv.addEventListener("mousemove", (event: any) => {
    const { x, y } = event;
    onTouchMove(x, y);
  });
  canv.addEventListener("mouseup", (event: any) => {
    const { x, y } = event;
    console.log("dddddddd");
    onTouchEnd(x, y);
  });
  canv.addEventListener("touchstart", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchStart(x, y);
  });
  canv.addEventListener("touchmove", (event: any) => {
    const { pageX: x, pageY: y } = event.touches[0];
    onTouchMove(x, y);
  });
//   canv.addEventListener("touchend", (event: any) => {

//   });
}

function touchendddd(event:any){
    console.log('gggggggggggggg')
    onTouchEnd(lastTouchPoint.x, lastTouchPoint.y);
}

function onTouchStart(x, y) {
  // console.log(`touchu${x+','+y}`)
  // 转换一下坐标系
  if(!startClick) return
  startDraw = true;
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;

  let ll = caucleTheLocation(cx, cy);
  lastIndex = ll; /// 起始位置
  console.log(ll);

  const lastPath = mapPath[mapPath.length - 1];
  lastPath.points = [
    {
      x: cx,
      y: cy,
    },
  ];
}
function onTouchMove(x, y) {
  // console.log(`move${x+','+y}`)
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;
  /// 最后一个点(移动设备, touchend 没有这个点)
  lastTouchPoint = {
    x:cx,
    y:cy
  }

  if (!startDraw) return;
  let ll = caucleTheLocation(cx, cy);
  //   console.log(ll);
  ////  -1 到 大于 0  表明进入元素 // 开始分割
  splitThePath(
    {
      x: cx,
      y: cy,
    },
    ll
  );

  if (ll > 0) {
    lastIndex = ll;
  }

  drawTheLines(mapPath);
  //保存上一次位置
  lastll = ll;
}

function onTouchEnd(x, y) {
  const cx = x - canvRect.left;
  const cy = y - canvRect.top;
  startDraw = false;
  console.log("抬手,看看是否需要取消");
  //   undoPaths.push(currentCanvPath);

  let ll = caucleTheLocation(cx, cy);

  console.log(lastIndex);
  if (lastIndex == ll || ll - lastIndex != 1) {
    //// 产生闭环, 出现错误, 舍弃这条线段 最后一段肯定是错的
    const lastPP = mapPath[mapPath.length - 1];
    lastPP.delete = true; // 标记这段不要了
  }

  checkTheLineIsNeed();
  cancelTheErrorLine();

  /// 查看所在位置是否正确
  //   console.log(checkNumers)
}

/// 从进入元素就开始分割
function splitThePath(point, ll) {
  ////  分段路径
  if (lastll < 0 && ll > 0) {
    console.log(lastll);
    // 相同的这个末尾点 都加一下
    const lastP1 = mapPath[mapPath.length - 1]; ///相同这个点
    lastP1.points.push({
      x: point.x,
      y: point.y,
    });
    /// 产生一个新的路径数组
    mapPath.push({
      points: [],
    });
    // const lst = mapPath[mapPath.length - 1]; // 上一段结束了
    // console.log(lastIndex+'---dasda')
    // if (ll - lastIndex != 1) {
    //   lst.delete = true; /// 标记
    // }
  }
  const lastPP = mapPath[mapPath.length - 1];
  lastPP.points.push({
    x: point.x,
    y: point.y,
  });
}

/// ** 判断点在哪个元素上
function caucleTheLocation(x, y) {
  let location = -1;
  /// 查询所有 圆心位置, 计算距离
  for (let index = 0; index < pointsArray.length; index++) {
    const circle = pointsArray[index];
    const distance = Math.sqrt(
      Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)
    );
    // 判断半径
    // console.log("x:" + x + ",y:" + y + "," + circle.x + "," + circle.y);
    if (distance <= 25) {
      location = index + 1;
      return location;
    }
  }
  return location;
}

//// 画线
function drawTheLines(paths) {
  const colors = ["#333", "red", "green", "blue", "orange", "purple"];
  paths.forEach((path: any, index: number) => {
    ctx.beginPath();
    ctx.strokeStyle = colors[index];
    ctx.moveTo(path.points[0].x, path.points[0].y);
    path.points.slice(1).forEach((point: any) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });
}

///  判断分段线条是否需要
function checkTheLineIsNeed() {
  if (mapPath.length < 2) {
    /// 说明不在任何元素上, 直接标记删除
    mapPath[0].delete = true;
  } else {
    for (let index = 0; index < mapPath.length; index++) {
      const element = mapPath[index];
      if (element.points.length <= 2) {
        element.delete = true;
        continue;
      }
      const loc = element.points[0];
      const end = element.points[element.points.length - 1];

      const startNumber = caucleTheLocation(loc.x, loc.y);
      const endNumber = caucleTheLocation(end.x, end.y);
      console.log("end:" + endNumber + "---start:" + startNumber);
      if (endNumber - startNumber != 1) {
        element.delete = true;
      }
      /// 要按顺序, 如果中途出错, 后面的全算错误
      if (!element.delete && !indexPaths[`${startNumber}`]) {
        indexPaths[`${startNumber}`] = element;
      }
    }
  }
}

///撤销错误的线条
function cancelTheErrorLine() {
  // console.log(canvRect)

  ctx.clearRect(0, 0, canvRect.width, canvRect.height);
  ctx.beginPath();
  mapPath = [
    {
      points: [],
    },
  ];

  for (let index = 0; index < Object.keys(indexPaths).length; index++) {
    /// 画出正确的线, 清除错误的线
    const path = indexPaths[`${index + 1}`];
    if (path) {
      ctx.moveTo(path.points[0].x, path.points[0].y);
      path.points.slice(1).forEach((point: any) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }else{
        return
    }
  }
}


function startLink(){
  /// 
  // 开始画图

}

onMounted(() => {
  nextTick(() => {
    canvasSetting();
    bindEventAndDraw();
  });
  console.log('休息休息')
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

.backelements {
  width: 550px;
  height: 600px;
  // background-color: red;
  border: 1px solid #eee;
  margin-top: 50px;
  position: relative;
}

.circle {
  border: 2px solid #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.tip-label{
    font-size: 15px;
    color: #666;
    position: absolute;
}
.start-btn{
  font-size: 15px;
  width: 120px;
  height: 40px;
  position: absolute;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: #e4b56f;
  color: #fff;
  top: calc(50% - 20px);
  left:calc(50% - 60px);
  cursor: pointer;
}
</style>
