import BasketCard from './src/components/BasketCard'
import MealsCard from './src/components/MealsCard'
import './style.css'
import "boxicons"

const contentWrapper = document.querySelector("#content-wrapper")
const linkProduct = document.querySelector("#link-product")
const linkBasket = document.querySelector("#link-basket")
const searchForm = document.querySelector("#search-form")
const basketCount = document.querySelector("#basket-count")


let mealsData = []

function renderCount() {
  const count = JSON.parse(localStorage.getItem("basket")) || []
  basketCount.textContent = count.length
}

renderCount()

function loadingContent(load) {
  contentWrapper.classList = ""
  if (load) {
    contentWrapper.innerHTML = `
  <div class="flex justify-center items-center gap-1 text-orange-400 font-bold h-[60vh]">
  <span class="flex justify-center items-center animate-spin">
    <box-icon name='loader-alt' color='#ffa000' ></box-icon>
  </span>
  <span>Loading...</span>
  </div>
  `
  } else {
    contentWrapper.innerHTML = `
    <div class="flex justify-center items-center gap-1 text-gray-400 font-bold h-[60vh]">
      <span class="flex justify-center items-center">
        <box-icon name='comment-dots' color='#b9b3aa' ></box-icon>
       </span>
  <span>Error</span>
  </div>
    `
  }
}

function setObserver() {
  const cards = document.querySelectorAll(".meals-card")
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(element => {
      if(element.isIntersecting) {
        element.target.classList.add("active-card")
      }
    })

  }, {
    threshold: 0.2
  })
  cards.forEach(card => {
    observer.observe(card)
  })
}



async function getAllMealsData(category) {
  loadingContent(true)
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)

    if (!res.ok) {
      throw new Error("Error: " + res.status)
    }
    const data = await res.json()
    loadProduct(data.meals)
    mealsData = [...data.meals]

  } catch (err) {
    console.log(err)
    loadingContent(false)
  }
}

getAllMealsData("Seafood")



function loadProduct(meals) {
  renderCount()
  contentWrapper.innerHTML = ""
  contentWrapper.classList = "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 container my-[20px]"
  meals.forEach(item => {
    contentWrapper.innerHTML += MealsCard(item)
  })
  const addBasketBtn = document.querySelectorAll(".add-btn-basket")
  addBasketBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      const basket = JSON.parse(localStorage.getItem("basket")) || []
      const newBasketItem = mealsData.find(item => item.idMeal == btn.dataset.mealid)
      if (!basket.find(item => item?.idMeal == btn.dataset.mealid)) {
        const finalData = [...basket, newBasketItem]
        localStorage.setItem("basket", JSON.stringify(finalData))
        finalData?.forEach(item => {
          if (item?.idMeal == btn.dataset.mealid) {
            renderCount()
            btn.classList = "active-basket"
            btn.classList.add("add-btn-basket")
            btn.innerHTML = `
               <box-icon name='cart-alt' type='solid' color='#ffa600' ></box-icon>
                <span>Go basket</span>
            `
          }
        })
      } else {
        loadBasket(JSON.parse(localStorage.getItem("basket")))
      }
    })

    JSON.parse(localStorage.getItem("basket"))?.forEach(item => {
      if (item?.idMeal == btn.dataset.mealid) {
        btn.classList = "active-basket"
        btn.classList.add("add-btn-basket")
        btn.innerHTML = `
           <box-icon name='cart-alt' type='solid' color='#ffa600' ></box-icon>
            <span>Go basket</span>
        `
      }
    })
  })
  linkProduct.classList.add("active")
  linkBasket.classList.remove("active")
  setObserver()
}

function loadBasket(basketData) {
  renderCount()
  contentWrapper.innerHTML = ""
  if (basketData.length > 0) {
    contentWrapper.classList = "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 container my-[20px]"
    basketData.forEach(item => {
      contentWrapper.innerHTML += BasketCard(item)
    })
  } else {
    contentWrapper.classList = ""
    contentWrapper.innerHTML = `<div class="flex justify-center items-center gap-1 text-[24px] text-gray-400 min-h-[60vh]">
      <box-icon name='message-alt-error' color='#b1aa9e' ></box-icon>
      <span>Basket is empty</span>
    </div>`
  }
  const deleteBtn = document.querySelectorAll(".delete-basket-btn")
  deleteBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      const btnId = btn.dataset.mealid
      const basketData = JSON.parse(localStorage.getItem("basket")) || []
      if (basketData.length > 0) {

        localStorage.setItem("basket", JSON.stringify(basketData.filter(item => item.idMeal !== btnId)))
      }
      loadBasket(JSON.parse(localStorage.getItem("basket")))
    })
  })
  linkBasket.classList.add("active")
  linkProduct.classList.remove("active")
  setObserver()
}

linkProduct.addEventListener("click", () => loadProduct(mealsData))
linkBasket.addEventListener("click", () => loadBasket(JSON.parse(localStorage.getItem("basket"))))

searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const value = e.target["search-input"].value.trim()
  if (value.length > 0) {
    getAllMealsData(value)
    searchForm.reset()
  } else {
    e.target["search-input"].focus()
  }
})