function bookClass(className){

const popup = document.getElementById("popup")
const text = document.getElementById("popup-text")

text.innerText = "You booked: " + className
popup.style.display = "block"

}

function closePopup(){
document.getElementById("popup").style.display = "none"
}
