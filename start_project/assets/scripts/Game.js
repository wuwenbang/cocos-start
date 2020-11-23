// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // 这个属性引用了星星的预制资源
    starPrefab: {
      default: null,
      type: cc.Prefab,
    },
    // 星星产生后消失时间的随即范围
    maxStarDuration: 0,
    minStarDuration: 0,
    // 地面节点，用于确定星星生成的高度
    ground: {
      default: null,
      type: cc.Node,
    },
    // Player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    player: {
      default: null,
      type: cc.Node,
    },
  },
  onLoad: function () {
    // 获取地平面的 y 轴座标
    this.groundY = this.ground.y + this.ground.height / 2
    // 生成一个新的星星
    this.spawnNewStar()
  },
  spawnNewStar: function () {
    // 使用给定的模版在场景中生成一个新的节点
    var newStar = cc.instantiate(this.starPrefab)
    // 新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar)
    // 为星星设置一个随机位置
    newStar.setPosition(this.getNewStarPosition())
  },
  getNewStarPosition: function () {
    var randX = 0
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
    var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50
    // 根据屏幕宽度，随机得到一个星星的 x 坐标
    var maxX = this.node.width / 2
    // Math.random => 0 ~ 1 => - 0.5 => - 0.5 ~ 0.5
    randX = (Math.random() - 0.5) * 2 * maxX
    // 返回星星坐标
    return cc.v2(randX, randY)
  },
  start() {},
})
