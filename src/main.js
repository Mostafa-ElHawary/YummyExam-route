//  <reference types="../@types/jquery"/>



// sidenav

// end sidenav
document.addEventListener('DOMContentLoaded', () => {
  const sidebarBtn = document.getElementById('sidebar-btn');
  const sidebar = document.getElementById('sidebar');

  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
});


// Hero start

var sidebar = (function () {
  "use strict";

  var $contnet = $("#content"),
    $sidebar = $("#sidebar"),
    $sidebarBtn = $("#sidebar-btn"),
    $toggleCol = $("body").add($contnet).add($sidebarBtn),
    sidebarIsVisible = false;

  $sidebarBtn.on("click", function () {
    if (!sidebarIsVisible) {
      bindContent();
    } else {
      unbindContent();
    }

    toggleMenu();
  });

  function bindContent() {
    $contnet.on("click", function () {
      toggleMenu();
      unbindContent();
    });
  }

  function unbindContent() {
    $contnet.off();
  }

  function toggleMenu() {
    $toggleCol.toggleClass("sidebar-show");
    $sidebar.toggleClass("show");

    if (!sidebarIsVisible) {
      sidebarIsVisible = true;
    } else {
      sidebarIsVisible = false;
    }
  }

  var $menuToggle = $sidebar.find(".menu-toggle");

  $menuToggle.each(function () {
    var $this = $(this),
      $submenuBtn = $this.children(".menu-toggle-btns").find(".menu-btn"),
      $submenu = $this.children(".submenu");

    $submenuBtn.on("click", function (e) {
      e.preventDefault();
      $submenu.slideToggle();
      $(this).toggleClass("active");
    });
  });
})();

// Hero end
// +++++++++++++++++++++++++++++++++++++++++++++++
// start sideNav animation

$(document).ready(function () {
  $(".menu-link").each(function (index) {
    $(this).css("transition-delay", `${index * 200}ms`);
  });

  $(".sidebar-btn").on("click", function () {
    $(".menu-link").toggleClass("show");
    $(".menu-link").each(function () {
      if ($(this).hasClass("show")) {
        $(this).css("background", "#333");
      } else {
        $(this).css("color", "");
      }
    });
  });
});
// end sideNav animation
// +++++++++++++++++++++++++++++++++++++++++++++++

const CACHE_EXPIRATION = 5 * 60 * 1000;
const cache = new Map();

const fetchData = async (url) => {
  const now = Date.now();
  if (cache.has(url)) {
    const { data, timestamp } = cache.get(url);
    if (now - timestamp < CACHE_EXPIRATION) {
      return data;
    }
  }
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Network response was not ok: ${response.statusText}`);
    const data = await response.json();
    cache.set(url, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    throw error;
  }
};

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

const memoizedFetchData = memoize(fetchData);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandomDelay = () => Math.floor(Math.random() * 501) + 1000;


class Search {
  constructor({ onSearchByName, onSearchByFLetter }) {
    this.onSearchByName = onSearchByName;
    this.onSearchByFLetter = onSearchByFLetter;
  }

  handleSearchByName(event) {
    const query = event.target.value;
    if (query.length >= 3) {
      this.fetchSearchResults(query, 'name');
    }
  }

  handleSearchByFLetter(event) {
    const query = event.target.value;
    if (query.length === 1) {
      this.fetchSearchResults(query, 'letter');
    }
  }

  async fetchSearchResults(query, type) {
    let url;
    if (type === 'name') {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    } else if (type === 'letter') {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`;
    }

    try {
      const data = await fetchData(url);
      if (data && data.meals) {
        displayData(data.meals);
      } else {
        container.innerHTML = '<p>No results found.</p>';
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      container.innerHTML = '<p>An error occurred while searching. Please try again.</p>';
    }
  }

  render() {
    return `
      <div class="container w-3/4 mx-auto" id="searchContainer">
          <div class="flex flex-wrap py-4">
              <div class="w-full md:w-1/2 px-2">
                  <input id="searchByName" class="w-full px-3 py-2 bg-transparent text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Search By Name">
              </div>
              <div class="w-full md:w-1/2 px-2">
                  <input id="searchByFLetter" maxlength="1" class="w-full px-3 py-2 bg-transparent text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Search By First Letter">
              </div>
          </div>
      </div>
    `;
  }

  mount(container) {
    container.innerHTML = this.render();
    container.querySelector('#searchByName').addEventListener('keyup', (event) => this.handleSearchByName(event));
    container.querySelector('#searchByFLetter').addEventListener('keyup', (event) => this.handleSearchByFLetter(event));
  }
}



