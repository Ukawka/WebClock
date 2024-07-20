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
    const minuteDeg = (360 / 60) * minutes + (360 / 60) * (seconds / 60);
    const secondDeg = ((seconds * 1000 + milliseconds) / 60000) * 360;

    hourHand.setAttribute('transform', `rotate(${hourDeg}, 200, 200)`);
    minuteHand.setAttribute('transform', `rotate(${minuteDeg}, 200, 200)`);
    secondHand.setAttribute('transform', `rotate(${secondDeg}, 200, 200)`);

    // 格式化时间显示
    const timeString = `${String(adjustedTime.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // 更新数字时钟label的内容
    document.getElementById('clockDisplay').textContent = timeString;
}

var clockIntervalId = setInterval(updateClock, 100); // 每0.1秒更新一次时钟
updateClock(); // 初始加载时钟


// 拨动时钟指针，改变时间
var hourHand = document.getElementById('hour-hand');
var minuteHand = document.getElementById('minute-hand');
var secondHand = document.getElementById('second-hand');
var isHourHandDragging = false;
var isMinuteHandDragging = false;
var isSecondHandDragging = false;
console.log(document.getElementById('center').getBoundingClientRect().left, document.getElementById('center').getBoundingClientRect().top);

// 监听时针拖动事件
hourHand.addEventListener('mousedown', function(event) {
    isHourHandDragging = true;
    onHandDragStart(event);
});

// 监听分针拖动事件
minuteHand.addEventListener('mousedown', function(event) {
    isMinuteHandDragging = true;
    onHandDragStart(event);
});

// 监听秒针拖动事件
secondHand.addEventListener('mousedown', function(event) {
    isSecondHandDragging = true;
    onHandDragStart(event);
});

// 监听鼠标按下事件
function onHandDragStart(event){
    document.addEventListener('mousemove', onHandDrag);
    document.addEventListener('mouseup', onHandDragEnd);
    clearInterval(clockIntervalId); // 停止时钟刷新
}

// 监听鼠标移动事件
function onHandDrag(event) {
    if (!isHourHandDragging && !isMinuteHandDragging && !isSecondHandDragging){
        return;
    }
    const currentDeg = getDegree(event);
    console.log(event.clientX, event.clientY);
    
    if (isHourHandDragging){
        hourHand.setAttribute('transform', `rotate(${currentDeg}, 200, 200)`);
    }
    else if (isMinuteHandDragging){
        minuteHand.setAttribute('transform', `rotate(${currentDeg}, 200, 200)`);
    }
    else if (isSecondHandDragging){
        secondHand.setAttribute('transform', `rotate(${currentDeg}, 200, 200)`);
    }
    dragUpdate(currentDeg);
}

// 监听鼠标松开事件
function onHandDragEnd(event) {
    isHourHandDragging = false;
    isMinuteHandDragging = false;
    isSecondHandDragging = false;
    document.removeEventListener('mousemove', onHandDrag);
    document.removeEventListener('mouseup', onHandDragEnd);
    clockIntervalId = setInterval(updateClock, 100); // 重新启动时钟刷新
}

// 获取鼠标指针的角度
function getDegree(event){
    const cx = document.getElementById('center').getBoundingClientRect().left;
    const cy = document.getElementById('center').getBoundingClientRect().top;
    const deltaX = event.clientX - cx;
    const deltaY = event.clientY - cy;

    let deg = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;
    deg = deg < 0? 360 + deg : deg;
    return deg;
}

// 拖动指针时的更新函数
function dragUpdate(currentDeg){
    // 获取当前时间
    let time = document.getElementById("clockDisplay").textContent;
    let hour = parseInt(time.split(":")[0]);
    let minute = parseInt(time.split(":")[1]);
    let second = parseInt(time.split(":")[2]);

    // 通过setTimeDelta函数更新时间
    if (isHourHandDragging){
        const currentHour = Math.round((currentDeg * 12 / 360)) % 12;
        if ((0 < hour && hour < 11) || (hour == 0 && (currentHour == 1||currentHour == 0)) 
            || (hour == 11 && (currentHour == 10||currentHour == 11))
            || (hour == 12 && currentHour == 11) || (hour == 23 && currentHour == 0)){
            setTimeDelta(currentHour, minute, second);
        }
        else{
            setTimeDelta(currentHour + 12, minute, second);
        }
    }
    else if (isMinuteHandDragging){
        const currentMinute = Math.round((currentDeg * 60 / 360)) % 60;
        if (minute > 50 && currentMinute < 10){
            setTimeDelta((hour+1)%24, 0, second);
        }
        else if (minute < 10 && currentMinute > 50){
            setTimeDelta((hour-1+24)%24, 59, second);
        }
        else{
            setTimeDelta(hour, currentMinute, second);
        }
    }
    else if (isSecondHandDragging){
        const currentSecond = Math.round((currentDeg * 60 / 360)) % 60;
        if (second > 50 && currentSecond < 10){
            setTimeDelta(hour, minute+1, 0);
        }
        else if (second < 10 && currentSecond > 50){
            setTimeDelta(hour, minute-1, 59);
        }
        else{
            setTimeDelta(hour, minute, currentSecond);
        }
    }
    // 更新时钟显示
    updateClock();
}

function toggled()
{
    const setTime = document.querySelector('#setTime');
    setTime.classList.toggle('collapsed');
    // alert("collapsed");
}

// 时间格式 末位补零
function padZero(value) {
    return value.toString().padStart(2, '0');
}
function updateInputValue(input) {
    input.value = padZero(input.value);
}

const hourInput = document.getElementById('hour-input');
const minuteInput = document.getElementById('minute-input');
const secondInput = document.getElementById('second-input');

hourInput.value = padZero(hourInput.value);
minuteInput.value = padZero(minuteInput.value);
secondInput.value = padZero(secondInput.value);

hourInput.addEventListener('change', () => updateInputValue(hourInput));
minuteInput.addEventListener('change', () => updateInputValue(minuteInput));
secondInput.addEventListener('change', () => updateInputValue(secondInput));