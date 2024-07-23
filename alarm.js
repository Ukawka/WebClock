var currentAlarm = null; // 存储当前点开的闹钟
let isCheckedArray = new Array(document.getElementsByClassName('alarmModule').length).fill(false); // 存储每个闹钟是否打开

var cloneAlarm = document.querySelector('.alarmModule').cloneNode(true); // 克隆闹钟模版
cloneAlarm.style.display = 'none'; // 隐藏克隆的闹钟模版

// 设置打开或关闭闹钟按钮事件
document.querySelectorAll('.alarmModule input[type="checkbox"]').forEach(function(checkbox)
{
    checkbox.addEventListener('change', switchAlarm);
});

// 打开或关闭闹钟函数
function switchAlarm() {
    const alarmModule = this.closest('.alarmModule');
    if (this.checked) // 打开闹钟
    {
        alarmModule.classList.add('checked');
        isCheckedArray[Array.from(document.querySelectorAll('.alarmModule')).indexOf(alarmModule)] = true;
    } 
    else // 关闭闹钟
    {
        alarmModule.classList.remove('checked');
        isCheckedArray[Array.from(document.querySelectorAll('.alarmModule')).indexOf(alarmModule)] = false;
    }
}

// 编辑闹钟 打开模态框事件
document.querySelectorAll('.alarmModule').forEach(function(alarm){
    alarm.addEventListener('click', editAlarm);
});

// 编辑闹钟 打开模态框函数
function editAlarm(event)
{
    const grid = this.closest('#grid');
    if (!event.target.closest('.switch') && !event.target.closest('.deleteIcon')) // 点击非switch和deleteIcon时打开模态框
    {
        // 打开模态框
        grid.classList.add('show');
        //并储存当前闹钟及其信息
        currentAlarm = this;
        document.getElementById('hour-input').value = this.querySelector('.time').textContent.split(':')[0];
        document.getElementById('minute-input').value = this.querySelector('.time').textContent.split(':')[1];
        document.getElementById('nameInput').querySelector('input').value = this.querySelector('.name').textContent;
        document.getElementById('delete').addEventListener('click', onModalDelete);
    }
    if(grid.classList.contains('del') && !event.target.closest('.deleteIcon'))
    {
        document.getElementById('editButton').getElementsByClassName('operation')[1].click();
    }
}

// 模态框删除闹钟函数
function onModalDelete(event){
    deleteAlarm(currentAlarm);
    cancelModal(event);
}

// 设置删除闹钟按钮事件
document.querySelectorAll('.deleteIcon').forEach(function(deleteIcon){
    deleteIcon.addEventListener('click', onAlarmDelete);
});

// alarmModule删除闹钟函数
function onAlarmDelete(event){
    deleteAlarm(event.target.closest('.alarmModule'));
}

// 关闭模态框
function cancelModal(event)
{
    if(event.target === document.getElementById('save')){ // 点击保存按钮时关闭模态框并更新闹钟信息
        if (!new RegExp(hourInput.pattern).test(hourInput.value) || !new RegExp(minuteInput.pattern).test(minuteInput.value)){
            alert('请输入正确的时间格式');
            return;
        }
        currentAlarm.querySelector('.time').textContent = `${padZero(hourInput.value)}:${padZero(minuteInput.value)}`;
        currentAlarm.querySelector('.name').textContent = document.getElementById('nameInput').querySelector('input').value;
    }
    const grid = document.querySelector('#grid')
    grid.classList.remove('show');
    document.getElementById('delete').removeEventListener('click', onModalDelete);
    currentAlarm = null;
}

// 点击页面任意位置关闭模态框
document.getElementById('modal').addEventListener('click', function(event) 
{
    if (event.target === this) 
    {
        cancelModal(event);
    }
});

// 按下回车相当于触发保存按钮
document.getElementById('modal').addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        document.getElementById('save').click();
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

hourInput.value = padZero(hourInput.value);
minuteInput.value = padZero(minuteInput.value);