class MainCard {
  constructor({ idMeal, strMeal, strMealThumb, strTags }) {
    Object.assign(this, { idMeal, strMeal, strMealThumb, strTags });
  }

  renderElement() {
    const a = document.createElement("a");
    a.className = `
      group
      w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5
      p-2 m-1
      bg-white rounded-xl shadow-md 
      transform transition duration-300 ease-in-out 
      hover:shadow-xl hover:scale-105 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      animate__animated animate__fadeIn animate__faster
    `;
    a.dataset.id = this.idMeal;
    a.href = "#";

    const imgContainer = document.createElement("div");
    imgContainer.className = "overflow-hidden rounded-lg";

    const img = document.createElement("img");
    img.src = this.strMealThumb;
    img.alt = this.strTags ?? "";
    img.className = `
      w-full h-48 object-cover
      transform transition duration-300 ease-in-out
      group-hover:scale-110 group-hover:rotate-2
    `;
    imgContainer.appendChild(img);

    const p = document.createElement("p");
    p.className = `
      mt-2 text-gray-800 text-center font-semibold truncate
      transform transition duration-300 ease-in-out
      group-hover:text-indigo-600
    `;
    p.textContent = this.strMeal;

    a.appendChild(imgContainer);
    a.appendChild(p);

    a.addEventListener('mouseenter', () => {
      a.classList.add('animate__pulse');
    });
    a.addEventListener('mouseleave', () => {
      a.classList.remove('animate__pulse');
    });

    return a;    
  }
}

class MainCardDetails {
  constructor({
    idMeal,
    strMeal,
    strInstructions,
    strArea,
    strCategory,
    strMealThumb,
    strTags,
    strYoutube,
    ...rest
  }) {
    Object.assign(this, {
      idMeal,
      strMeal,
      strInstructions,
      strArea,
      strCategory,
      strMealThumb,
      strTags,
      strYoutube,
    });
    this.ingredients = Object.entries(rest)
      .filter(([key, value]) => key.startsWith("strIngredient") && value)
      .map(([key, ingredient], index) => ({
        ingredient,
        measure: rest[`strMeasure${index + 1}`] ?? "",
      }));
  }

