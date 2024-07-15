// 边栏缩回展开 更换图标
function toggled(element)
{
    const navFrame = document.querySelector('#frame #nav');
    navFrame.classList.toggle('collapsed');
    element.classList.toggle('hide');
}