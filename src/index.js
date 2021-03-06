let addToy = false;
let toyCollection = document.querySelector('#toy-collection')

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      // added event listener to form so that it would post new toy 
      toyFormContainer.addEventListener('submit', (event)=>{
      event.preventDefault()
      postToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// grabbing data from db.json and render onto page
fetch("http://localhost:3000/toys")
.then(response => response.json())
.then ((toyArray) => {
  toyArray.forEach(toy =>{
    renderToys(toy)
  })
})

// post request for information typed into form and then renders onto page
function postToy(data){
  const toyName = data.name.value
  const imgUrl = data.image.value
  
  fetch("http://localhost:3000/toys", {
    method: 'POST', 
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": toyName,
      "image": imgUrl,
      "likes": 0
    })
  })
    .then(response => response.json())
    .then((toyObj) => {
      let newToy = renderToys(toyObj)
      toyCollection.append(newToy)
    })
}

// patch request for likes 
function likeToy(event) {
  event.preventDefault()
  let moreLikes = parseInt(event.target.previousElementSibling.innerText) + 1
           
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: 'PATCH', 
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({"likes": moreLikes })
  })
    .then(response => response.json())
    .then((likeObj => {
      event.target.previousElementSibling.innerText = `${moreLikes} likes`;
    }))
}

// renders toys onto screen
function renderToys(toy) {
  const div = document.createElement("div")
  div.classList.add("card")
  div.dataset.id = toy.id
  
  let h2 = document.createElement('h2')
  h2.innerText = toy.name
  
  let img = document.createElement('img')
  img.src = toy.image
  img.alt = `${toy.name}`
  img.classList.add("toy-avatar")

  let p = document.createElement('p')
  p.innerText = `${toy.likes} Likes`

  let button = document.createElement("button")
  button.setAttribute('class', 'like-btn')
  button.innerText = "Like"
  button.setAttribute('id', toy.id)
  button.addEventListener('click', function(event) {
    // console.log(event.target.dataset);
    likeToy(event)
  })
  div.append(h2, img, p, button)
  toyCollection.append(div)
}