  render() {
    const ingredientsList = this.ingredients
      .map(({ ingredient, measure }) => `<li>${measure} ${ingredient}</li>`)
      .join("");

    return `
 <div class="meal-details bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl animate-fade-in-down">
  <div class="flex flex-col lg:flex-row">
    <div class="lg:w-1/5 relative group">
      <img src="${this.strMealThumb}" alt="${
      this.strMeal
    }" class="w-full h-64 lg:h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span class="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">${
          this.strMeal
        }</span>
      </div>
    </div>
    <div class="lg:w-4/5 p-8">
      <h2 class="text-4xl font-extrabold mb-6 text-gray-800 dark:text-white border-b pb-2 animate-fade-in">${
        this.strMeal
      }</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="flex items-center transform hover:scale-105 transition-transform duration-300">
          <span class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3 animate-pulse">
            <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          </span>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold text-indigo-600 dark:text-indigo-300">Category:</span> ${
            this.strCategory ?? "N/A"
          }</p>
        </div>
        <div class="flex items-center transform hover:scale-105 transition-transform duration-300">
          <span class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3 animate-pulse">
            <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </span>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold text-green-600 dark:text-green-300">Area:</span> ${
            this.strArea ?? "N/A"
          }</p>
        </div>
        <div class="flex items-center transform hover:scale-105 transition-transform duration-300">
          <span class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3 animate-pulse">
            <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          </span>
          <p class="text-gray-700 dark:text-gray-300"><span class="font-semibold text-yellow-600 dark:text-yellow-300">Tags:</span> ${
            this.strTags ?? "N/A"
          }</p>
        </div>
      </div>
      <div class="mb-8 animate-fade-in">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <svg class="w-7 h-7 mr-2 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          Instructions:
        </h3>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${
          this.strInstructions ?? "N/A"
        }</p>
      </div>
     <div class="mb-8">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
          <svg class="w-7 h-7 mr-2 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
          Ingredients:
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${this.ingredients
            .map(
              (ingredient, index) => `
            <div class="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-105">
              <span class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold mr-3">
                ${index + 1}
              </span>
              <span class="text-gray-700 dark:text-gray-300">
                ${ingredient.ingredient} - ${ingredient.measure}
              </span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      ${
        this.strYoutube
          ? `<a href="${this.strYoutube}" target="_blank" class="inline-flex items-center px-6 py-3 text-white bg-gradient-to-br from-purple-500 to-indigo-800 rounded-full hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 animate-bounce">
               <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
               Watch on YouTube
             </a>`
          : ""
      }
    </div>
  </div>
</div>
    `;
  }
}

class Category {
  constructor({
    idCategory,
    strCategory,
    strCategoryThumb,
    strCategoryDescription,
  }) {
    Object.assign(this, {
      idCategory,
      strCategory,
      strCategoryThumb,
      strCategoryDescription,
    });
  }

  render() {
    return `

      <a href="#" 
     class="group block w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 transform transition duration-300 ease-in-out hover:scale-105"
     data-id="${this.idCategory}" 
     data-type="category">
       <img src="${this.strCategoryThumb}" alt="${this.strCategory}"
        class="w-full  mb-2 rounded-md"
        >
        <p class='text-black text-center font-semibold'>${this.strCategory}</p>
      </a>
   
   `;
  }
}

class CategoryMeals {
  constructor({ idMeal, strMeal, strMealThumb }) {
    Object.assign(this, { idMeal, strMeal, strMealThumb });
  }

  render() {
    return `
     <div class="group w-full md:w-1/4 bg-white m-2 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
  <a class="block" data-id="${this.idMeal}" href="#">
    <div class="relative overflow-hidden">
      <img src="${this.strMealThumb}" alt="${
      this.strMeal ?? ""
    }" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110">
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate">${
        this.strMeal
      }</h3>
      <div class="flex items-center justify-between">
        <button class="text-blue-600 hover:text-blue-800 transition-colors duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  </a>
</div>
    `;
  }
}

class AreaCard {
  constructor({ strArea }) {
    this.strArea = strArea;
  }
  render() {
    return `

   
  <a href="#" class="area-card relative overflow-hidden w-full md:w-1/4 h-48 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105" data-id="${this.strArea}" data-type="area">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 opacity-75"></div>
  <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
    <i class="fa-solid fa-globe text-4xl mb-3 animate-bounce"></i>
    <h3 class="text-2xl font-bold mb-2">${this.strArea}</h3>
    <p class="text-sm opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Discover flavors</p>
  </div>
  <div class="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
