document.getElementById('toggleButton').addEventListener('click', function() {
    console.log('Button clicked');
    const navFrame = document.querySelector('#frame #nav');
    navFrame.classList.toggle('collapsed');
    console.log(navFrame.classList);
});