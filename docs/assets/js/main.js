// main.js

import * as nexonApi from "../api/nexonOpenApi.js";

// Function to include HTML files with callback
async function includeHTML(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load HTML");
    }
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
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
function displayCharacterFooter(data) {
  const elements = [
    { id: "footer-lv", type: "text", value: `Lv.${data.info.character_level}` },
    { id: "footer-name", type: "text", value: data.info.character_name },
    {
      id: "footer-exp",
      type: "text",
      value: `${data.info.character_exp} [${data.info.character_exp_rate}%]`,
    },
    {
      id: "footer-exp-bar",
      type: "style",
      style: "width",
      value: `calc((100% - 16.5px) * ${data.info.character_exp_rate}/100)`,
    },
    {
      id: "footer-hp",
      type: "conditional",
      value: `${
        data.stat.final_stat.find((stat) => stat.stat_name === "HP").stat_value
      }/${
        data.stat.final_stat.find((stat) => stat.stat_name === "HP").stat_value
      }`,
    },
    {
      id: "footer-mp",
      type: "conditional",
      value: `${
        data.stat.final_stat.find((stat) => stat.stat_name === "MP").stat_value
      }/${
        data.stat.final_stat.find((stat) => stat.stat_name === "MP").stat_value
      }`,
    },
  ];

  for (const elementInfo of elements) {
    const element = document.getElementById(elementInfo.id);
    if (element) {
      if (elementInfo.type === "text") {
        element.innerText = elementInfo.value;
      } else if (elementInfo.type === "style") {
        element.style[elementInfo.style] = elementInfo.value;
      } else if (elementInfo.type === "conditional") {
        const pTag = element.getElementsByTagName("p")[0];
        if (pTag) {
          pTag.innerText = elementInfo.value;
        }
      }
    }
  }
}

function displayCharacterProfile(data) {
  const elements = {
    searchDate: { id: "search_date", type: "date", span: true },
    characterName: {
      id: "character_name",
      type: "text",
      value: data.info.character_name,
    },
    characterLevel: {
      id: "character_lv",
      type: "text",
      value: `Lv.${data.info.character_level}`,
    },
    characterClass: {
      id: "character_class",
      type: "text",
      value: data.info.character_class,
    },
    characterImg: {
      id: "character_image",
      type: "image",
      value: data.info.character_image,
    },
    characterGender: {
      id: "character_gender",
      type: "gender",
      value: data.info.character_gender,
    },
    characterGuild: {
      id: "character_guild_name",
      type: "text",
      span: true,
      value: data.info.character_guild_name,
    },
    characterWorld: {
      id: "world_name",
      type: "text",
      span: true,
      value: data.info.world_name,
    },
    characterLastLogin: {
      id: "character_date_last_play",
      type: "text",
      span: true,
      value: data.info.access_flag == "true" ? "접속" : "미접속",
    },
    characterCreate: {
      id: "character_date_create",
      type: "text",
      span: true,
      value: data.info.character_date_create,
    },
    characterLiberate: {
      id: "liberation_quest_clear_flag",
      type: "text",
      span: true,
      value:
        data.info.liberation_quest_clear_flag == "true" ? "완료" : "미완료",
    },
    characterUnion: {
      id: "character_union",
      type: "text",
      span: true,
      value: data.union.union_level,
    },
    characterDojang: {
      id: "character_dojang",
      type: "text",
      span: true,
      value: data.dojang.dojang_best_floor,
    },
    characterPopularity: {
      id: "character_popularity",
      type: "text",
      span: true,
      value: data.popularity.popularity,
    },
    characterCP: {
      id: "character_CP",
      type: "conditional",
      value: data.stat.final_stat.find((stat) => stat.stat_name === "전투력")
        .stat_value,
    },
  };

  for (const key in elements) {
    const elementInfo = elements[key];
    const element = document.getElementById(elementInfo.id);
    if (element) {
      if (elementInfo.type === "text") {
        const target = elementInfo.span
          ? element.getElementsByTagName("span")[0]
          : element;
        if (target) target.innerText = elementInfo.value;
      } else if (elementInfo.type === "image") {
        element.src = elementInfo.value;
      } else if (elementInfo.type === "gender") {
        const isMale = elementInfo.value == "남";
        element.src = isMale
          ? "../assets/images/icons/male.svg"
          : "../assets/images/icons/female.svg";
        element.style.filter = isMale
          ? "invert(29%) sepia(88%) saturate(2293%) hue-rotate(170deg) brightness(93%) contrast(95%)"
          : "invert(19%) sepia(90%) saturate(3578%) hue-rotate(330deg) brightness(103%) contrast(101%)";
      } else if (elementInfo.type === "date") {
        element.getElementsByTagName("span")[0].innerText =
          new Date().toLocaleString();
      } else if (elementInfo.type === "conditional") {
        if (elementInfo.value) {
          let value = elementInfo.value;

          function formatKoreanNumber(value) {
            let num = parseInt(value, 10);
            let result = "";

            if (isNaN(num)) {
              return value; // 값이 숫자가 아닌 경우 원래 값을 반환
            }

            if (num >= 100000000) {
              let billionPart = Math.floor(num / 100000000);
              num = num % 100000000;
              result += billionPart + "억 ";
            }

            if (num >= 10000) {
              let tenThousandPart = Math.floor(num / 10000);
              num = num % 10000;
              result += tenThousandPart + "만 ";
            }

            result += num;
            return result.trim(); // 마지막에 불필요한 공백 제거
          }

          let formattedValue = formatKoreanNumber(value);
          console.log(formattedValue); // 디버그를 위해 결과 출력
          // 여기서 formattedValue를 사용하여 다음 작업을 수행할 수 있습니다.
          element.getElementsByTagName("span")[0].innerText = formattedValue;
        }
      }
    }
  }
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async () => {
  console.log("All content is loaded");

  // Include header and footer HTML
  // await includeHTML("nav-header", "../layouts/header.html");
  await includeHTML("footer-placeholder", "../layouts/footer.html");

  // Initialize header and footer functions after including the HTML
  // initializeHeaderFunctions();
  initializeFooterFunctions();

  // Get ocid from query parameters and fetch character data
  const queryParams = getQueryParams();
  const ocid = queryParams.ocid;

  if (ocid) {
    const characterData = await nexonApi.fetchCharacterData(ocid);
    if (characterData) {
      displayCharacterFooter(characterData);
      displayCharacterProfile(characterData);
    }
  }

  // Async function to dynamically create grid cells
  async function createGridCells() {
    const expGrid = document.querySelector(".exp-grid");

    if (!expGrid) {
      console.error("Error: .exp-grid element not found");
      return;
    }

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