</a>
   
     
    `;
  }
}

class CardIngredients {
  constructor({ idIngredient, strIngredient, strDescription }) {
    Object.assign(this, { idIngredient, strIngredient, strDescription });
  }
  render() {
    return `
  <a href="#" class="ingredient-card group" data-id="${this.strIngredient}" data-type="ingredient">
    <div class="bg-gradient-to-br from-purple-500 to-indigo-800 dark:from-purple-700 dark:to-indigo-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div class="p-4 flex flex-col items-center">
        <div class="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:animate-bounce">
          <i class="fas fa-pepper-hot text-3xl text-green-500 dark:text-green-500"></i>
        </div>
        <h3 class="text-lg font-bold text-white dark:text-white text-center mb-2">${this.strIngredient}</h3>
        <span class="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-green-300 rounded-full group-hover:bg-green-600 transition-colors duration-300">
          Explore
          <i class="fas fa-chevron-right ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
        </span>
      </div>
    </div>
  </a>
    `;
  }
}

class Contact {
  constructor() {}

  render() {
    return `
 <div class="min-h-screen p-8 flex items-center justify-center">
  <div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
    <div class="p-8">
      <h2 class="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-8">Get in Touch</h2>
      <form id="contactForm" class="space-y-6">
        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div class="form-group">
            <label for="nameInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Your Name</label>
            <input type="text" id="nameInput" class="input-field " placeholder="John Doe" required>
            <p id="nameAlert" class="error-message text-gray-300 text-sm">Special characters and numbers not allowed</p>
          </div>
          <div class="form-group">
            <label for="emailInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Your Email</label>
            <input type="email" id="emailInput" class="input-field" placeholder="name@example.com" required>
            <p id="emailAlert" class="error-message text-gray-300">Email not valid *exemple@yyy.zzz</p>
          </div>
          <div class="form-group">
            <label for="phoneInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Your Phone</label>
            <input type="tel" id="phoneInput" class="input-field" placeholder="123-45-678" required>
            <p id="phoneAlert" class="error-message text-gray-300">Enter valid Phone Number</p>
          </div>
          <div class="form-group">
            <label for="ageInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Your Age</label>
            <input type="number" id="ageInput" class="input-field" placeholder="25" required>
            <p id="ageAlert" class="error-message text-gray-300">Enter valid age</p>
          </div>
          <div class="form-group">
            <label for="passwordInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Your Password</label>
            <input type="password" id="passwordInput" class="input-field" required>
            <p id="passwordAlert" class="error-message text-gray-300">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
          </div>
          <div class="form-group">
            <label for="repasswordInput" class="block mb-2 text-sm font-medium text-gray-300 dark:text-white">Confirm Password</label>
            <input type="password" id="repasswordInput" class="input-field" required>
            <p id="repasswordAlert" class="error-message text-gray-300">Enter valid repassword</p>
          </div>
        </div>
        <button type="submit" id="submitBtn" class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          <span class="flex items-center justify-center">
            <span class="mr-2">Submit</span>
            <svg class="w-5 h-5 animate-spin hidden" id="loadingIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>
      </form>
    </div>
  </div>
