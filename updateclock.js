let lastSecond = -1;

function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    const hourDeg = (360 / 12) * hours + (360 / 12) * (minutes / 60);
    const minuteDeg = (360 / 60) * minutes;
    const secondDeg = ((seconds * 1000 + milliseconds) / 60000) * 360;

    hourHand.setAttribute('transform', `rotate(${hourDeg}, 100, 100)`);
    minuteHand.setAttribute('transform', `rotate(${minuteDeg}, 100, 100)`);
    secondHand.setAttribute('transform', `rotate(${secondDeg}, 100, 100)`);

    // 格式化时间显示
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // 更新数字时钟label的内容
    document.getElementById('clockDisplay').textContent = timeString;
}

setInterval(updateClock, 100); // 每0.1秒更新一次时钟
updateClock(); // 初始加载时钟
