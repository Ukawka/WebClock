var currentTimer = null; // 储存当前打开的计时器

// 在更改计时器时需要维护的变量
let timerTimes = new Array(document.querySelectorAll('.timerModule').length).fill(1); // 储存所有计时器的设定时间(毫秒),设置为1避免除以0
let timerDurations = new Array(document.querySelectorAll('.timerModule').length).fill(0); // 储存所有计时器的剩余时间(毫秒)
let timerIntervals = new Array(document.querySelectorAll('.timerModule').length).fill(null); // 储存所有计时器的定时器

var cloneTimer = document.querySelector('.timerModule').cloneNode(true); // 克隆计时器模版
cloneTimer.style.display = 'none'; // 隐藏克隆的计时器模版

// 放大按钮
function enlarge(element)
{
    const timerModule = element.closest('.timerModule');
    timerModule.classList.add('enlarged');
    // 放大界面显示渐变效果
    const index = Array.from(document.getElementsByClassName('timerModule')).indexOf(timerModule);
    const deg = 360 * timerDurations[index] / timerTimes[index];
    timerModule.querySelector('.body').style.backgroundImage = setConicGradient(timerModule, deg);
}

// 缩小按钮
function shrink(element)
{
    const timerModule = element.closest('.timerModule');
    timerModule.classList.remove('enlarged');
    // 取消渐变效果
    timerModule.querySelector('.body').style.backgroundImage = '';
}

// 播放暂停按钮
function play(element)
{
    const timerModule = element.closest('.timerModule');
    const index = Array.from(document.getElementsByClassName('timerModule')).indexOf(timerModule);
    timerModule.classList.toggle('play'); // 切换播放/暂停按钮样式
    if (timerModule.classList.contains('play')) { // 点击播放按钮时开始计时
        timerIntervals[index] = setInterval(countdown, 10, timerModule); // 开始倒计时，每10毫秒更新一次
    }
    else { // 点击暂停按钮时停止计时
        clearInterval(timerIntervals[index]); // 停止计时
        timerIntervals[index] = null; // 清空定时器
    }
}

// 倒计时函数
function countdown(timerModule) {
    const index = Array.from(document.getElementsByClassName('timerModule')).indexOf(timerModule);
    timerDurations[index] -= 10; // 计时器持续时间减10毫秒
    if (timerDurations[index] <= 0) { // 倒计时结束
        clearInterval(timerIntervals[index]); // 停止计时
        timerIntervals[index] = null; // 清空定时器
        timerModule.querySelector('.play').click(); // 重置播放按钮
        timerModule.querySelector('.time').textContent = '00:00:00'; // 显示0
        if (timerModule.classList.contains('enlarged')) { // 放大界面恢复成初始效果
            timerModule.querySelector('.body').style.backgroundImage = setConicGradient(timerModule, 0);
        }
        return;
    }
    // 更新显示
    const hours = Math.floor(timerDurations[index] / 3600000);
    const minutes = Math.floor((timerDurations[index] % 3600000) / 60000);
    const seconds = Math.floor((timerDurations[index] % 60000) / 1000);
    timerModule.querySelector('.time').textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    // 放大界面对渐变效果的更新显示
    if (timerModule.classList.contains('enlarged')) {
        const deg = 360 * timerDurations[index] / timerTimes[index];
        timerModule.querySelector('.body').style.backgroundImage = setConicGradient(timerModule, deg);
    } 
}

// 通过改变backgroundImage设置样式中的渐变效果
function setConicGradient(timerModule, deg) {
    const bgImage = window.getComputedStyle(timerModule.querySelector('.body')).backgroundImage;
    let match1 = bgImage.match(/rgba\(81, 83, 204, 0.7\)/);
    let match2 = bgImage.match(/rgba\(200, 200, 200, 0.2\)/);
    return bgImage.slice(0, match1.index+23) + `${deg}` + bgImage.slice(match2.index-5, match2.index+25) + `${deg}` + bgImage.slice(-37);
}

// 归零按钮
function renew(element)
{
    const timerModule = element.closest('.timerModule');
    if (timerModule.classList.contains('play')){ // 点击归零按钮时停止计时
        timerModule.querySelector('.play').click();
    }
    // 显示和变量都恢复初始状态
    timerModule.querySelector('.time').textContent = '00:00:00';
    if (timerModule.classList.contains('enlarged')) {
        timerModule.querySelector('.body').style.backgroundImage = setConicGradient(timerModule, 360);
    }
    const index = Array.from(document.getElementsByClassName('timerModule')).indexOf(timerModule);
    timerTimes[index] = 1;
    timerDurations[index] = 0;
}

// 编辑-删除按钮
function del(element)
{
    const grid = document.querySelector('#grid');
    const editButton = element.closest('#editButton'); 
    grid.classList.toggle('del');
    editButton.classList.toggle('displace');
}

