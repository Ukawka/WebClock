let startTime = 0;
let elapsedTime = 0;
let stopwatchInterval = null;

function startStopToggle() {
    const startStopButton = document.getElementById('startStopButton');
    const resetLapButton = document.getElementById('resetLapButton');
    if (stopwatchInterval) {
        stopStopwatch();
        startStopButton.textContent = '启动';
        resetLapButton.textContent = '复位';
        startStopButton.classList.remove('running');
    }
    else {
        startStopwatch();
        startStopButton.textContent = '停止';
        resetLapButton.textContent = '分段';
        startStopButton.classList.add('running');
        resetLapButton.disabled = false;
    }
}

function resetLapToggle() {
    const startStopButton = document.getElementById('startStopButton');
    const resetLapButton = document.getElementById('resetLapButton');
    if (stopwatchInterval) {
        lapStopwatch(); // 待实现
    }
    else {
        resetStopwatch();
        startStopButton.textContent = '启动';
        resetLapButton.textContent = '复位';
        startStopButton.classList.remove('running');
        resetLapButton.disabled = true;
    }
}

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
    document.getElementById('startStopButton').textContent = '启动'; // 重置时将按钮文字改回“启动”
}

function lapStopwatch() {
    // todo
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
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}
