export const createCountDown = function (setDuration, getDuration) {
  return class CountDown {
    constructor(tick, duration = 9000, mode = "down") {
      const isCountDown = mode === "down"
      setDuration(isCountDown ? duration : 0)
      this.params = {
        tick,
        duration,
        mode
      }
      this.initialDuration = isCountDown ? duration : 0
    }
    renderTime = function () {
      const duration = Number(getDuration())
      const hour = parseInt(duration / 3600)
      let temp = parseInt(duration % 3600)
      const minute = parseInt(temp / 60)
      const second = parseInt(temp % 60)
      const h = hour < 10 ? `0${hour}` : `${hour}`
      const m = minute < 10 ? `0${minute}` : `${minute}`
      const s = second < 10 ? `0${second}` : `${second}`
      return `${h}:${m}:${s}`
    }
    setDuration = function (duration) { setDuration(duration) }
    getDuration = function () { return getDuration() }
    getInitialDuration = function () { return this.initialDuration }

    clearTimer = function () {
      clearTimeout(this.clockTimer)
      return this
    }

    resetDuration = function () {
      this.clearTimer()
      setDuration(this.initialDuration)
      return this
    }

    pauseTimer = function () {
      this.clearTimer()
      return getDuration()
    }

    countDown = function () {
      clearTimeout(this.clockTimer)
      this.clockTimer = setTimeout(() => {
        if (getDuration() > 0) {
          setDuration(getDuration() - 1)
          this.countDown()
        }
      }, this.params.tick)
      return this
    }

    countUp = function () {
      clearTimeout(this.clockTimer)
      this.clockTimer = setTimeout(() => {
        if (getDuration() < this.params.duration) {
          setDuration(getDuration() + 1)
          this.countUp()
        }
      }, this.params.tick)
      return this
    }
  }
}

export const parseTime = function (duration) {
  let d = Number(duration)
  const hour = parseInt(d / 3600)
  let t = parseInt(d % 3600)
  const minute = parseInt(t / 60)
  const second = parseInt(t % 60)
  const h = hour < 10 ? `0${hour}` : `${hour}`
  const m = minute < 10 ? `0${minute}` : `${minute}`
  const s = second < 10 ? `0${second}` : `${second}`
  return { h, m, s }
}

export const renderTime = function (duration) {
  const { h, m, s } = parseTime(duration)
  return `${h}:${m}:${s}`
}

export const renderTimeChinese = function (duration) {
  const { h, m, s } = parseTime(duration)
  return `${h}小时${m}分${s}秒`
}
