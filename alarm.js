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