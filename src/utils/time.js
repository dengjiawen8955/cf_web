// 将时间戳 ts 转换为 yyyy-MM-dd HH:mm:ss 格式
export function formatTime(ts) {
    let date = new Date(ts * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
