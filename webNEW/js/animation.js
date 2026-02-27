window.addEventListener("scroll", function() 
{
    const sections = document.querySelectorAll("section");
    for (let i = 0; i < sections.length; i++) 
    {
        //obtener la distancia desde la parte superior de la sección hasta la parte superior de la ventana
        const position = sections[i].getBoundingClientRect().top;
        //si la seccion esta dentro de la área visible 
        if (position < window.innerHeight) 
        {
            //añadir la clase visible para activar la animacion css
            sections[i].classList.add("visible");
            //ej: setion id=integrales -> setion id=integlales class=visible
            //ahora va utilizar el css de clase visible
        }
    }
});