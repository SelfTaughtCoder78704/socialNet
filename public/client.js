// Get the modal
var modal = document.querySelectorAll(".modal");

// Get the button that opens the modal
var btns = document.querySelectorAll(".myBtnz");

// Get the <span> element that closes the modal
var span = document.querySelectorAll(".close");

// When the user clicks on the button, open the modal 
btns.forEach((btn, i) => {
    btn.addEventListener('click', function () {
        modal[i].style.display = 'block'
    })
})

// When the user clicks on <span> (x), close the modal
span.forEach((s, i) => {
    s.addEventListener('click', function() {
        modal[i].style.display = 'none'
    })
})


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

    modal.forEach((m, i) => {
        if (event.target == m) {
            m.style.display = "none";
          }
    })
 


}

