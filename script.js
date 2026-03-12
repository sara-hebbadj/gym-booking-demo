const BOOKING_KEY = 'athleticaBookings';

function getBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setBookings(bookings) {
  localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
}

function showToast(message) {
  const toast = document.getElementById('booking-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('visible');

  if (window.gsap) {
    gsap.killTweensOf(toast);
    gsap.fromTo(toast, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' });
    gsap.to(toast, { opacity: 0, y: 10, duration: 0.3, delay: 2.1, ease: 'power2.in', onComplete: () => toast.classList.remove('visible') });
    return;
  }

  setTimeout(() => toast.classList.remove('visible'), 2200);
}

function renderBookings() {
  const bookingList = document.getElementById('booking-list');
  const bookingCount = document.getElementById('booking-count');
  if (!bookingList || !bookingCount) return;

  const bookings = getBookings();
  bookingCount.textContent = bookings.length;
  bookingList.innerHTML = '';

  if (!bookings.length) {
    bookingList.innerHTML = '<p class="booking-empty">No classes booked yet. Tap any class slot to reserve.</p>';
    return;
  }

  bookings.forEach((booking, index) => {
    const item = document.createElement('article');
    item.className = 'booking-item';
    item.innerHTML = `
      <div>
        <h3>${booking.className}</h3>
        <p>${booking.time}</p>
      </div>
      <button class="booking-remove" data-remove-booking="${index}">Cancel</button>
    `;
    bookingList.appendChild(item);
  });
}

function addBooking(className, time) {
  const bookings = getBookings();
  const duplicate = bookings.some((booking) => booking.className === className && booking.time === time);

  if (duplicate) {
    showToast(`${className} is already booked.`);
    return;
  }

  bookings.push({ className, time });
  setBookings(bookings);
  renderBookings();
  showToast(`Booked: ${className} • ${time}`);
}

function removeBooking(index) {
  const bookings = getBookings();
  bookings.splice(index, 1);
  setBookings(bookings);
  renderBookings();
  showToast('Booking removed.');
}

function initBookingActions() {
  const bookingTriggers = document.querySelectorAll('[data-book-class]');
  const bookingList = document.getElementById('booking-list');

  bookingTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const className = trigger.getAttribute('data-book-class');
      const time = trigger.getAttribute('data-book-time') || 'Selected slot';
      addBooking(className, time);
    });
  });

  if (bookingList) {
    bookingList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-remove-booking]');
      if (!button) return;
      removeBooking(Number(button.getAttribute('data-remove-booking')));
    });
  }
}

function initMembershipActions() {
  const planButtons = document.querySelectorAll('[data-plan]');
  if (!planButtons.length) return;

  planButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedPlan = button.getAttribute('data-plan');
      showToast(`Great choice. ${selectedPlan} membership selected.`);
    });
  });
}

function initReveal() {
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
}

function initGsapMotion() {
  if (!window.gsap) return;

  gsap.from('.hero h1', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out' });
  gsap.from('.hero p', { y: 24, opacity: 0, duration: 0.75, delay: 0.15, ease: 'power3.out' });
  gsap.from('.hero button', { y: 20, opacity: 0, duration: 0.6, delay: 0.28, ease: 'power2.out' });
  gsap.from('.chip', { scale: 0.92, opacity: 0, duration: 0.45, stagger: 0.03, delay: 0.3, ease: 'back.out(1.5)' });
  gsap.from('.card, .plan, .day, .profile-section', { opacity: 0, y: 20, duration: 0.6, stagger: 0.06, delay: 0.25, ease: 'power2.out' });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initBookingActions();
  initMembershipActions();
  renderBookings();
  initGsapMotion();
});
