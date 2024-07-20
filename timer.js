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

// 放大按钮
function enlarge(element)
{
    const timerModule = element.closest('.timerModule');
    timerModule.classList.add('enlarged');
}

// 缩小按钮
function shrink(element)
{
    const timerModule = element.closest('.timerModule');
    timerModule.classList.remove('enlarged');
}


// 播放暂停按钮
function play(element)
{
    const timerModule = element.closest('.timerModule');
    timerModule.classList.toggle('play');
}

// 归零按钮
function renew(element)
{
    // FIXME
}

// 编辑-删除按钮
function del()
{
    const grid = document.querySelector('#grid');
    grid.classList.toggle('del');
}

function editTimer(event)
{
    const grid = event.target.closest('#grid');
    if (event.target.classList.contains('enlarged'))
    {
        return;
    }
    if (!event.target.closest('.enlargeIcon') && !event.target.closest('.shrinkIcon')  && !event.target.closest('.deleteIcon') && !event.target.closest('.operations')) // 点击非enlarge和deleteIcon时打开模态框
    {   
        // 打开模态框
        grid.classList.add('show');
        //并储存当前闹钟及其信息
        // currentAlarm = this;
        // document.getElementById('hour-input').value = this.querySelector('.time').textContent.split(':')[0];
        // document.getElementById('minute-input').value = this.querySelector('.time').textContent.split(':')[1];
        // document.getElementById('nameInput').querySelector('input').value = this.querySelector('.name').textContent;
        // document.getElementById('delete').addEventListener('click', onModalDelete);
    }
    if(grid.classList.contains('del') && !event.target.closest('.deleteIcon'))
    {
        grid.classList.remove('del');
    }
}

// 关闭模态框
function cancelModal(event)
{
    if(event.target === document.getElementById('save')){ // 点击保存按钮时关闭模态框并更新计时器信息
        // currentAlarm.querySelector('.time').textContent = `${padZero(hourInput.value)}:${padZero(minuteInput.value)}`;
        // currentAlarm.querySelector('.name').textContent = document.getElementById('nameInput').querySelector('input').value;
    }
    const grid = document.querySelector('#grid')
    grid.classList.remove('show');
    // document.getElementById('delete').removeEventListener('click', onModalDelete);
    currentAlarm = null;
}

document.getElementById('modal').addEventListener('click', function(event) 
{
    if (event.target === this) 
    {
        cancelModal(event);
    }
});

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