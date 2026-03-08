function bookClass(className){
  const popup = document.getElementById('popup');
  const text = document.getElementById('popup-text');

  if (!popup || !text) return;
  text.innerText = `You booked: ${className}`;
  popup.style.display = 'block';
}

function closePopup(){
  const popup = document.getElementById('popup');
  if (popup) popup.style.display = 'none';
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
