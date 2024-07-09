// Function to include HTML files
async function includeHTML(id, url, callback) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to load HTML');
      }
      const data = await response.text();
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
  } catch (error) {
      console.error('Error loading HTML:', error);
  }
}

// Initialize header functions
function initializeHeaderFunctions() {
  const menuItems = document.querySelectorAll(".header-nav>ul>li");
  const menuFrame = document.querySelector(".header-frame");
  let activeItem =
      document.querySelector(".header-nav>ul>li.active") || menuItems[0];

  // 초기 위치 설정
  updateFramePosition(activeItem);

  menuItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
          updateFramePosition(item);
      });

      item.addEventListener("mouseleave", () => {
          updateFramePosition(activeItem);
      });

      item.addEventListener("click", () => {
          // 모든 메뉴 항목에서 active 클래스 제거
          menuItems.forEach((i) => i.classList.remove("active"));

          // 클릭한 메뉴 항목에 active 클래스 추가
          item.classList.add("active");
          activeItem = item;

          // 클릭한 항목으로 위치 고정
          updateFramePosition(item);

          // 모든 섹션 숨기기
          document.querySelectorAll(".content-section").forEach((section) => {
              section.classList.remove("active");
          });

          // 클릭한 메뉴 항목과 연결된 섹션 표시
          const targetSection = document.querySelector(
              item.getAttribute("data-target")
          );
          targetSection.classList.add("active");
      });
  });

  function updateFramePosition(item) {
      // 선택된 메뉴 항목의 위치 및 크기를 가져옴
      const itemRect = item.getBoundingClientRect();
      // 메뉴 항목의 부모 요소(ul)의 위치를 가져옴
      const parentRect = item.parentElement.getBoundingClientRect();
      // 프레임의 위치를 계산
      const position =
          parentRect.left +
          (itemRect.left - parentRect.left) +
          item.parentElement.scrollLeft;

      // 프레임의 위치를 계산된 값으로 설정
      menuFrame.style.transform = `translateX(${position}px)`;
  }
}

// Initialize footer functions
function initializeFooterFunctions() {
  // 하단 메뉴 바
  document.querySelectorAll(".nav_toggle").forEach((button) => {
      button.addEventListener("click", function (event) {
          event.stopPropagation(); // 클릭 이벤트 전파 방지
          const targetId = this.getAttribute("data-target");
          const navMenu = document.getElementById("nav_menu");

          if (!navMenu.classList.contains("show")) {
              // 모든 메뉴 콘텐츠 숨기기
              document.querySelectorAll(".menu-content").forEach((content) => {
                  content.classList.add("hidden");
              });
              // 선택된 메뉴 콘텐츠 보이기
              document.getElementById(targetId).classList.remove("hidden");

              // 메뉴 토글
              navMenu.classList.toggle("show");
          } else {
              // 메뉴 닫기
              navMenu.classList.remove("show");
              // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
              setTimeout(() => {
                  document.querySelectorAll(".menu-content").forEach((content) => {
                      content.classList.add("hidden");
                  });
              }, 400); // transition 시간과 동일하게 설정
          }
      });
  });

  // 문서 클릭 시 메뉴 닫기
  document.addEventListener("click", function () {
      const navMenu = document.getElementById("nav_menu");
      if (navMenu.classList.contains("show")) {
          navMenu.classList.remove("show");
          // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
          setTimeout(() => {
              document.querySelectorAll(".menu-content").forEach((content) => {
                  content.classList.add("hidden");
              });
          }, 400); // transition 시간과 동일하게 설정
      }
  });

  // 메뉴 내 클릭 시 이벤트 전파 방지
  document
      .getElementById("nav_menu")
      .addEventListener("click", function (event) {
          event.stopPropagation();
      });
}

// Function to display character data
function displayCharacterData(data) {
  // footer에 캐릭터 정보 추가
  const footerLv = document.getElementById('footer-lv');
  const footerName = document.getElementById('footer-name');

  if (footerLv) footerLv.innerText = `Lv.${data.character_level}`;
  if (footerName) footerName.innerText = data.character_name;
}

