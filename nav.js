function focusDiv(element)
{
    const focused = document.querySelector('.focusedDiv');
    if (focused) 
    {
        focused.classList.remove('focusedDiv');
    }
    element.classList.add('focusedDiv');
}