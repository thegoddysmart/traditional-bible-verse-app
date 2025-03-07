// DOM Elements
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.querySelector(".mobile-menu")
const themeToggle = document.getElementById("theme-toggle")
const favoritesContainer = document.getElementById("favorites-container")
const noFavorites = document.getElementById("no-favorites")
const favoritesList = document.getElementById("favorites-list")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toast-message")
const currentYear = document.getElementById("current-year")

// Set current year in footer
currentYear.textContent = new Date().getFullYear()

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active")
})

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme")

  // Save theme preference to localStorage
  const isDarkTheme = document.body.classList.contains("dark-theme")
  localStorage.setItem("darkTheme", isDarkTheme)
})

// Load saved theme preference
if (localStorage.getItem("darkTheme") === "true") {
  document.body.classList.add("dark-theme")
}

// Get favorites from localStorage
function getFavorites() {
  const favoritesJson = localStorage.getItem("favoriteVerses")
  return favoritesJson ? JSON.parse(favoritesJson) : []
}

// Remove a verse from favorites
function removeFavorite(verseId) {
  const favorites = getFavorites()
  const updatedFavorites = favorites.filter((fav) => fav.id !== verseId)
  localStorage.setItem("favoriteVerses", JSON.stringify(updatedFavorites))
  showToast("Removed from favorites")
  displayFavorites()
}

// Display favorites
function displayFavorites() {
  const favorites = getFavorites()

  if (favorites.length === 0) {
    noFavorites.style.display = "block"
    favoritesList.innerHTML = ""
    return
  }

  noFavorites.style.display = "none"
  favoritesList.innerHTML = ""

  favorites.forEach((verse) => {
    const favoriteCard = document.createElement("div")
    favoriteCard.className = "favorite-card"
    favoriteCard.innerHTML = `
      <p class="verse-text">"${verse.text}"</p>
      <p class="verse-reference">${verse.reference} <span>(${verse.translation})</span></p>
      <div class="verse-actions">
        <button class="btn btn-outline remove-btn" data-id="${verse.id}">
          <i class="fas fa-trash-alt"></i> Remove
        </button>
      </div>
    `

    favoritesList.appendChild(favoriteCard)
  })

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const verseId = e.currentTarget.dataset.id
      removeFavorite(verseId)
    })
  })
}

// Show toast message
function showToast(message) {
  toastMessage.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Load favorites on page load
document.addEventListener("DOMContentLoaded", () => {
  displayFavorites()
})

