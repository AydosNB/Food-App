const MealsCard = (item) => {
    
     return  `
      <div class="meals-card group cursor-pointer">
      <div>
        <div class="rounded-md overflow-hidden">
          <img class="w-full h-[250px] duration-300 object-cover group-hover:scale-125" src=${item.strMealThumb}
            alt="">
        </div>
        <h3 class="text-[20px] font-semibold mt-[10px]">${item.strMeal}</h3>
      </div>
      <div>
        <hr class="my-[20px]">
        <div class="flex justify-end items-center">
          <button data-mealid = ${item.idMeal}
            class="add-btn-basket py-[7px] px-[15px] bg-orange-400 flex justify-center items-center text-gray-800 font-bold rounded-md shadow-sm hover:bg-orange-300 active:scale-95">
            <box-icon type='solid' name='cart-alt'></box-icon>
            <span>Add basket</span>
          </button>
        </div>
      </div>
      </div>
    `
    
}

export default MealsCard