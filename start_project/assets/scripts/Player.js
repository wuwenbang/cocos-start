// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // 主角跳跃高度
    jumpHeight: 0,
    // 主角跳跃持续时间
    jumpDuration: 0,
    // 最大移动速度
    maxMoveSpeed: 0,
    // 加速度
    accle: 0,
  },

  runJumpAction() {
    // 跳跃上升
    var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' })
    // 下落
    var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' })

    // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作
    var tween = cc.tween().sequence(jumpUp, jumpDown)
    // 不断重复
    return cc.tween().repeatForever(tween)
  },

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = true
        break
      case cc.macro.KEY.d:
        this.accRight = true
        break
    }
  },

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        this.accLeft = false
        break
      case cc.macro.KEY.d:
        this.accRight = false
        break
    }
  },
  // onLoad 加载时调用
  onLoad: function () {
    // 初始化跳跃动作
    var jumpAction = this.runJumpAction()
    cc.tween(this.node).then(jumpAction).start()

    // 加速度方向开关
    this.accLeft = false
    this.accRight = false

    // 主角当前水平方向速度
    this.xSpeed = 0

    // 初始化键盘输入监听
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
  },
  onDestroy() {
    // 取消键盘输入监听
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
  },

  // update 会在场景加载后每帧调用一次
  update: function (dt) {
    // 根据当前加速度方向每帧更新速度
    if (this.accLeft) {
      this.xSpeed -= this.accle * dt
    } else if (this.accRight) {
      this.xSpeed += this.accle * dt
    }
    // 限制主角的速度不能超过最大值
    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      this.xSpeed = (this.maxMoveSpeed * this.xSpeed) / Math.abs(this.xSpeed)
    }

    // 根据当前速度更新主角的位置
    this.node.x += this.xSpeed * dt
  },
  //   start() {},
})
