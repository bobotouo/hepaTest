
/// 图片算法相关


/// 特征提取
function memoizeCosines (N: number, cosMap: any) {
    cosMap = cosMap || {}
    cosMap[N] = new Array(N * N)
  
    let PI_N = Math.PI / N
  
    for (let k = 0; k < N; k++) {
      for (let n = 0; n < N; n++) {
        cosMap[N][n + (k * N)] = Math.cos(PI_N * (n + 0.5) * k)
      }
    }
    return cosMap
  }
  
  function dct (signal: number[], scale: number = 2) {
    let L = signal.length
    let cosMap: any = null
  
    if (!cosMap || !cosMap[L]) {
      cosMap = memoizeCosines(L, cosMap)
    }
  
    let coefficients = signal.map(function () { return 0 })
  
    return coefficients.map(function (_, ix) {
      return scale * signal.reduce(function (prev, cur, index) {
        return prev + (cur * cosMap[L][index + (ix * L)])
      }, 0)
    })
  }
  // 一维数组升维
function createMatrix (arr: number[]) {
    const length = arr.length
    const matrixWidth = Math.sqrt(length)
    const matrix = []
    for (let i = 0; i < matrixWidth; i++) {
      const _temp = arr.slice(i * matrixWidth, i * matrixWidth + matrixWidth)
      matrix.push(_temp)
    }
    return matrix
  }
  
  // 从矩阵中获取其“左上角”大小为 range × range 的内容
  function getMatrixRange (matrix: number[][], range: number = 1) {
    const rangeMatrix = []
    for (let i = 0; i < range; i++) {
      for (let j = 0; j < range; j++) {
        rangeMatrix.push(matrix[i][j])
      }
    }
    return rangeMatrix
  }

  /// 感知哈希特征提取
  export function getPHashFingerprint (imgData: ImageData) {
    const dctData = dct(imgData.data as any)
    const dctMatrix = createMatrix(dctData)
    const rangeMatrix = getMatrixRange(dctMatrix, dctMatrix.length / 8)
    const rangeAve = rangeMatrix.reduce((pre, cur) => pre + cur, 0) / rangeMatrix.length 
    return rangeMatrix.map(val => (val >= rangeAve ? 1 : 0)).join('')
  }


  /// 汉明距离 对比
  export function hammingDistance (str1: string, str2: string) {
    let distance = 0
    const str1Arr = str1.split('')
    const str2Arr = str2.split('')
    str1Arr.forEach((letter, index) => {
      if (letter !== str2Arr[index]) {
        distance++
      }
    })
    return distance
  }


  /// cos 余弦相似度对比
  export function cosineSimilarity (sampleFingerprint: number[], targetFingerprint: number[]) {
    // cosθ = ∑n, i=1(Ai × Bi) / (√∑n, i=1(Ai)^2) × (√∑n, i=1(Bi)^2) = A · B / |A| × |B|
    const length = sampleFingerprint.length
    let innerProduct = 0
    for (let i = 0; i < length; i++) {
      innerProduct += sampleFingerprint[i] * targetFingerprint[i]
    }
    let vecA = 0
    let vecB = 0
    for (let i = 0; i < length; i++) {
      vecA += sampleFingerprint[i] ** 2
      vecB += targetFingerprint[i] ** 2
    }
    const outerProduct = Math.sqrt(vecA) * Math.sqrt(vecB)
    return innerProduct / outerProduct
  }