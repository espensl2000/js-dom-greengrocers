const cartItemTemplate = document.createElement('template')
cartItemTemplate.innerHTML = `
  <li>
    <img
      class="cart--item-icon"
      src="assets/icons/001-beetroot.svg"
      alt="beetroot"
    />
    <p>beetroot</p>
    <button class="quantity-btn remove-btn center">-</button>
    <span class="quantity-text center">1</span>
    <button class="quantity-btn add-btn center">+</button>
  </li>
`

const state = {
  items: [
    {
      id: "001-beetroot",
      name: "beetroot",
      price: 0.38,
      type: "vegetable"
    },
    {
      id: "002-carrot",
      name: "carrot",
      price: 0.10,
      type: "vegetable"
    },
    {
      id: "003-apple",
      name: "apple",
      price: 0.35,
      type: "fruit"
    },
    {
      id: "004-apricot",
      name: "apricot",
      price: 0.25,
      type: "fruit"
    },
    {
      id: "005-avocado",
      name: "avocado",
      price: 0.60,
      type: "fruit"
    },
    {
      id: "006-bananas",
      name: "bananas",
      price: 0.35,
      type: "fruit"
    },
    {
      id: "007-bell-pepper",
      name: "bell pepper",
      price: 0.50,
      type: "vegetable"
    },
    {
      id: "008-berry",
      name: "berry",
      price: 0.35,
      type: "fruit"
    },
    {
      id: "009-blueberry",
      name: "blueberry",
      price: 0.75,
      type: "fruit"
    },
    {
      id: "010-eggplant",
      name: "eggplant",
      price: 0.35,
      type: "vegetable"
    }
  ],
  cart: [],
  filter: [],
  sortingOptions: [
    {
      name: 'price ascending',
      predicate: ((a, b) => a.price - b.price)
    },
    {
      name: 'price descending',
      predicate: ((a, b) => b.price - a.price)
    },
    {
      name: 'alphabetically ascending',
      predicate: ((a, b) => a.name.localeCompare(b.name))
    },
    {
      name: 'alphabetically descending',
      predicate: ((a, b) => b.name.localeCompare(a.name))
    }
  ]
};


function drawFilterOptions(){
  // Query for filter button wrapper
  let filterWrapper = document.querySelector('.store-filterbtn-wrapper')

  let filterOptions = []
  // Iterates over each item in the store item list, and adds a unique value for each type in the filteroptions
  state.items.forEach((i) => {
    if(!filterOptions.includes(i.type)){
      filterOptions.push(i.type)

      // Creates checkbox for each option
      let filterbtn = document.createElement('input')
      filterbtn.innerText = i.type
      filterbtn.type = 'checkbox'

      // Creates label for each option
      let filterlabel = document.createElement('label')
      filterlabel.innerText = i.type

      // Adds eventlistener, listening to changes for each checkbox
      filterbtn.addEventListener('change', () => {
        // Adds or removes filter from filter state depending on if box is checked or not
        if(event.target.checked){
          state.filter.push(i.type)
        } else {
          state.filter.splice(state.filter.indexOf(i.type), 1)

        }
        // Finally, draws store item list, so it can render with the updated filter
        drawStoreItemList()

      })

      // Appends button and label to parent div
      filterWrapper.appendChild(filterbtn)
      filterWrapper.appendChild(filterlabel)

    }
  })
}
drawFilterOptions()

function drawSortOptions(){
  let sortOptions = document.querySelector('.store-sortbtn-wrapper')

  state.sortingOptions.forEach((p) => {
    let option = document.createElement('button')
    option.innerText = p.name
    option.addEventListener('click', () => {
      Sort(p.predicate)
    })
    sortOptions.appendChild(option)
  })

}

drawSortOptions()

function drawStoreItemList(){
  // Query for storeitemlist UL
  let itemlist = document.querySelector('.item-list.store--item-list');

  itemlist.innerHTML = ""
  // Check for filter
  let items = []
  if(state.filter.length > 0){
    items = state.items.filter((i) => state.filter.includes(i.type))
  } else {
    items = state.items
  }

  // Iterate state item list and creating li for each
  items.forEach((i) => {
    let li = document.createElement('li')

    let div = document.createElement('div')
    div.className='store--item-icon'
    div.appendChild(document.createElement('img'))
    let img = div.querySelector('img')
    img.src = `assets/icons/${i.id}.svg` 

    li.appendChild(div)

    let name = document.createElement('p')
    name.innerText = i.name + " " + i.price

    li.appendChild(name)
    
    let button = document.createElement('button')
    button.innerText = 'Add to cart'
    button.addEventListener('click', () => {
      AddToCart(i)
    })
    li.appendChild(button)
    
    
    itemlist.appendChild(li)

  })
}
drawStoreItemList()

function drawCartItemList(){
  // Query for storeitemlist UL
  let ul = document.querySelector('.item-list.cart--item-list')

  // Clear preexisting html
  ul.innerHTML = ""

  // If cart.length > 0, iterate through and create elements for each
  if(state.cart.length > 0){

    state.cart.forEach((item) => {
      // Create a copy of the template
      let cartItemList = cartItemTemplate.content.cloneNode(true)

      // Set image of item
      let img = cartItemList.querySelector('img')
      img.src = `assets/icons/${item.item.id}.svg` 

      // Set name of item
      let p = cartItemList.querySelector('p')
      p.innerText = item.item.name

      // Find and activate eventlistener to decreasebtn
      let decreaseBtn = cartItemList.querySelector('.remove-btn')
      decreaseBtn.addEventListener('click', () => {
        RemoveFromCart(item)
      })

      // Find and update count per item type
      let count = cartItemList.querySelector('.quantity-text')
      count.innerText = item.amount

      // Find and activate eventlistener to increasebtn
      let increaseBtn = cartItemList.querySelector('.add-btn')
      increaseBtn.addEventListener('click', () => {
        AddToCart(item.item)
      })

      // Append the template with the updated data
      ul.appendChild(cartItemList)
    })

    
  } 
  // Checks sum cost of items
  let checkSum = document.querySelector('.total-number')
  checkSum.innerHTML = "£" + CheckSum().toFixed(2);

}


function CheckSum(){
  let total = 0
  state.cart.forEach((i) => {
    total += i.item.price * i.amount
  })
  return total
}

function AddToCart(cartItem){
  if(state.cart.some((i) => i.item.id == cartItem.id)){
    let item = state.cart.find((i) => i.item.name == cartItem.name)
    item.amount++;
  } else {
    state.cart.push({
      item: cartItem,
      amount: 1
    })
  }
  drawCartItemList()
}

function RemoveFromCart(item){
  if(item.amount > 1){
    item.amount--;
  } else {
    state.cart.splice(state.cart.indexOf(item), 1)
  }
  drawCartItemList()
}

function Sort(predicate){
  state.items.sort(predicate);
  drawStoreItemList()
}
