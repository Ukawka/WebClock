function setTime() {
    const hour = parseInt(document.getElementById('hour-input').value, 10);
    const minute = parseInt(document.getElementById('minute-input').value, 10);
    const second = parseInt(document.getElementById('second-input').value, 10);

    // 检查时间值是否为数字
    if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
        alert('输入的不是数字，请重新输入。');
        return false;
    }

    // 检查时间值是否在有效范围内
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        alert('时间超出范围，请重新输入。');
        return false;
    }
    //通过setTimeDelta函数设置时间差,从而改变时钟显示的时间
    setTimeDelta(hour, minute, second);
}

let delta_date = new Date(0); // 初始化为1970年1月1日00:00:00，即为零时间

// 设置时间差
function setTimeDelta(hour, minute, second) {
    const now = new Date();
    const userTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        second
    );

    // 计算时间差
    delta_date = new Date(userTime - now);
}

// 恢复为系统时间，设置delta_date为0即可
function resetToSystemTime() {
    // 重置delta_date为默认值，即不添加任何时间差
    delta_date = new Date(0);
    // 刷新时钟以显示当前系统时间
    updateClock();
}

// 刷新时钟
function updateClock() {
    const now = new Date();
    const adjustedTime = new Date(now.getTime() + delta_date.getTime());
    const hours = adjustedTime.getHours() % 12;
    const minutes = adjustedTime.getMinutes();
    const seconds = adjustedTime.getSeconds();
    const milliseconds = adjustedTime.getMilliseconds();

    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    const hourDeg = (360 / 12) * hours + (360 / 12) * (minutes / 60);
    const minuteDeg = (360 / 60) * minutes;
    const secondDeg = ((seconds * 1000 + milliseconds) / 60000) * 360;

    hourHand.setAttribute('transform', `rotate(${hourDeg}, 200, 200)`);
    minuteHand.setAttribute('transform', `rotate(${minuteDeg}, 200, 200)`);
    secondHand.setAttribute('transform', `rotate(${secondDeg}, 200, 200)`);

    // 格式化时间显示
    const timeString = `${String(adjustedTime.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // 更新数字时钟label的内容
    document.getElementById('clockDisplay').textContent = timeString;
}

setInterval(updateClock, 100); // 每0.1秒更新一次时钟
updateClock(); // 初始加载时钟
