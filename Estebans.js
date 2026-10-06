// ==========================================
// Portfolio Script - DCIT 26 Application Dev
// Student: Jay Hans Esteban (BSCS-3B)
// ==========================================

// --- dark mode profile---
const DEFAULT_AVATAR = {
  light: 'avatar-light.png',
  dark: 'avatar-dark.png'
};

const portfolioData = [
  // Quizzes
  { 
    id: 1, 
    title: 'QUIZ 1', 
    category: 'quiz', 
    score: '18/20', 
    date: 'August 25, 2026', 
    images: ['QUIZ-1.jpg', 'QUIZ1-2.jpg'] 
  },
  {
    id: 2, 
    title: 'QUIZ 2', 
    category: 'quiz', 
    score: '20/20', 
    date: 'October 10, 2026', 
    images: ['QUIZ-2.png'] 
  },
  {
    id: 3, 
    title: 'QUIZ 3', 
    category: 'quiz', 
    score: '20/20', 
    date: 'October 10, 2026', 
    images: ['Quiz-3.png'] 
  },
  {
    id: 4, 
    title: 'LONG QUIZ', 
    category: 'quiz', 
    score: '41/45', 
    date: 'October 10, 2026', 
    images: ['LONG-QUIZ.png'] 
  },

  // Exams
  { 
    id: 1,
    title: 'MID TERM EXAM',
    category: 'exam',
    score: '51/70',
    date: 'October 6, 2026',
    images: ['exam_score.jpg']
  },

  // Activities
  {
    id: 1,
    title: 'ACT 1 - Emerging Technologies Overview',
    category: 'activity',
    score: 'N/A',
    date: 'September 12, 2026',
    images: ['ESTEBAN ACT-1-EMERGING TECHNOLOGIES OVERVIEW (1).pdf']
  },
  { 
    id: 2,
    title: 'ACT 2 - DETAILED STAKEHOLDER INTERVIEW',
    category: 'activity',
    score: 'N/A',
    date: 'September 12, 2026',
    images: ['ESTEBAN-ACT2.pdf']
  }
];

// --- APP STATE VARIABLES ---
let currentCategory = 'quiz';
let currentModalImages = [];
let currentModalIndex = 0;

// DOM Elements
const bodyElement = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const avatarImg = document.getElementById('avatar-img');
const tabButtons = document.querySelectorAll('.tab');
const pageSections = document.querySelectorAll('.page');

// Check if user is accessing on a mobile browser
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


// --- PAGE NAVIGATION / TAB SWITCHING ---
function goTo(pageName) {
  // Update active tab buttons
  tabButtons.forEach(function(tab) {
    tab.classList.toggle('active', tab.dataset.page === pageName);
  });

  // Show selected page section
  pageSections.forEach(function(page) {
    page.classList.toggle('active', page.id === 'page-' + pageName);
  });

  // Smooth scroll back to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageName === 'home') {
    updateHomeStats();
  } else {
    currentCategory = pageName;
    renderPortfolioItems();
  }
}

// Add click events to tabs
tabButtons.forEach(function(tab) {
  tab.addEventListener('click', function() {
    goTo(tab.dataset.page);
  });
});


// --- LIGHT / DARK THEME & AVATAR ---
function applyAvatarForTheme() {
  if (!avatarImg) return;
  
  const currentTheme = bodyElement.dataset.theme;
  const imageSource = DEFAULT_AVATAR[currentTheme];

  if (imageSource) {
    avatarImg.src = imageSource;
    avatarImg.classList.add('show');
  } else {
    avatarImg.classList.remove('show');
    avatarImg.src = '';
  }
}

function setTheme(theme) {
  bodyElement.dataset.theme = theme;
  applyAvatarForTheme();
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', function() {
    const nextTheme = (bodyElement.dataset.theme === 'light') ? 'dark' : 'light';
    setTheme(nextTheme);
  });
}


// --- HOME DASHBOARD STAT COUNTERS ---
function updateHomeStats() {
  const quizCount = portfolioData.filter(function(item) {
    return item.category && item.category.toLowerCase() === 'quiz';
  }).length;

  const examCount = portfolioData.filter(function(item) {
    return item.category && item.category.toLowerCase() === 'exam';
  }).length;

  const activityCount = portfolioData.filter(function(item) {
    return item.category && item.category.toLowerCase() === 'activity';
  }).length;

  const statQuiz = document.getElementById('stat-quiz');
  const statExam = document.getElementById('stat-exam');
  const statActivity = document.getElementById('stat-activity');

  if (statQuiz) statQuiz.textContent = quizCount;
  if (statExam) statExam.textContent = examCount;
  if (statActivity) statActivity.textContent = activityCount;
}


