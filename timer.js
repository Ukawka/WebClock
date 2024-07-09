let timerDuration = 0; // 计时器持续时间（毫秒）
let timerStart = 0; // 计时器开始时间
let timerInterval = null; // 计时器定时器

function startTimer() {
    const hours = parseInt(document.getElementById('hours').value, 10) * 3600000;
    const minutes = parseInt(document.getElementById('minutes').value, 10) * 60000;
    const seconds = parseInt(document.getElementById('seconds').value, 10) * 1000;
    
    timerDuration = hours + minutes + seconds;
    timerStart = Date.now() + timerDuration; // 设置开始时间为当前时间加上持续时间

    clearInterval(timerInterval); // 清除可能存在的旧定时器
    timerInterval = setInterval(countdown, 10); // 开始倒计时，每10毫秒更新一次
}

function stopTimer() {
    clearInterval(timerInterval); // 停止计时
    timerDuration = -(Date.now() - timerStart); // 计算剩余时间
    displayTime(timerDuration); // 显示剩余时间
}

function countdown() {
    const now = Date.now();
    const remainingTime = timerStart - now; // 计算剩余时间

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        displayTime(0); // 显示0
        alert('计时结束！');
        return;
    }

    displayTime(remainingTime);
}

function displayTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    document.getElementById('timerDisplay').textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function pad(value) {
    return String(value).padStart(2, '0'); // 确保小时、分钟、秒和毫秒都是两位数
}