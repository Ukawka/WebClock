let alarmTime = null; // 存储闹钟时间
let alarmInterval = null; // 存储闹钟的定时器

function setAlarm() {
    const input = document.getElementById('alarmTime');
    const alarmHour = input.value.split(':')[0];
    const alarmMinute = input.value.split(':')[1];
    alarmTime = new Date();
    alarmTime.setHours(alarmHour, alarmMinute, 0, 0);

    // 检查是否已经过了设置的时间
    if (alarmTime < new Date()) {
        alert('时间已经过了，请输入一个未来的时间。');
        return;
    }

    // 设置闹钟
    alarmInterval = setInterval(() => {
        const now = new Date();
        if (now >= alarmTime) {
            clearInterval(alarmInterval);
            alert('闹钟响了！');
        }
    }, 1000);
}

function stopAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
        alarmTime = null;
        alert('闹钟已关闭。');
    }
}

// 打开闹钟按钮
document.querySelectorAll('.alarmModule input[type="checkbox"]').forEach(function(checkbox)
{
    checkbox.addEventListener('change', function() 
    {
        const alarmModule = this.closest('.alarmModule');
        if (this.checked) 
        {
            alarmModule.classList.add('checked');
        } 
        else 
        {
            alarmModule.classList.remove('checked');
        }
    });
});

// 编辑闹钟 打开模态框
document.querySelectorAll('.alarmModule').forEach(function(alarm)
{
    alarm.addEventListener('click', function(event)
    {
        const grid = this.closest('#grid');
        if (!event.target.closest('.switch') && !event.target.closest('.deleteIcon')) 
        {
            grid.classList.add('show');
        }
        if(grid.classList.contains('del') && !event.target.closest('.deleteIcon'))
        {
            grid.classList.remove('del');
        }
    })
});

// 关闭模态框
function cancelModal()
{
    const grid = document.querySelector('#grid')
    grid.classList.remove('show');
}

// 点击页面任意位置关闭模态框
document.getElementById('modal').addEventListener('click', function(event) 
{
    if (event.target === this) 
    {
        cancelModal();
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

// 编辑-删除按钮
function del()
{
    const grid = document.querySelector('#grid');
    grid.classList.toggle('del');
}