// --- PORTFOLIO ITEM CARD  ---
function renderPortfolioItems() {
  let containerId = 'quiz-list';
  if (currentCategory === 'exam') containerId = 'exam-list';
  if (currentCategory === 'activity') containerId = 'activity-list';

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  // Filter items based on active tab category
  const filteredItems = portfolioData.filter(function(item) {
    return item.category && item.category.toLowerCase() === currentCategory.toLowerCase();
  });

  if (filteredItems.length === 0) {
    container.innerHTML = `<p style="margin-top:15px; color:var(--muted);">No ${currentCategory}s found.</p>`;
    return;
  }

  filteredItems.forEach(function(item) {
    const card = document.createElement('div');
    card.className = 'quiz-card';

    const primaryFile = (item.images && item.images.length > 0) ? item.images[0] : '';
    const extraCount = (item.images && item.images.length > 1) ? `+${item.images.length - 1}` : '';
    const isPdf = primaryFile.toLowerCase().endsWith('.pdf');

    let previewHTML = '';
    
    if (isPdf) {
      // Get absolute URL path for PDF
      const fullPdfUrl = new URL(primaryFile, window.location.href).href;
      
      // Use Google Docs Viewer wrapper for mobile browsers to display live pages
      let iframeSrc = `${primaryFile}#toolbar=0&navpanes=0&scrollbar=0`;
      if (isMobileDevice) {
        iframeSrc = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(fullPdfUrl)}`;
      }

      previewHTML = `
        <div class="pdf-wrap zoomable-img" style="position:relative; margin-bottom:8px; cursor:pointer; height:200px; border-radius:6px; overflow:hidden; background:#fff;" title="Click to view full PDF">
          <iframe 
            src="${iframeSrc}" 
            style="width:100%; height:100%; border:none; pointer-events:none;" 
            scrolling="no">
          </iframe>
          <div class="view-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s ease;">
            <span style="background:rgba(0,0,0,0.75); color:#fff; padding:6px 12px; font-size:14px; font-weight:bold; border-radius:4px;">VIEW PDF</span>
          </div>
        </div>
      `;
    } else {
      previewHTML = `
        <div class="img-wrap zoomable-img" style="position:relative; margin-bottom:8px; cursor:pointer;" title="Click to view full image">
          <img src="${primaryFile}" alt="${item.title || ''}" style="width:100%; height:160px; object-fit:cover; display:block; border-radius: 6px;" />
          <div class="view-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s ease;">
            <span style="background:rgba(0,0,0,0.7); color:#fff; padding:6px 12px; font-size:14px; font-weight:bold; border-radius:4px;">VIEW</span>
          </div>
          ${extraCount ? `<span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.75); color:#fff; padding:2px 8px; font-size:12px; font-weight:bold; border-radius:4px;">${extraCount}</span>` : ''}
        </div>
      `;
    }

    const scoreHTML = item.score ? `<span class="badge" style="background:#e4e4e7; color:#52525b; font-size:11px; font-weight:600; padding:3px 8px; border-radius:4px; margin-left:6px;">${item.score}</span>` : '';
    const dateHTML = item.date ? `<span style="font-size:12px; color:var(--muted);">${item.date}</span>` : '';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h3 style="margin: 0;">${item.title || ''}</h3>
        ${dateHTML}
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span class="badge ${item.category}">${item.category ? item.category.toUpperCase() : ''}</span>
        ${scoreHTML}
      </div>
      <div class="card-images-container" style="display: flex; flex-direction: column; margin-bottom: 12px;">
        ${previewHTML}
      </div>
    `;

    // Hover effect & modal click event
    const previewArea = card.querySelector('.zoomable-img');
    const overlay = card.querySelector('.view-overlay');

    if (previewArea && overlay) {
      previewArea.addEventListener('mouseenter', function() { overlay.style.opacity = '1'; });
      previewArea.addEventListener('mouseleave', function() { overlay.style.opacity = '0'; });

      previewArea.addEventListener('click', function() {
        openModal(item, isPdf, primaryFile);
      });
    }

    container.appendChild(card);
  });
}


// --- MODAL CONTROLLER & VIEWER ---
function openModal(item, isPdf, primaryFile) {
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  let modalIframe = document.getElementById('modal-iframe');
  
  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');
  const counterEl = document.getElementById('modal-counter');

  if (!imageModal) return;

  if (isPdf) {
    // Hide standard image elements when viewing PDF
    if (modalImg) modalImg.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counterEl) counterEl.style.display = 'none';

    // iframe element if it doesn't exist yet
    if (!modalIframe) {
      modalIframe = document.createElement('iframe');
      modalIframe.id = 'modal-iframe';
      modalIframe.style.cssText = "width: 90vw; height: 80vh; border: none; border-radius: 8px; background: #fff;";
      if (modalImg && modalImg.parentNode) {
        modalImg.parentNode.appendChild(modalIframe);
      }
    }
    
    const fullPdfUrl = new URL(primaryFile, window.location.href).href;
    if (isMobileDevice) {
      modalIframe.src = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(fullPdfUrl)}`;
    } else {
      modalIframe.src = fullPdfUrl;
    }
    modalIframe.style.display = 'block';
  } else {
    // Show image viewer modal
    if (modalIframe) modalIframe.style.display = 'none';
    if (counterEl) counterEl.style.display = 'block';

    currentModalImages = item.images || [];
    currentModalIndex = 0;

    if (modalImg) {
      modalImg.src = currentModalImages[currentModalIndex] || '';
      modalImg.style.display = 'block';
      
      // Limit dimensions so navigation arrows don't get covered
      modalImg.style.maxHeight = '72vh';
      modalImg.style.maxWidth = '78vw';
    }
    
    updateModalCounter();
    updateModalArrowsVisibility();
  }

  imageModal.classList.add('show');
}

function updateModalCounter() {
  const counterEl = document.getElementById('modal-counter');
  if (!counterEl) return;

  const currentStr = String(currentModalIndex + 1);
  const totalStr = String(currentModalImages.length);
  
  let activeColor = '#22c55e'; // default green
  if (currentCategory === 'exam') activeColor = '#f91a1a'; // blue
  if (currentCategory === 'activity') activeColor = '#f59e0b'; // orange

  let dotsHTML = '<div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">';
  for (let i = 0; i < currentModalImages.length; i++) {
    const dotColor = (i === currentModalIndex) ? activeColor : '#6b7280';
    dotsHTML += `<span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${dotColor}; display: inline-block;"></span>`;
  }
  dotsHTML += '</div>';

  counterEl.innerHTML = `<div>${currentStr} / ${totalStr}</div>${dotsHTML}`;
}

