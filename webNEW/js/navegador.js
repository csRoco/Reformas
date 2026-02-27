window.addEventListener("scroll", function() 
{
    var nav = document.querySelector("nav");
    if(window.scrollY > 100)
    {
        nav.classList.add("scrolled");
        //nav.style.opacity = '0.5';
    }
    else
    {
        nav.classList.remove("scrolled");
        //nav.style.opacity = '1';
    }
});