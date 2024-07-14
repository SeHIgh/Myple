// Async function to fetch API key
async function getApiKey() {
  try {
    const response = await fetch("../config.json");
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const config = await response.json();
    return config.maple_apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

// Function to include HTML files with callback
async function includeHTML(id, url, callback) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load HTML");
    }
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
    if (callback) callback(); // Callback function execution
  } catch (error) {
    console.error("Error loading HTML:", error);
  }
}

// Initialize header functions
function initializeHeaderFunctions() {
  const menuItems = document.querySelectorAll(".header-nav>ul>li");
  const menuFrame = document.querySelector(".header-frame");
  let activeItem =
    document.querySelector(".header-nav>ul>li.active") || menuItems[0];

  // Initial position setup
  updateFramePosition(activeItem);

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      updateFramePosition(item);
    });

    item.addEventListener("mouseleave", () => {
      updateFramePosition(activeItem);
    });

    item.addEventListener("click", () => {
      // Remove active class from all menu items
      menuItems.forEach((i) => i.classList.remove("active"));

      // Add active class to the clicked menu item
      item.classList.add("active");
      activeItem = item;

      // Fix position to the clicked item
      updateFramePosition(item);

      // Hide all content sections
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
      });

      // Display the section associated with the clicked menu item
      const targetSection = document.querySelector(
        item.getAttribute("data-target")
      );
      if (targetSection) {
        targetSection.classList.add("active");
      }
    });
  });

  function updateFramePosition(item) {
    // Get position and size of the selected menu item
    const itemRect = item.getBoundingClientRect();
    // Get position of the parent element (ul) of the menu item
    const parentRect = item.parentElement.getBoundingClientRect();
    // Calculate the frame position
    const position =
      parentRect.left +
      (itemRect.left - parentRect.left) +
      item.parentElement.scrollLeft;

    // Set the frame position to the calculated value
    menuFrame.style.transform = `translateX(${position}px)`;
  }
}

// footer-nav toggle 초기화 함수
function initializeFooterFunctions() {
  // Function to hide all menu contents
  const hideAllMenuContents = () => {
    document.querySelectorAll(".menu-content").forEach((content) => {
      content.classList.add("hidden");
    });
  };

  // Function to close the menu
  const closeMenu = () => {
    const navMenu = document.getElementById("nav_menu");
    navMenu.classList.remove("show");
    navMenu.removeAttribute("data-current");
    setTimeout(() => {
      hideAllMenuContents();
    }, 400); // 400ms delay for smoother transition (same as CSS transition duration)
  };

  // Bottom menu bar toggle functionality
  document.querySelectorAll(".nav_toggle").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent click event propagation
      const targetId = this.getAttribute("data-target");
      const navMenu = document.getElementById("nav_menu");

      if (navMenu.classList.contains("show")) {
        // Close the menu if it is currently shown
        closeMenu();
      } else {
        // Display selected menu content after a short delay for a natural transition

        hideAllMenuContents();
        document.getElementById(targetId).classList.remove("hidden");
        navMenu.classList.add("show");
        navMenu.setAttribute("data-current", targetId);
      }
    });
  });

  // Close the menu when clicking on the document
  document.addEventListener("click", closeMenu);

  // Prevent event propagation when clicking inside the menu
  document
    .getElementById("nav_menu")
    .addEventListener("click", function (event) {
      event.stopPropagation();
    });
}

// 사용자 기본 정보 표시 함수
function displayCharacterInfo(data) {
  const footerLv = document.getElementById("footer-lv");
  const footerName = document.getElementById("footer-name");
  const footerExp = document.getElementById("footer-exp");
  const footerExpBar = document.getElementById("footer-exp-bar");

  if (footerLv) footerLv.innerText = `Lv.${data.character_level}`;
  if (footerName) footerName.innerText = data.character_name;
  if (footerExp)
    footerExp.innerText = `${data.character_exp} [${data.character_exp_rate}%]`;
  if (footerExpBar)
    footerExpBar.style.width = `calc((100% - 16.5px) * ${data.character_exp_rate}/100)`;
}
// 사용자 스텟 정보 표시 함수
function displayCharacterStat(data) {
  const footerHP = document.getElementById("footer-hp");
  const footerMP = document.getElementById("footer-mp");

  const character_hp = data.final_stat.find(
    (stat) => stat.stat_name === "HP"
  ).stat_value;
  const character_mp = data.final_stat.find(
    (stat) => stat.stat_name === "MP"
  ).stat_value;

  if (footerHP)
    footerHP.getElementsByTagName(
      "p"
    )[0].innerText = `${character_hp}/${character_hp}`;
  if (footerMP)
    footerMP.getElementsByTagName(
      "p"
    )[0].innerText = `${character_mp}/${character_mp}`;

  console.log(data.final_stat);
}

// 사용자 기본 정보 조회 API 호출
async function lookupCharacterInfo(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    // Update retrieved data using the displayCharacterData function
    displayCharacterInfo(data);
  } catch (error) {
    console.error("Error fetching character info data:", error);
  }
}
// 사용자 스텟 정보 조회 API 호출
async function lookupCharacterStat(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    // Update retrieved data using the displayCharacterData function
    displayCharacterStat(data);
  } catch (error) {
    console.error("Error fetching character stat data:", error);
  }
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async () => {
  console.log("All content is loaded");

  // Initialize header functions
  initializeHeaderFunctions();

  // Include footer and initialize footer functions
  includeHTML(
    "footer-placeholder",
    "../layouts/footer.html",
    initializeFooterFunctions
  );

  // Get ocid from query parameters and fetch character data
  const queryParams = getQueryParams();
  const ocid = queryParams.ocid;

  if (ocid) {
    // Fetch character data using ocid
    await lookupCharacterInfo(ocid);
    await lookupCharacterStat(ocid);
  }

  // Async function to dynamically create grid cells
  async function createGridCells() {
    const expGrid = document.querySelector(".exp-grid");

    try {
      for (let i = 0; i < 10; i++) {
        const cell = document.createElement("div");
        expGrid.appendChild(cell);
      }
    } catch (error) {
      console.error("Error creating grid cells:", error);
    }
  }

  // Call function to create grid cells
  await createGridCells();
});

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

// Optional function that can be used if needed
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