function updateModalArrowsVisibility() {
  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');

  if (prevBtn && nextBtn) {
    prevBtn.style.display = (currentModalIndex > 0) ? 'flex' : 'none';
    nextBtn.style.display = (currentModalIndex < currentModalImages.length - 1) ? 'flex' : 'none';
  }
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
  applyAvatarForTheme();
  updateHomeStats();

  // Dashboard card click shortcuts
  const statCardQuiz = document.getElementById('stat-card-quiz');
  const statCardExam = document.getElementById('stat-card-exam');
  const statCardActivity = document.getElementById('stat-card-activity');

  if (statCardQuiz) statCardQuiz.addEventListener('click', function() { goTo('quiz'); });
  if (statCardExam) statCardExam.addEventListener('click', function() { goTo('exam'); });
  if (statCardActivity) statCardActivity.addEventListener('click', function() { goTo('activity'); });

  // Initial tab check
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const pageName = activeTab.dataset.page;
    if (pageName !== 'home') {
      currentCategory = pageName;
      renderPortfolioItems();
    }
  }

  // Setup modal container elements
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeImageModal = document.getElementById('close-image-modal');
  const imageModalContent = imageModal ? imageModal.querySelector('.modal-content') : null;

  if (imageModalContent) {
    const modalParent = imageModal.querySelector('.modal-dialog') || imageModal.querySelector('div') || imageModal;
    modalParent.style.cssText = "position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;";
    imageModalContent.style.cssText = "position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto; max-width: 90vw;";

    // Responsive Arrow Navigation Buttons
    if (!document.getElementById('modal-prev-btn')) {
      const prevBtn = document.createElement('button');
      prevBtn.id = 'modal-prev-btn';
      prevBtn.innerHTML = '&#10094;';
      prevBtn.style.cssText = "position: fixed; left: 12px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.75); color: white; border: none; font-size: 20px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; z-index: 1030;";

      const nextBtn = document.createElement('button');
      nextBtn.id = 'modal-next-btn';
      nextBtn.innerHTML = '&#10095;';
      nextBtn.style.cssText = "position: fixed; right: 12px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.75); color: white; border: none; font-size: 20px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; z-index: 1030;";

      imageModal.appendChild(prevBtn);
      imageModal.appendChild(nextBtn);

      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentModalIndex > 0) {
          currentModalIndex--;
          if (modalImg) modalImg.src = currentModalImages[currentModalIndex];
          updateModalCounter();
          updateModalArrowsVisibility();
        }
      });

      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentModalIndex < currentModalImages.length - 1) {
          currentModalIndex++;
          if (modalImg) modalImg.src = currentModalImages[currentModalIndex];
          updateModalCounter();
          updateModalArrowsVisibility();
        }
      });
    }

    if (!document.getElementById('modal-counter')) {
      const counterDiv = document.createElement('div');
      counterDiv.id = 'modal-counter';
      counterDiv.style.cssText = "text-align: center; margin-top: 15px; font-family: monospace; font-size: 16px; font-weight: bold; color: #fff; letter-spacing: 2px; width: 100%;";
      imageModalContent.appendChild(counterDiv);
    }
  }

  // Close modal when clicking X button or background
  if (closeImageModal) {
    closeImageModal.addEventListener('click', function() {
      imageModal.classList.remove('show');
    });
  }

  window.addEventListener('click', function(e) {
    if (e.target === imageModal) {
      imageModal.classList.remove('show');
    }
  });
});