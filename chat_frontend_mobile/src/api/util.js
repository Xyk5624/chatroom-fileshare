export function errorhandle(_this) {
  alert("登陆状态已过期，请重新登录")
  _this.$router.push('/login')
}

export default function sortTime(a, b) {
  if (a.createtime == b.createtime) {
    return 0
  } else if (a.createtime === null || (b.createtime != null && a.createtime < b.createtime)) {
    return 1
  } else {
    return -1
  }
}