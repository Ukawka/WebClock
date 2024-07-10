let startTime = 0;
let elapsedTime = 0;
let stopwatchInterval = null;

function startStopwatch() {
    if (stopwatchInterval) return; // 如果秒表已经在运行，则忽略
    startTime = Date.now() - elapsedTime; // 继续从上次停止的地方开始
    stopwatchInterval = setInterval(updateStopwatch, 10); // 每10毫秒更新一次
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = Date.now() - startTime; // 保存经过的时间
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = 0;
    displayTime(0);
}

function updateStopwatch() {
    const now = Date.now();
    elapsedTime = now - startTime;
    displayTime(elapsedTime);
}

function displayTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    document.getElementById('stopwatch').textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function pad(value) {
    return String(value).padStart(2, '0');
}
