//  <reference types="../@types/jquery"/>

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

class MainCard {
  constructor({ idMeal, strMeal, strMealThumb, strTags }) {
    Object.assign(this, { idMeal, strMeal, strMealThumb, strTags });
  }

  renderElement() {
    const a = document.createElement("a");
    a.className = "w-full md:w-1/4 bg-black p-3 card";
    a.dataset.id = this.idMeal;
    a.href = "#";

    const img = document.createElement("img");
    img.src = this.strMealThumb;
    img.alt = this.strTags ?? "";
    img.className = "w-full";

    const p = document.createElement("p");
    p.className = "text-white";
    p.textContent = this.strMeal;

    a.appendChild(img);
    a.appendChild(p);

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
      <div class="meal-details">
        <img src="${this.strMealThumb}" alt="${
      this.strMeal
    }" class="meal-thumb">
        <h2>${this.strMeal}</h2>
        <p><strong>Category:</strong> ${this.strCategory ?? "N/A"}</p>
        <p><strong>Area:</strong> ${this.strArea ?? "N/A"}</p>
        <p><strong>Tags:</strong> ${this.strTags ?? "N/A"}</p>
        <p><strong>Instructions:</strong> ${this.strInstructions ?? "N/A"}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredientsList}</ul>
        ${
          this.strYoutube
            ? `<p><strong>Video:</strong> <a href="${this.strYoutube}" target="_blank">Watch on YouTube</a></p>`
            : ""
        }
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
      <a class="w-full md:w-1/4 bg-black p-3 card" data-id="${this.idCategory}" data-type="category" href="#">
        <img src="${this.strCategoryThumb}" alt="${this.strCategory}" class="w-full">
        <p class='text-white'>${this.strCategory}</p>
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
      <a class="w-full md:w-1/4 bg-black p-3 card" data-id="${
        this.idMeal
      }" href="#">
        <img src="${this.strMealThumb}" alt="${
      this.strMeal ?? ""
    }" class="w-full">
        <p class='text-white'>${this.strMeal}</p>
      </a>
    `;
  }
}

class AreaCard {
  constructor({ strArea }) {
    this.strArea = strArea;
  }
  render() {
    return `
        <a class="w-full md:w-1/4 bg-black p-3 card" data-id="${this.strArea}" data-type="area" href="#">
        <p class='text-white'>${this.strArea}</p>
        <i class="fa-solid fa-house"></i>
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
  <a class="w-full md:w-1/4 bg-black p-3 card" data-id="${this.strIngredient}" data-type="ingredient" href="#">
  <h1 class='text-white'>${this.strIngredient}</h1>
  <i class="fa-solid fa-house"></i>
</a>
    `;
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
  container.innerHTML = "";
  container.appendChild(fragment);
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

// document.body.addEventListener(
//   "click",
//   async (event) => {
//     const target = event.target.closest("a[data-id]");
//     if (!target) return;

//     event.preventDefault();
//     const { id, type } = target.dataset;

//     switch (type) {
//       case "category":
//         await displayCategoryDetails(
//           target.querySelector("p").textContent.trim()
//         );
//         break;
//       case "area":
//         await displayAreaDetails(id);
//         break;
//       case "ingredient":
//         await displayIngredientsDetails(id);
//         break;
//       default:
//         await displayMealDetails(id);
//     }
//   },
//   { passive: false }
// );
// document
//   .getElementById("loadCategories")
//   .addEventListener("click", getCategory);

// document.getElementById("loadAreas").addEventListener("click", getArea);
// document
//   .getElementById("loadIngredients")
//   .addEventListener("click", getIngredients);

// getRandomMeals();

const handleCardClick = async (event) => {
  const target = event.target.closest("a[data-id]");
  if (!target) return;

  event.preventDefault();
  const { id, type } = target.dataset;

  const actions = {
    category: () => displayCategoryDetails(target.querySelector("p").textContent.trim()),
    area: () => displayAreaDetails(id),
    ingredient: () => displayIngredientsDetails(id),
    default: () => displayMealDetails(id)
  };

  await (actions[type] || actions.default)();
};

document.body.addEventListener("click", handleCardClick, { passive: false });

// Optimize button event listeners
const buttonActions = {
  loadCategories: getCategory,
  loadAreas: getArea,
  loadIngredients: getIngredients
};

Object.entries(buttonActions).forEach(([id, action]) => {
  document.getElementById(id).addEventListener("click", action);
});

// Initialize
getRandomMeals();