// 쿠키에서 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const queries = queryString.split("&");

  queries.forEach((query) => {
      const [key, value] = query.split("=");
      params[key] = decodeURIComponent(value);
  });

  return params;
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('All content is loaded');

  // Initialize header functions
  initializeHeaderFunctions();

  // Include footer and initialize footer functions
  includeHTML('footer-placeholder', '../layouts/footer.html', initializeFooterFunctions);

  // Get ocid from query parameters and fetch character data
  const queryParams = getQueryParams();
  const ocid = queryParams.ocid;

  if (ocid) {
      // Fetch character data using ocid
      lookupCharacterInfo(ocid);
  }
});

// Function to lookup character info using ocid
async function lookupCharacterInfo(ocid) {
  const apiKey = await getApiKey();
  const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'x-nxopen-api-key': apiKey
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      
      // 스타일을 개별적으로 설정하여 transition 효과 적용
      const section1 = document.getElementById('section1');
      section1.style.transition = 'all 1s ease-in-out';
      section1.style.width = '50%';
      section1.style.padding = '50px 0';
      await delay(100);

      const characterPreview = document.getElementById('character-preview');
      characterPreview.style.transition = 'all 1s ease-in-out';
      characterPreview.style.display = 'flex';
      await delay(500);

      const characterInfo = document.getElementById('character-info-box');
      characterInfo.style.transition = 'all 1s ease-in-out';
      characterInfo.style.display = 'flex';
      await delay(100);

      // 캐릭터 정보 표시
      document.getElementById('characterImgResult').src = data.character_image;
      document.getElementById('serverLogo').src = `./assets/images/logos/worlds/${data.world_name.replace(/[0-9]/g, '')}.png`;
      document.getElementById('serverResult').innerText = data.world_name;
      document.getElementById('characterNameResult').innerText = data.character_name;
      document.getElementById('jobResult').innerText = data.character_class;
      
      const lvElement = document.getElementById('lv');
      lvElement.style.color = 'black';
      document.getElementById('levelResult').innerText = data.character_level;

      // 데이터를 쿠키에 저장
      document.cookie = `characterData=${encodeURIComponent(JSON.stringify(data))}; path=/`;

  } catch (error) {
      document.getElementById('characterNameResult').innerText = ``;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to include HTML files
async function includeHTML(id, url, callback) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to load HTML');
      }
      const data = await response.text();
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
  } catch (error) {
      console.error('Error loading HTML:', error);
  }
}

// Initialize header functions
function initializeHeaderFunctions() {
  const menuItems = document.querySelectorAll(".header-nav>ul>li");
  const menuFrame = document.querySelector(".header-frame");
  let activeItem =
      document.querySelector(".header-nav>ul>li.active") || menuItems[0];

  // 초기 위치 설정
  updateFramePosition(activeItem);

  menuItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
          updateFramePosition(item);
      });

      item.addEventListener("mouseleave", () => {
          updateFramePosition(activeItem);
      });

      item.addEventListener("click", () => {
          // 모든 메뉴 항목에서 active 클래스 제거
          menuItems.forEach((i) => i.classList.remove("active"));

          // 클릭한 메뉴 항목에 active 클래스 추가
          item.classList.add("active");
          activeItem = item;

          // 클릭한 항목으로 위치 고정
          updateFramePosition(item);

          // 모든 섹션 숨기기
          document.querySelectorAll(".content-section").forEach((section) => {
              section.classList.remove("active");
          });

          // 클릭한 메뉴 항목과 연결된 섹션 표시
          const targetSection = document.querySelector(
              item.getAttribute("data-target")
          );
          targetSection.classList.add("active");
      });
  });

  function updateFramePosition(item) {
      // 선택된 메뉴 항목의 위치 및 크기를 가져옴
      const itemRect = item.getBoundingClientRect();
      // 메뉴 항목의 부모 요소(ul)의 위치를 가져옴
      const parentRect = item.parentElement.getBoundingClientRect();
      // 프레임의 위치를 계산
      const position =
          parentRect.left +
          (itemRect.left - parentRect.left) +
          item.parentElement.scrollLeft;

      // 프레임의 위치를 계산된 값으로 설정
      menuFrame.style.transform = `translateX(${position}px)`;
  }
}