</div>
    `;
  }

  display() {
    const container = document.querySelector("#content .card");
    container.innerHTML = this.render();
  }
}

const container = document.querySelector("#content .card");
const loader = document.createElement("div");
loader.className = "loader hidden";
container.parentNode.insertBefore(loader, container);

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const smoothHideLoader = () => {
  requestAnimationFrame(() => {
    loader.style.opacity = "0";
    loader.addEventListener(
      "transitionend",
      () => {
        loader.classList.add("hidden");
        container.classList.remove("hidden");
      },
      { once: true }
    );
  });
};

const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });
  images.forEach((img) => observer.observe(img));
};

const showLoader = () => {
  loader.classList.remove("hidden");
  container.classList.add("hidden");
  loader.style.animationDuration = `${(Math.random() * 1.5 + 0.5).toFixed(2)}s`;
};

const hideLoader = () => {
  loader.classList.add("hidden");
  container.classList.remove("hidden");
};

const displayContent = async (fetchPromise, displayFunction) => {
  try {
    showLoader();
    const data = await fetchPromise;
    if (data) {
      displayFunction(data);
      container.dataset.loaded = "true";
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    hideLoader();
  }
};

const getRandomMeals = async () => {
  try {
    showLoader();
    const data = await memoizedFetchData(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    if (data && data.meals) {
      displayData(data.meals);
      container.dataset.loaded = "true";
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    hideLoader();
  }
};

const getCategory = () =>
  displayContent(
    fetchData("https://www.themealdb.com/api/json/v1/1/categories.php").then(
      (data) => data.categories
    ),
    displayCategory
  );

const getArea = () =>
  displayContent(
    fetchData("https://www.themealdb.com/api/json/v1/1/list.php?a=list").then(
      (data) => data.meals
    ),
    displayArea
  );

const getIngredients = () =>
  displayContent(
    fetchData("https://www.themealdb.com/api/json/v1/1/list.php?i=list").then(
      (data) => data.meals
    ),
    displayIngredients
  );

const displayData = (meals) => {
  const fragment = document.createDocumentFragment();
  meals.forEach((meal) => {
    const card = new MainCard(meal);
    fragment.appendChild(card.renderElement());
  });
  container.innerHTML = '';
  container.appendChild(fragment);

  const searchByName = document.getElementById('searchByName');
  const searchByFLetter = document.getElementById('searchByFLetter');
  if (searchByName) searchByName.value = '';
  if (searchByFLetter) searchByFLetter.value = '';
};

const displayCategory = (categories) => {
  container.innerHTML = categories
    .map((category) => new Category(category).render())
    .join("");
};

const displayArea = (areas) => {
  container.innerHTML = areas
    .map((area) => new AreaCard(area).render())
    .join("");
};

const displayIngredients = (ingredients) => {
  container.innerHTML = ingredients
    .map((ingredient) => new CardIngredients(ingredient).render())
    .join("");
};

const displayMealDetails = async (idMeal) => {
  await displayContent(
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    ).then((data) => data.meals?.[0]),
    (meal) => {
      if (meal) container.innerHTML = new MainCardDetails(meal).render();
    }
  );
};

const displayCategoryDetails = async (strCategory) => {
  await displayContent(
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`
    ).then((data) => data.meals),
    (meals) => {
      if (meals)
        container.innerHTML = meals
          .map((meal) => new CategoryMeals(meal).render())
          .join("");
    }
  );
};

const displayCategoryMealDetails = async (idMeal) => {
  await displayContent(
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    ).then((data) => data.meals?.[0]),
    (meal) => {
      if (meal) container.innerHTML = new MainCardDetails(meal).render();
    }
  );
};

const displayAreaDetails = async (strArea) => {
  await displayContent(
    fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${strArea}`
    ).then((data) => data.meals),
    (meals) => {
      if (meals)
        container.innerHTML = meals
          .map((meal) => new CategoryMeals(meal).render())
          .join("");
    }
  );
};

const displayIngredientsDetails = async (strIngredient) => {
  try {
    showLoader();
    const data = await fetchData(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${strIngredient}`
    );
    if (data && data.meals) {
      container.innerHTML = data.meals
        .map((meal) => new CategoryMeals(meal).render())
        .join("");
      container.dataset.loaded = "true";
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    hideLoader();
  }
};

const handleCardClick = async (event) => {
  const target = event.target.closest("a[data-id]");
  if (!target) return;

  event.preventDefault();
  const { id, type } = target.dataset;

  const actions = {
    category: () =>
      displayCategoryDetails(target.querySelector("p").textContent.trim()),
    area: () => displayAreaDetails(id),
    ingredient: () => displayIngredientsDetails(id),
    default: () => displayMealDetails(id),
  };

  await (actions[type] || actions.default)();
};

document.body.addEventListener("click", handleCardClick, { passive: false });

const buttonActions = {
  loadCategories: getCategory,
  loadAreas: getArea,
  loadIngredients: getIngredients,
};

Object.entries(buttonActions).forEach(([id, action]) => {
  document.getElementById(id).addEventListener("click", action);
});

document.addEventListener("DOMContentLoaded", function () {
  const contactLink = document.getElementById("contact");
  if (contactLink) {
    contactLink.addEventListener("click", function (event) {
      event.preventDefault();
      const contact = new Contact();
      contact.display();
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const searchNav = document.getElementById('searchNav');
  const contentContainer = document.getElementById('content');
  let search;

  searchNav.addEventListener('click', function(event) {
    event.preventDefault();
    if (!search) {
      search = new Search({});
    }
    contentContainer.innerHTML = ''; 
    search.mount(contentContainer);
  });

});

getRandomMeals();