// 打开模态框对计时器进行编辑
function editTimer(event)
{
    const grid = event.target.closest('#grid');
    if (grid === null){
        return;
    }
    if (event.target.closest('.timerModule').classList.contains('enlarged')) // 放大界面时不允许编辑
    {
        return;
    }
    if (!event.target.closest('.enlargeIcon') && !event.target.closest('.shrinkIcon')  
        && !event.target.closest('.deleteIcon') && !event.target.closest('.play') 
        && !event.target.closest('.renew')) // 点击非按钮区域且计时器不在播放状态时打开模态框
    {   
        // 打开模态框
        grid.classList.add('show');
        //储存当前闹钟及其信息
        currentTimer = event.target.closest('.timerModule');
        document.getElementById('nameInput').querySelector('input').value = currentTimer.querySelector('.name').textContent;
        document.getElementById('hour-input').value = currentTimer.querySelector('.time').textContent.split(':')[0];
        document.getElementById('minute-input').value = currentTimer.querySelector('.time').textContent.split(':')[1];
        document.getElementById('second-input').value = currentTimer.querySelector('.time').textContent.split(':')[2];
    }
    if(grid.classList.contains('del') && !event.target.closest('.deleteIcon')) // 在删除按钮存在时打开模态框
    {
        document.getElementById('editButton').getElementsByClassName('operation')[1].click();
    }
}

// 关闭模态框函数
function cancelModal(event)
{
    if(event.target === document.getElementById('save')){ // 点击保存按钮时关闭模态框并更新计时器信息
        if(!new RegExp(hourInput.pattern).test(hourInput.value) || !new RegExp(minuteInput.pattern).test(minuteInput.value) 
            || !new RegExp(secondInput.pattern).test(secondInput.value)){
            alert('请输入正确的时间格式');
            return;
        }
        // 更新计时器的显示信息
        currentTimer.querySelector('.time').textContent = `${padZero(hourInput.value)}:${padZero(minuteInput.value)}:${padZero(secondInput.value)}`;
        currentTimer.querySelector('.name').textContent = document.getElementById('nameInput').querySelector('input').value;
        // 更新计时器的时间设置
        timerTimes[Array.from(document.getElementsByClassName('timerModule')).indexOf(currentTimer)] = (parseInt(hourInput.value) * 3600 + parseInt(minuteInput.value) * 60 + parseInt(secondInput.value)) * 1000;
        timerDurations[Array.from(document.getElementsByClassName('timerModule')).indexOf(currentTimer)] = timerTimes[Array.from(document.getElementsByClassName('timerModule')).indexOf(currentTimer)];
    }
    // 关闭模态框
    const grid = document.querySelector('#grid');
    grid.classList.remove('show');
    currentAlarm = null;
}

// 计时器界面上删除计时器函数
function onTimerDelete(event) {
    const timerToDelete = event.target.closest('.timerModule');
    deleteTimer(timerToDelete);
}

// 模态框界面上删除计时器函数
function onModalDelete(event) {
    cancelModal(event);
    deleteTimer(currentTimer);
}

// 点击模态框窗口外位置时关闭模态框
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

// 添加一个计时器
function addTimer() {
    // 克隆计时器模版，并初始化相关显示和变量
    const index = document.querySelectorAll('.timerModule').length;
    var newTimer = cloneTimer.cloneNode(true);
    newTimer.querySelector('.name').textContent = `计时器${index+1}`;
    newTimer.querySelector('.time').textContent = '00:00:00';
    timerTimes.push(0);
    timerDurations.push(0);
    timerIntervals.push(null);

    // 将新计时器插入到页面
    if(index%2 === 0){ // 判断是否需要扩展grid 
        document.querySelector('#grid').style.gridTemplateRows = `repeat(${Math.floor(index/2)+1}, 230px)`;
    }
    newTimer.style.display = '';
    document.querySelector('#grid').appendChild(newTimer);
    newTimer.style.gridArea = calculateGridArea(index);
}

// 删除一个计时器
function deleteTimer(timerToDelete) {
    let timers = document.querySelectorAll('.timerModule');
    const index = Array.from(timers).indexOf(timerToDelete);
    timerToDelete.parentNode.removeChild(timerToDelete);
    // 删除相关变量信息
    timerTimes.splice(index, 1);
    timerDurations.splice(index, 1);
    if (timerIntervals[index] !== null){
        clearInterval(timerIntervals[index]);
    }
    timerIntervals.splice(index, 1);
    // 重新设置grid
    document.querySelector('#grid').style.gridTemplateRows = `repeat(${Math.ceil((timers.length-1)/2)}, 230px)`;
    // 移动元素布局
    for(let i = index+1; i < document.querySelectorAll('.timerModule').length+1; i++){
        timers[i].style.gridArea = calculateGridArea(i-1);
    }
}

// 计算布局位置
function calculateGridArea(index) {
    return `${Math.floor(index/2)+1}/${index%2+1}/${Math.floor(index/2)+2}/${index%2+2}`
}