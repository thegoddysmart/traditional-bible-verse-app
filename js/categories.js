// DOM Elements
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.querySelector(".mobile-menu")
const themeToggle = document.getElementById("theme-toggle")
const categoryButtons = document.querySelectorAll(".category-btn")
const verseLoader = document.getElementById("verse-loader")
const verseContent = document.getElementById("verse-content")
const verseText = document.getElementById("verse-text")
const verseReference = document.getElementById("verse-reference")
const newVerseBtn = document.getElementById("new-verse-btn")
const shareBtn = document.getElementById("share-btn")
const favoriteBtn = document.getElementById("favorite-btn")
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

// Bible verses data
const verses = [
  {
    id: "1",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    reference: "John 3:16",
    translation: "ESV",
    category: "love",
  },
  {
    id: "2",
    text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    reference: "Proverbs 3:5-6",
    translation: "ESV",
    category: "faith",
  },
  {
    id: "3",
    text: "I can do all things through him who strengthens me.",
    reference: "Philippians 4:13",
    translation: "ESV",
    category: "strength",
  },
  {
    id: "4",
    text: "The fear of the LORD is the beginning of wisdom, and the knowledge of the Holy One is insight.",
    reference: "Proverbs 9:10",
    translation: "ESV",
    category: "wisdom",
  },
  {
    id: "5",
    text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
    translation: "ESV",
    category: "hope",
  },
  {
    id: "6",
    text: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    reference: "Isaiah 40:31",
    translation: "ESV",
    category: "strength",
  },
  {
    id: "7",
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    reference: "Romans 8:28",
    translation: "ESV",
    category: "faith",
  },
  {
    id: "8",
    text: "A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another.",
    reference: "John 13:34",
    translation: "ESV",
    category: "love",
  },
  {
    id: "9",
    text: "If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.",
    reference: "James 1:5",
    translation: "ESV",
    category: "wisdom",
  },
  {
    id: "10",
    text: "May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.",
    reference: "Romans 15:13",
    translation: "ESV",
    category: "hope",
  },
]

// Current verse and category
let currentVerse = null
let currentCategory = "faith" // Default category

// Load a verse by category
function loadVerseByCategory(category) {
  showLoader()

  // Simulate API delay
  setTimeout(() => {
    let filteredVerses = verses.filter((verse) => verse.category === category)

    // If no verses match the category, fall back to all verses
    if (filteredVerses.length === 0) {
      filteredVerses = verses
    }

    // Get a random verse
    const randomIndex = Math.floor(Math.random() * filteredVerses.length)
    currentVerse = filteredVerses[randomIndex]

    // Update UI
    verseText.textContent = `"${currentVerse.text}"`
    verseReference.textContent = `${currentVerse.reference} (${currentVerse.translation})`

    // Check if verse is in favorites
    updateFavoriteButton()

    hideLoader()
  }, 1000)
}

// Show loader
function showLoader() {
  verseLoader.classList.remove("hidden")
  verseContent.classList.add("hidden")
}

// Hide loader
function hideLoader() {
  verseLoader.classList.add("hidden")
  verseContent.classList.remove("hidden")
}

// Update favorite button state
function updateFavoriteButton() {
  const favorites = getFavorites()
  const isFavorite = favorites.some((fav) => fav.id === currentVerse.id)

  if (isFavorite) {
    favoriteBtn.classList.add("favorite")
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Saved'
  } else {
    favoriteBtn.classList.remove("favorite")
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i> Save'
  }
}

// Get favorites from localStorage
function getFavorites() {
  const favoritesJson = localStorage.getItem("favoriteVerses")
  return favoritesJson ? JSON.parse(favoritesJson) : []
}

// Toggle favorite status
function toggleFavorite() {
  if (!currentVerse) return

  const favorites = getFavorites()
  const isFavorite = favorites.some((fav) => fav.id === currentVerse.id)

  if (isFavorite) {
    // Remove from favorites
    const updatedFavorites = favorites.filter((fav) => fav.id !== currentVerse.id)
    localStorage.setItem("favoriteVerses", JSON.stringify(updatedFavorites))
    showToast("Removed from favorites")
  } else {
    // Add to favorites
    const updatedFavorites = [...favorites, currentVerse]
    localStorage.setItem("favoriteVerses", JSON.stringify(updatedFavorites))
    showToast("Added to favorites")
  }

  updateFavoriteButton()
}

// Share verse
function shareVerse() {
  if (!currentVerse) return

  const shareText = `"${currentVerse.text}" - ${currentVerse.reference} (${currentVerse.translation})`

  if (navigator.share) {
    navigator
      .share({
        title: "Bible Verse of the Day",
        text: shareText,
        url: window.location.href,
      })
      .catch((error) => {
        console.error("Error sharing:", error)
        copyToClipboard(shareText)
      })
  } else {
    copyToClipboard(shareText)
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Copied to clipboard")
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err)
      showToast("Failed to copy text")
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

// Set active category
function setActiveCategory(category) {
  currentCategory = category

  // Update UI
  categoryButtons.forEach((btn) => {
    if (btn.dataset.category === category) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })

  // Load verse for the selected category
  loadVerseByCategory(category)
}

// Event listeners
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category
    setActiveCategory(category)
  })
})

newVerseBtn.addEventListener("click", () => loadVerseByCategory(currentCategory))
shareBtn.addEventListener("click", shareVerse)
favoriteBtn.addEventListener("click", toggleFavorite)

// Load verse on page load
document.addEventListener("DOMContentLoaded", () => {
  setActiveCategory("faith")
})

