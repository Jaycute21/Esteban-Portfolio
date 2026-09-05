  // ---------- Define Photos for Light/Dark Mode ----------
  const defaultPhoto = {
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
    
    // Exams
  { 


  },
  //Activities
  {

  }

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


  applyAvatarForTheme();


  function updateHomeStats() {
    let quizCount = portfolioData.filter(q => q.category && q.category.toLowerCase() === 'quiz').length;
    let examCount = portfolioData.filter(q => q.category && q.category.toLowerCase() === 'exam').length;
    let activityCount = portfolioData.filter(q => q.category && q.category.toLowerCase() === 'activity').length;

    const statQuizEl = document.getElementById('stat-quiz');
    const statExamEl = document.getElementById('stat-exam');
    const statActivityEl = document.getElementById('stat-activity');

    if (statQuizEl) statQuizEl.textContent = quizCount;
    if (statExamEl) statExamEl.textContent = examCount;
    if (statActivityEl) statActivityEl.textContent = activityCount;
  }


  function renderPortfolioItems() {
    const containerId = currentCategory === 'exam' ? 'exam-list' : currentCategory === 'activity' ? 'activity-list' : 'quiz-list';
    const container = document.getElementById(containerId);

    if (!container) return;
    container.innerHTML = '';


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

      let primaryImage = item.images && item.images.length > 0 ? item.images[0] : '';
      let extraCount = item.images && item.images.length > 1 ? `+${item.images.length - 1}` : '';

      let imageHTML = `
        <div class="img-wrap zoomable-img" style="position:relative; margin-bottom:8px; cursor:pointer;" title="Click to view full image">
          <img src="${primaryImage}" alt="${item.title || ''}" style="width:100%; height:160px; object-fit:cover; display:block; border-radius: 6px;" />
          <div class="view-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s ease;">
            <span style="background:rgba(0,0,0,0.7); color:#fff; padding:6px 12px; font-size:14px; font-weight:bold; border-radius:4px;">VIEW</span>
          </div>
          ${extraCount ? `<span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.75); color:#fff; padding:2px 8px; font-size:12px; font-weight:bold; border-radius:4px;">${extraCount}</span>` : ''}
        </div>
      `;

      let scoreHTML = item.score ? `<span class="badge" style="background:#e4e4e7; color:#52525b; font-size:11px; font-weight:600; padding:3px 8px; border-radius:4px; margin-left:6px;">${item.score}</span>` : '';
      let dateHTML = item.date ? `<span style="font-size:12px; color:var(--muted);">${item.date}</span>` : '';

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
          ${imageHTML}
        </div>
      `;

      const imgWrap = card.querySelector('.zoomable-img');
      const overlay = card.querySelector('.view-overlay');
      if (imgWrap && overlay) {
        imgWrap.addEventListener('mouseenter', () => overlay.style.opacity = '1');
        imgWrap.addEventListener('mouseleave', () => overlay.style.opacity = '0');
      }

      if (imgWrap) {
        imgWrap.addEventListener('click', () => {
          currentModalImages = item.images || [];
          currentModalIndex = 0;

          const imageModal = document.getElementById('image-modal');
          const modalImg = document.getElementById('modal-img');
          if (imageModal && modalImg) {
            modalImg.src = currentModalImages[currentModalIndex] || '';
            imageModal.classList.add('show');
            updateModalCounter();
            updateModalArrowsVisibility();
          }
        });
      }

      container.appendChild(card);
    });
  }


  function updateModalCounter() {
    const counterEl = document.getElementById('modal-counter');
    if (counterEl) {

      const currentStr = String(currentModalIndex + 1);
      const totalStr = String(currentModalImages.length);
      
      let activeColor = '#22c55e'; // default green  quiz
      if (currentCategory === 'exam') {
        activeColor = '#3b82f6'; // blue for exam
      } else if (currentCategory === 'activity') {
        activeColor = '#f59e0b'; // orange activity
      }

      let dotsHTML = '<div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">';
      for (let i = 0; i < currentModalImages.length; i++) {
        const dotColor = i === currentModalIndex ? activeColor : '#6b7280';
        dotsHTML += `<span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${dotColor}; display: inline-block;"></span>`;
      }
      dotsHTML += '</div>';

      counterEl.innerHTML = `<div>${currentStr} / ${totalStr}</div>${dotsHTML}`;
    }
  }

  function updateModalArrowsVisibility() {
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');
    if (prevBtn && nextBtn) {
      prevBtn.style.display = currentModalIndex > 0 ? 'flex' : 'none';
      nextBtn.style.display = currentModalIndex < currentModalImages.length - 1 ? 'flex' : 'none';
    }
  }


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

    if (imageModalContent) {
      
      const modalParent = imageModal.querySelector('.modal-dialog') || imageModal.querySelector('div') || imageModal;
      modalParent.style.cssText = "position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;";

      imageModalContent.style.cssText = "position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto; max-width: fit-content;";
      
      if (modalImg) {
        modalImg.style.cssText = "display: block; max-height: 75vh; max-width: 100%; object-fit: contain; margin: 0 auto;";
      }

      
      if (!document.getElementById('modal-prev-btn')) {
        const prevBtn = document.createElement('button');
        prevBtn.id = 'modal-prev-btn';
        prevBtn.innerHTML = '&#10094;';
      
        prevBtn.style.cssText = "position: fixed; left: calc(50% - 240px); top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; z-index: 1020;";

        const nextBtn = document.createElement('button');
        nextBtn.id = 'modal-next-btn';
        nextBtn.innerHTML = '&#10095;';
      
        nextBtn.style.cssText = "position: fixed; right: calc(50% - 240px); top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; z-index: 1020;";

      
        imageModal.appendChild(prevBtn);
        imageModal.appendChild(nextBtn);

        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (currentModalIndex > 0) {
            currentModalIndex--;
            modalImg.src = currentModalImages[currentModalIndex];
            updateModalCounter();
            updateModalArrowsVisibility();
          }
        });

        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (currentModalIndex < currentModalImages.length - 1) {
            currentModalIndex++;
            modalImg.src = currentModalImages[currentModalIndex];
            updateModalCounter();
            updateModalArrowsVisibility();
          }
        });
      }

      // Add Counter Element if it doesn't exist
      if (!document.getElementById('modal-counter')) {
        const counterDiv = document.createElement('div');
        counterDiv.id = 'modal-counter';
        counterDiv.style.cssText = "text-align: center; margin-top: 15px; font-family: monospace; font-size: 16px; font-weight: bold; color: #fff; letter-spacing: 2px; width: 100%;";
        imageModalContent.appendChild(counterDiv);
      }
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