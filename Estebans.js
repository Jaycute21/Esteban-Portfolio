// ---------- Define Photos for Light/Dark Mode ----------
const defaultPhoto = {
  light: 'avatar-light.png',
  dark: 'avatar-dark.png'
};

// ---------- Hardcoded Portfolio Items (No Database Needed) ----------
const portfolioData = [
  // Quizzes
  { id: 1, title: 'QUIZ 1', category: 'quiz', images: ['QUIZ-1.jpg', 'QUIZ1-2.jpg'] },
   

  
  // Exams
  { id: 3, title: 'EXAM 1', category: 'exam', images: [''] },
  
  // Activities
  { id: 4, title: 'ACTIVITY 1', category: 'activity', images: [''] }
];

// ---------- Tab Navigation & Dynamic Filtering ----------
const tabs = document.querySelectorAll('.tab');
const pages = document.querySelectorAll('.page');
let currentCategory = 'quiz'; // Default starting category view

// Modal image gallery state variables
let currentModalImages = [];
let currentModalIndex = 0;

function goTo(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.page === name));
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'home') {
    updateHomeStats();
  } else {
    currentCategory = name;
    renderPortfolioItems();
  }
}

tabs.forEach(t => t.addEventListener('click', () => goTo(t.dataset.page)));

// ---------- Dark / Light Mode + Photo Swap ----------
const body = document.body;
const themeBtn = document.getElementById('theme-toggle');
const avatarImg = document.getElementById('avatar-img');

function applyAvatarForTheme() {
  if (!avatarImg) return;
  const theme = body.dataset.theme;
  const src = defaultPhoto[theme];
  if (src) {
    avatarImg.src = src;
    avatarImg.classList.add('show');
  } else {
    avatarImg.classList.remove('show');
    avatarImg.src = '';
  }
}

function setTheme(theme) {
  body.dataset.theme = theme;
  applyAvatarForTheme();
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    setTheme(body.dataset.theme === 'light' ? 'dark' : 'light');
  });
}

// Initial render for theme avatar photo
applyAvatarForTheme();

// ---------- Dashboard Home Stats Calculator ----------
function updateHomeStats() {
  let quizCount = portfolioData.filter(q => q.category.toLowerCase() === 'quiz').length;
  let examCount = portfolioData.filter(q => q.category.toLowerCase() === 'exam').length;
  let activityCount = portfolioData.filter(q => q.category.toLowerCase() === 'activity').length;

  const statQuizEl = document.getElementById('stat-quiz');
  const statExamEl = document.getElementById('stat-exam');
  const statActivityEl = document.getElementById('stat-activity');

  if (statQuizEl) statQuizEl.textContent = quizCount;
  if (statExamEl) statExamEl.textContent = examCount;
  if (statActivityEl) statActivityEl.textContent = activityCount;
}

// ---------- Render Hardcoded Portfolio Items ----------
function renderPortfolioItems() {
  const containerId = currentCategory === 'exam' ? 'exam-list' : currentCategory === 'activity' ? 'activity-list' : 'quiz-list';
  const container = document.getElementById(containerId);

  if (!container) return;
  container.innerHTML = '';

  // Filter items to match the currently selected category tab
  const filteredItems = portfolioData.filter(
    item => item.category && item.category.toLowerCase() === currentCategory.toLowerCase()
  );

  if (filteredItems.length === 0) {
    container.innerHTML = `<p style="margin-top:15px; color:var(--muted);">No ${currentCategory}s found.</p>`;
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'quiz-card';

    let imageHTML = '';
    item.images.forEach((url, index) => {
      imageHTML += `
        <div class="img-wrap" style="position:relative; margin-bottom:8px;">
          <img src="${url}" alt="Photo ${index + 1}" class="zoomable-img"
            style="width:100%; height:140px; object-fit:cover; display:block; cursor:pointer;"
            title="Click to view full image" />
        </div>`;
    });

    card.innerHTML = `
      <h3>${item.title}</h3>
      <span class="badge ${item.category}">${item.category.toUpperCase()}</span>
      <div class="card-images-container" style="display: flex; flex-direction: column; margin-top: 12px; margin-bottom: 12px;">
        ${imageHTML}
      </div>
    `;

    // Click individual image to open preview modal
    const cardImgs = card.querySelectorAll('.zoomable-img');
    cardImgs.forEach((img, idx) => {
      img.addEventListener('click', () => {
        currentModalImages = item.images;
        currentModalIndex = idx;

        const imageModal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        if (imageModal && modalImg) {
          modalImg.src = currentModalImages[currentModalIndex];
          imageModal.classList.add('show');
          if (typeof updateModalArrowsVisibility === 'function') {
            updateModalArrowsVisibility();
          }
        }
      });
    });

    container.appendChild(card);
  });
}

// Global scope helper visibility function for modal arrows
function updateModalArrowsVisibility() {
  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');
  if (prevBtn && nextBtn) {
    prevBtn.style.display = currentModalIndex > 0 ? 'block' : 'none';
    nextBtn.style.display = currentModalIndex < currentModalImages.length - 1 ? 'block' : 'none';
  }
}

// ---------- Initial Setup on DOM Load ----------
document.addEventListener('DOMContentLoaded', () => {
  updateHomeStats();

  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const pageName = activeTab.dataset.page;
    if (pageName !== 'home') {
      currentCategory = pageName;
      renderPortfolioItems();
    }
  }

  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeImageModal = document.getElementById('close-image-modal');
  const imageModalContent = imageModal ? imageModal.querySelector('.modal-content') : null;

  if (imageModalContent && !document.getElementById('modal-prev-btn')) {
    const prevBtn = document.createElement('button');
    prevBtn.id = 'modal-prev-btn';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.style.cssText = "position: absolute; left: 15px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; font-size: 20px; padding: 8px 12px; cursor: pointer; border-radius: 50%; z-index: 1015;";

    const nextBtn = document.createElement('button');
    nextBtn.id = 'modal-next-btn';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.style.cssText = "position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; font-size: 20px; padding: 8px 12px; cursor: pointer; border-radius: 50%; z-index: 1015;";

    imageModalContent.style.position = 'relative';
    imageModalContent.appendChild(prevBtn);
    imageModalContent.appendChild(nextBtn);

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentModalIndex > 0) {
        currentModalIndex--;
        modalImg.src = currentModalImages[currentModalIndex];
        updateModalArrowsVisibility();
      }
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentModalIndex < currentModalImages.length - 1) {
        currentModalIndex++;
        modalImg.src = currentModalImages[currentModalIndex];
        updateModalArrowsVisibility();
      }
    });
  }

  if (closeImageModal) {
    closeImageModal.addEventListener('click', () => {
      imageModal.classList.remove('show');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.classList.remove('show');
    }
  });
});