hourInput.addEventListener('change', () => updateInputValue(hourInput));
minuteInput.addEventListener('change', () => updateInputValue(minuteInput));

// 添加一个闹钟
function addAlarm()
{
    // 克隆闹钟模版，并更新相关信息和变量
    const index = document.querySelectorAll('.alarmModule').length;
    var newAlarm = cloneAlarm.cloneNode(true);
    newAlarm.querySelector('.name').textContent = `闹钟${index+1}`;
    newAlarm.querySelector('.time').textContent = '00:00';
    newAlarm.querySelector('input[type="checkbox"]').checked = false;
    isCheckedArray.push(false);
    newAlarm.querySelector('input[type="checkbox"]').addEventListener('change', switchAlarm);
    newAlarm.addEventListener('click', editAlarm);
    newAlarm.querySelector('.deleteIcon').addEventListener('click', onAlarmDelete);

    // 将新闹钟插入到页面
    if(index%2 === 0){ // 判断是否需要扩展grid 
        document.querySelector('#grid').style.gridTemplateRows = `repeat(${Math.floor(index/2)+1}, 230px)`;
    }
    newAlarm.style.display = '';
    document.querySelector('#grid').appendChild(newAlarm);
    newAlarm.style.gridArea = `${Math.floor(index/2)+1}/${index%2+1}/${Math.floor(index/2)+2}/${index%2+2}`;
}

// 编辑-删除按钮
function del(element)
{
    const grid = document.querySelector('#grid');
    const editButton = element.closest('#editButton'); 
    grid.classList.toggle('del');
    editButton.classList.toggle('displace');
}

// 删除一个闹钟
function deleteAlarm(alarmToDelete){
    let alarms = document.querySelectorAll('.alarmModule');
    const index = Array.from(alarms).indexOf(alarmToDelete);
    // 通过移动元素删除闹钟
    for(let i = index; i < document.querySelectorAll('.alarmModule').length-1; i++){
        alarms[i].getElementsByClassName('time')[0].textContent = alarms[i+1].getElementsByClassName('time')[0].textContent;
        alarms[i].getElementsByClassName('name')[0].textContent = alarms[i+1].getElementsByClassName('name')[0].textContent;
        if(isCheckedArray[i]^isCheckedArray[i+1]){ // 若后一个闹钟与前一个闹钟状态不同，则修改前一个闹钟的状态使之与后一个闹钟一致
            alarms[i].querySelector('input[type="checkbox"]').click();
        }
    }
    // 删除最后一个闹钟，并删除相关事件监听
    let lastAlarm = alarms[alarms.length-1];
    lastAlarm.querySelector('input[type="checkbox"]').removeEventListener('change', switchAlarm);
    lastAlarm.removeEventListener('click', editAlarm);
    lastAlarm.querySelector('.deleteIcon').removeEventListener('click', onAlarmDelete);
    lastAlarm.parentNode.removeChild(lastAlarm);
    isCheckedArray.pop();
    // 重新设置grid
    document.querySelector('#grid').style.gridTemplateRows = `repeat(${Math.ceil((alarms.length-1)/2)}, 230px)`;
}

// 每分钟检查闹钟是否响起
setInterval(checkAlarms, 60000);

// 检查闹钟是否响起函数
function checkAlarms(){
    document.querySelectorAll('.alarmModule').forEach(function(alarm){
        if (isCheckedArray[Array.from(document.querySelectorAll('.alarmModule')).indexOf(alarm)]) // 只判断打开的闹钟
        {
            const alarmTime = alarm.querySelector('.time').textContent;
            const alarmHour = parseInt(alarmTime.split(':')[0]);
            const alarmMinute = parseInt(alarmTime.split(':')[1]);
            const now = new Date();
            const nowHour = now.getHours();
            const nowMinute = now.getMinutes();
            if(alarmHour === nowHour && alarmMinute === nowMinute){
                alert('闹钟响了！');
            }
        }
    })
}
