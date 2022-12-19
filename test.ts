/**
 给定一个非负整数num。 对于0<=i<=num的每个整数i，计算i对于的二进制数中的1的数目，并将它们返回。
 示例：
 输入：2
 输出: [0,1,1]
 解释：0、1、2对应的二进制为:0,1,10。所以1的个数：[0,1,1]

 输入：5
 输出: [0,1,1,2,1,2]
 解释：0、1、2、3、4、5对应的二进制为:0,1,10,11,100,101。所以1的个数：[0,1,1,2,1,2]
 */


const fun = (num) => {
  const targets = [];
  const resultTarget = new Array(num);

  for (let i = 0; i < 16; i++) {
    targets.push(mapNum(i));
  }


  const first = num && 0xff000000 >>> 24;
  const second = num && 0x00ff0000 >>> 16;
  const third = num && 0x0000ff00 >>> 8;
  const fouth = num && 0x000000ff;

  // const firstTarget = targets.slice(0, first);
  // const secondTarget = targets.slice(0, second);
  // const thirdTarget = targets.slice(0, third);
  // const fouthTarget = targets.slice(0, fouth);
  //
  let count = 0;
  let high;
  if (first > 0) {
    count = 4;
    high = first;
  } else if (second > 0) {
    count = 3;
    high = second;
  } else if (third > 0) {
    count = 2;
    high = third;
  } else if (fouth > 0) {
    count = 1;
  }

  let highNum = mapNum(high);
  for (let i = count; i > 0; i++) {
    resultTarget.splice(high << (count - 1), 16, targets.map(it => it + highNum));
    high =
    highNum = mapNum(high);
  }

};

const mapNum = (num) => {
  switch (num) {
    case 0:// 0
      return 0;
    case 1: // 1
    case 2:// 10
    case 4:// 100
    case 8:// 1000
      return 1;
    case 3:// 11
    case 5:// 101
    case 6:// 110
    case 9:// 1001
    case 10:// 1010
    case 12:// 1100
      return 2;
    case 7:// 111
    case 11:// 1011
    case 13:// 1101
    case 14:// 1110
      return 3;
    case 15:// 1111
      return 4;
  }
};


// 0000 0000 2`

//  1111 1111 +
//  0000 0010
// 10000 0001
// 10000 0010
// 10000 0011 0000 0000;
// 10000 0100
// 10000 0101

//