// Initialize footer functions
function initializeFooterFunctions() {
  // 하단 메뉴 바
  document.querySelectorAll(".nav_toggle").forEach((button) => {
      button.addEventListener("click", function (event) {
          event.stopPropagation(); // 클릭 이벤트 전파 방지
          const targetId = this.getAttribute("data-target");
          const navMenu = document.getElementById("nav_menu");

          if (!navMenu.classList.contains("show")) {
              // 모든 메뉴 콘텐츠 숨기기
              document.querySelectorAll(".menu-content").forEach((content) => {
                  content.classList.add("hidden");
              });
              // 선택된 메뉴 콘텐츠 보이기
              document.getElementById(targetId).classList.remove("hidden");

              // 메뉴 토글
              navMenu.classList.toggle("show");
          } else {
              // 메뉴 닫기
              navMenu.classList.remove("show");
              // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
              setTimeout(() => {
                  document.querySelectorAll(".menu-content").forEach((content) => {
                      content.classList.add("hidden");
                  });
              }, 400); // transition 시간과 동일하게 설정
          }
      });
  });

  // 문서 클릭 시 메뉴 닫기
  document.addEventListener("click", function () {
      const navMenu = document.getElementById("nav_menu");
      if (navMenu.classList.contains("show")) {
          navMenu.classList.remove("show");
          // 약간의 딜레이 후 hidden 처리 (자연스러운 효과를 위해)
          setTimeout(() => {
              document.querySelectorAll(".menu-content").forEach((content) => {
                  content.classList.add("hidden");
              });
          }, 400); // transition 시간과 동일하게 설정
      }
  });

  // 메뉴 내 클릭 시 이벤트 전파 방지
  document
      .getElementById("nav_menu")
      .addEventListener("click", function (event) {
          event.stopPropagation();
      });
}

// Function to display character data
function displayCharacterData(data) {
  // footer에 캐릭터 정보 추가
  const footerLv = document.getElementById('footer-lv');
  const footerName = document.getElementById('footer-name');

  if (footerLv) footerLv.innerText = `Lv.${data.character_level}`;
  if (footerName) footerName.innerText = data.character_name;
}

// 쿠키에서 값을 가져오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to get query parameters
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const queries = queryString.split("&");

  queries.forEach((query) => {
      const [key, value] = query.split("=");
      params[key] = decodeURIComponent(value);
  });

  return params;
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('All content is loaded');

  // Initialize header functions
  initializeHeaderFunctions();

  // Include footer and initialize footer functions
  includeHTML('footer-placeholder', '../layouts/footer.html', initializeFooterFunctions);

  // Get ocid from query parameters and fetch character data
  const queryParams = getQueryParams();
  const ocid = queryParams.ocid;

  if (ocid) {
      // Fetch character data using ocid
      lookupCharacterInfo(ocid);
  }
});

// Function to lookup character info using ocid
async function lookupCharacterInfo(ocid) {
  const apiKey = await getApiKey();
  const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'x-nxopen-api-key': apiKey
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      
      // 스타일을 개별적으로 설정하여 transition 효과 적용
      const section1 = document.getElementById('section1');
      section1.style.transition = 'all 1s ease-in-out';
      section1.style.width = '50%';
      section1.style.padding = '50px 0';
      await delay(100);

      const characterPreview = document.getElementById('character-preview');
      characterPreview.style.transition = 'all 1s ease-in-out';
      characterPreview.style.display = 'flex';
      await delay(500);

      const characterInfo = document.getElementById('character-info-box');
      characterInfo.style.transition = 'all 1s ease-in-out';
      characterInfo.style.display = 'flex';
      await delay(100);

      // 캐릭터 정보 표시
      document.getElementById('characterImgResult').src = data.character_image;
      document.getElementById('serverLogo').src = `./assets/images/logos/worlds/${data.world_name.replace(/[0-9]/g, '')}.png`;
      document.getElementById('serverResult').innerText = data.world_name;
      document.getElementById('characterNameResult').innerText = data.character_name;
      document.getElementById('jobResult').innerText = data.character_class;
      
      const lvElement = document.getElementById('lv');
      lvElement.style.color = 'black';
      document.getElementById('levelResult').innerText = data.character_level;

      // 데이터를 쿠키에 저장
      document.cookie = `characterData=${encodeURIComponent(JSON.stringify(data))}; path=/`;

  } catch (error) {
      document.getElementById('characterNameResult').innerText = ``;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
