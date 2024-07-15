// main.js

import { getApiKey, lookupCharacterInfo, lookupCharacterStat } from '../api/nexonOpenApi.js';

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
    let activeItem = document.querySelector(".header-nav>ul>li.active") || menuItems[0];

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
}

function displayCharacterProfile(data) {
    const searchDate = document.getElementById("search_date");
    const characterName = document.getElementById("character_name");
    const characterLevel = document.getElementById("character_lv");
    const characterClass = document.getElementById("character_class");
    const characterImg = document.getElementById("character_image");
    const characterGender = document.getElementById("character_gender");
    const characterGuild = document.getElementById("character_guild_name");
    const characterWorld = document.getElementById("world_name");
    const characterLastLogin = document.getElementById("character_date_last_play");
    const characterCreate = document.getElementById("character_date_create");
    const characterLiberate = document.getElementById("liberation_quest_clear_flag");

    if (searchDate) searchDate.getElementsByTagName("span")[0].innerText = new Date().toLocaleString();
    if (characterName) characterName.innerText = data.character_name;
    if (characterLevel) characterLevel.innerText = `Lv.${data.character_level}`;
    if (characterClass) characterClass.innerText = data.character_class;
    if (characterImg) characterImg.src = data.character_image;
    if (characterGender) {
        const isMale = data.character_gender == "남";
        characterGender.src = isMale ? '../assets/images/icons/male.svg' : '../assets/images/icons/female.svg';
        characterGender.style.filter = isMale ? 'invert(29%) sepia(88%) saturate(2293%) hue-rotate(170deg) brightness(93%) contrast(95%)' : 'invert(19%) sepia(90%) saturate(3578%) hue-rotate(330deg) brightness(103%) contrast(101%)';
    }
    if (characterGuild) characterGuild.getElementsByTagName("span")[0].innerText = data.character_guild_name;
    if (characterWorld) characterWorld.getElementsByTagName("span")[0].innerText = data.world_name;
    if (characterLastLogin) characterLastLogin.getElementsByTagName("span")[0].innerText = data.access_flag == "true" ? "접속" : "미접속";
    if (characterCreate) characterCreate.getElementsByTagName("span")[0].innerText = data.character_date_create;
    if (characterLiberate) characterLiberate.getElementsByTagName("span")[0].innerText = data.liberation_quest_clear_flag == "true" ? "완료" : "미완료";
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
        // Fetch character data using ocid
        const characterInfo = await lookupCharacterInfo(ocid);
        if (characterInfo) {
            displayCharacterInfo(characterInfo);
            displayCharacterProfile(characterInfo);
        }

        const characterStat = await lookupCharacterStat(ocid);
        if (characterStat) {
            displayCharacterStat(characterStat);
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
