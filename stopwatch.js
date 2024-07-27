let startTime = 0; // 开始时间点
let elapsedTime = 0; // 经过的时间段
let stopwatchInterval = null; // 标识秒表更新的计时器

let lastRecordTime = 0; // 上一次记录距开始的时间段
var recordClone = document.getElementById('record_0'); // 用于克隆的记录器模板
document.getElementById('record_0').style.display = 'none'; // 隐藏记录器模板

// 启动/停止按钮点击事件
function startStopToggle() {
    const startStopButton = document.getElementById('startStopButton');
    const resetLapButton = document.getElementById('resetLapButton');
    if (stopwatchInterval) { // 点击停止按钮
        stopStopwatch();
        startStopButton.textContent = '启动';
        resetLapButton.textContent = '复位';
        startStopButton.classList.remove('running');
    }
    else { // 点击启动按钮
        startStopwatch();
        startStopButton.textContent = '停止';
        resetLapButton.textContent = '分段';
        startStopButton.classList.add('running');
        resetLapButton.disabled = false;
    }
}

// 复位/分段按钮点击事件
function resetLapToggle() {
    const startStopButton = document.getElementById('startStopButton');
    const resetLapButton = document.getElementById('resetLapButton');
    if (stopwatchInterval) { // 点击分段按钮
        lapStopwatch();
    }
    else { // 点击复位按钮
        resetStopwatch();
        startStopButton.textContent = '启动';
        resetLapButton.textContent = '复位';
        startStopButton.classList.remove('running');
        resetLapButton.disabled = true;
    }
}

// 启动秒表
function startStopwatch() {
    if (stopwatchInterval) return; // 如果秒表已经在运行，则忽略
    startTime = Date.now() - elapsedTime; // 继续从上次停止的地方开始
    stopwatchInterval = setInterval(updateStopwatch, 10); // 每10毫秒更新一次
}

// 暂停秒表
function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    elapsedTime = Date.now() - startTime; // 保存经过的时间
}

// 复位秒表
function resetStopwatch() {
    elapsedTime = 0;
    lastRecordTime = 0;
    displayTime(0); // 更新显示到初始状态
    updateClock(); // 更新时钟使恢复到初始状态
    //隐藏计次框
    const recordArea = document.getElementById('recordArea');
    recordArea.classList.remove('displayed');
    // 清空所有记录器
    const recordInfos = document.getElementsByClassName('recordInfo');
    for (let i = recordInfos.length - 1; i > 0; i--) {
        recordInfos[i].parentNode.removeChild(recordInfos[i]);
    }
    document.getElementById('recordArea').style.gridTemplateRows = 'repeat(1, 100px)'; // 还原记录器区域的高度
}

// 分段秒表(掐表)
function lapStopwatch() {
    //显示计次框
    const recordArea = document.getElementById('recordArea');
    if(!recordArea.classList.contains('displayed')) recordArea.classList.add('displayed');
    const index = document.getElementsByClassName('recordInfo').length;
    // 生成新的记录器，并更改其信息
    var newRecord = recordClone.cloneNode(true);
    newRecord.getElementsByClassName('recordTitle')[0].textContent = `计次 ${index}`;
    newRecord.getElementsByClassName('recordTime')[0].textContent = formatTime(elapsedTime);
    newRecord.getElementsByClassName('recordInterval')[0].textContent = '间隔 ' + formatTime(elapsedTime - lastRecordTime);
    lastRecordTime = elapsedTime;
    // 显示新的记录器
    newRecord.style.display = '';
    document.getElementById('recordArea').appendChild(newRecord);
    document.getElementById('recordArea').style.gridTemplateRows = `repeat(${index}, 100px)`;
    newRecord.style.gridRow = `${index}/${index + 1}`;
}

// 秒表更新事件函数
function updateStopwatch() {
    const now = Date.now();
    elapsedTime = now - startTime;
    displayTime(elapsedTime); // 更新显示
    updateClock(); // 更新时钟
}

// 格式化时间段 00:00:00.000
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
}

// 更新界面显示的时间段
function displayTime(ms) {   
    document.getElementById('stopwatch').textContent = formatTime(ms);
}

function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}

// 按已记录的时间段更新时钟显示
function updateClock() {
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const milliseconds = elapsedTime % 1000;

    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');

    const hourDeg = (360 / 12) * hours + (360 / 12) * (minutes / 60);
    const minuteDeg = (360 / 60) * minutes + (360 / 60) * (seconds / 60);
    const secondDeg = ((seconds * 1000 + milliseconds) / 60000) * 360;

    hourHand.setAttribute('transform', `rotate(${hourDeg}, 200, 200)`);
    minuteHand.setAttribute('transform', `rotate(${minuteDeg}, 200, 200)`);
    secondHand.setAttribute('transform', `rotate(${secondDeg}, 200, 200)`);
}