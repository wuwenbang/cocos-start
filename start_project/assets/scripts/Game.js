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
    // score label 的引用
    scoreDisplay: {
      default: null,
      type: cc.Label,
    },
    scoreAudio: {
      default: null,
      type: cc.AudioClip,
    },
  },
  onLoad() {
    // 获取地平面的 y 轴座标
    this.groundY = this.ground.y + this.ground.height / 2;
    // 初始化记分
    this.score = 0;
    // 初始化计时器
    this.timer = 0;
    this.starDuration = 0;
    // 生成一个新的星星
    this.spawnNewStar();
    this.player.getComponent('Player').game = this;
  },
  spawnNewStar() {
    // 使用给定的模版在场景中生成一个新的节点
    var newStar = cc.instantiate(this.starPrefab);
    // 新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar);
    // 为星星设置一个随机位置
    newStar.setPosition(this.getNewStarPosition());
    // 在星星脚本组件上保存 Game 对象的引用
    newStar.getComponent('Star').game = this;
    this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
    this.timer = 0;
  },
  getNewStarPosition() {
    var randX = 0;
    // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
    var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
    // 根据屏幕宽度，随机得到一个星星的 x 坐标
    var maxX = this.node.width / 2;
    // Math.random => 0 ~ 1 => - 0.5 => - 0.5 ~ 0.5
    randX = (Math.random() - 0.5) * 2 * maxX;
    // 返回星星坐标
    return cc.v2(randX, randY);
  },
  update(dt) {
    // 每帧更新计时器，超过限度还没有生成新的星星
    // 就会调用游戏失败逻辑
    // console.log('timer', this.timer);
    if (this.timer > this.starDuration) {
      this.gameOver();
      return;
    }
    this.timer += dt;
  },
  gainScore() {
    this.score += 1;
    // 更新得分音效
    this.scoreDisplay.string = 'Score: ' + this.score;
    // 播放得分音效
    cc.audioEngine.playEffect(this.scoreAudio, false);
  },
  gameOver() {
    // 停止 Player 节点的跳跃动作
    this.player.stopAllActions();
    // 重新加载场景 game
    cc.director.loadScene('game');
  },
  // start() {},
});
