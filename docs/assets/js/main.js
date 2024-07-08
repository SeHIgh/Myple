// Function to include HTML files
function includeHTML(id, url, callback) {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
        if (callback) callback();
      })
      .catch(error => console.error('Error loading HTML:', error));
  }
  
  // Include sections and initialize functionality after inclusion
  includeHTML('header-placeholder', '../layouts/header.html', initializeHeaderFunctions);
  includeHTML('footer-placeholder', '../layouts/footer.html', initializeFooterFunctions);
  
  function initializeHeaderFunctions() {
    const menuItems = document.querySelectorAll('.header-nav>ul>li');
    const menuFrame = document.querySelector('.header-frame');
    let activeItem = document.querySelector('.header-nav>ul>li.active') || menuItems[0];
  
    // 초기 위치 설정
    updateFramePosition(activeItem);
  
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        updateFramePosition(item);
      });
  
      item.addEventListener('mouseleave', () => {
        updateFramePosition(activeItem);
      });
  
      item.addEventListener('click', () => {
        // 모든 메뉴 항목에서 active 클래스 제거
        menuItems.forEach(i => i.classList.remove('active'));
  
        // 클릭한 메뉴 항목에 active 클래스 추가
        item.classList.add('active');
        activeItem = item;
  
        // 클릭한 항목으로 위치 고정
        updateFramePosition(item);
  
        // 모든 섹션 숨기기
        document.querySelectorAll('.content-section').forEach(section => {
          section.classList.remove('active');
        });
  
        // 클릭한 메뉴 항목과 연결된 섹션 표시
        const targetSection = document.querySelector(item.getAttribute('data-target'));
        targetSection.classList.add('active');
      });
    });
  
    function updateFramePosition(item) {
      // 선택된 메뉴 항목의 위치 및 크기를 가져옴
      const itemRect = item.getBoundingClientRect();
      // 메뉴 항목의 부모 요소(ul)의 위치를 가져옴
      const parentRect = item.parentElement.getBoundingClientRect();
      // 프레임의 위치를 계산
      const position = parentRect.left + (itemRect.left - parentRect.left) + item.parentElement.scrollLeft;
  
      // 프레임의 위치를 계산된 값으로 설정
      menuFrame.style.transform = `translateX(${position}px)`;
    }
  }
  
  function initializeFooterFunctions() {
    // 하단 메뉴 바
    document.querySelectorAll('.nav_toggle').forEach(button => {
      button.addEventListener('click', function(event) {
        event.stopPropagation(); // 클릭 이벤트 전파 방지
        const targetId = this.getAttribute('data-target');
        const navMenu = document.getElementById('nav_menu');
  
        if(!navMenu.classList.contains('show')){
          // 모든 메뉴 콘텐츠 숨기기
          document.querySelectorAll('.menu-content').forEach(content => {
            content.classList.add('hidden');
          });
          // 선택된 메뉴 콘텐츠 보이기
          document.getElementById(targetId).classList.remove('hidden');
  
          // 메뉴 토글
          navMenu.classList.toggle('show');
        } else {
          // 메뉴 닫기
          navMenu.classList.remove('show');
          // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
          setTimeout(() => {
            document.querySelectorAll('.menu-content').forEach(content => {
              content.classList.add('hidden');
            });
          }, 400); // transition 시간과 동일하게 설정
        }
      });
    });
  
    // 문서 클릭 시 메뉴 닫기
    document.addEventListener('click', function() {
      const navMenu = document.getElementById('nav_menu');
      if (navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
        setTimeout(() => {
          document.querySelectorAll('.menu-content').forEach(content => {
            content.classList.add('hidden');
          });
        }, 400); // transition 시간과 동일하게 설정
      }
    });
  
    // 메뉴 내 클릭 시 이벤트 전파 방지
    document.getElementById('nav_menu').addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }
  
  // Additional scripts to run after all content is loaded
  document.addEventListener('DOMContentLoaded', () => {
    console.log('All content is loaded');
  });
  