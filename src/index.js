document.addEventListener("DOMContentLoaded", () => {init()})

function init(){
  const form = document.querySelector("#new-quote-form")
  getQuotes()
  
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    newQuote(form)
  })
}

function getQuotes(){
  fetch("http://localhost:3000/quotes")
  .then(res => res.json())
  .then(json => {
    json.forEach(quote => displayQuote(quote))
  })
}

function displayQuote(q){
  const quoteList = document.querySelector("#quote-list")
  const li = document.createElement("li")
  const blockQuote = document.createElement("blockquote")
  const p = document.createElement("p")
  const footer = document.createElement("footer")
  const br = document.createElement("br")
  const btnLike = document.createElement("button")
  const span = document.createElement("span")
  const btnDel = document.createElement("button")
  const btnEdit = document.createElement("button")
  
  li.className = 'quote-card'
  blockQuote.className = 'blockquote'
  p.className = 'mb-0'
  p.innerText = q.quote
  p.id = `${q.id} - quote`
  footer.className = "blockquote-footer"
  footer.innerText = q.author
  footer.id = `${q.id} - author`
  btnLike.className = 'btn-success'
  btnLike.innerText = "Likes: "
  span.innerText = q.likes
  btnDel.className = 'btn-danger'
  btnDel.innerText = "Delete"
  btnEdit.innerText = "Edit"
  btnEdit.className = 'btn-secondary'
  
  li.appendChild(blockQuote)
  btnLike.appendChild(span)
  blockQuote.append(p, footer, br, btnLike, btnDel, btnEdit)
  quoteList.appendChild(li)
  createEditForm(q, li)
  
  btnLike.addEventListener("click", () => {likeQuote(q, span)})
  btnDel.addEventListener("click", () => {deleteQuote(q, li)})
  btnEdit.addEventListener("click", (e) => displayEditForm(e))
  
}

function likeQuote(q, span){
  const id = q.id
  const newLike = ++q.likes
  
  span.innerText = newLike
  
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({likes: newLike})
  })
  .then(res => res.json())
  .then(console.log)

}

function newQuote(form){
  const data = {author: form.author.value, quote: form.quote.value, likes: 0} 
  
  fetch(`http://localhost:3000/quotes/`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(quote => displayQuote(quote))
  .then(form.reset())
}

function deleteQuote(q, li){
  const quoteList = document.querySelector("#quote-list")
  const id = q.id
  
  fetch(`http://localhost:3000/quotes/${id}`,{
    method: "DELETE",
    })
  .then(res => res.json())
  .then(quoteList.removeChild(li))
}

function displayEditForm(e){
  const form = e.target.parentElement.parentElement.lastElementChild
  
  if (form.dataset.active === "true"){
    form.style.display = "block"
    form.dataset.active = "false"
  } else {
    form.style.display = "block"
    form.dataset.active = "true"
  }
}

function createEditForm(q, li){
  
  const form = document.createElement("form")
  const hr = document.createElement("hr")
  const aLabel = document.createElement("label")
  const author = document.createElement("INPUT")
  const qLabel = document.createElement("label")
  const quote = document.createElement("INPUT")
  const br = document.createElement("br")
  const submit = document.createElement("submit")
  
  author.className = "form-control"
  author.name = "author"
  author.value = q.author
  quote.className = "form-control"
  quote.name = "quote"
  quote.value = q.quote
  form.dataset.active = "false"

  aLabel.innerText = "Author: "
  qLabel.innerText = "Quote: "
  submit.classList ="btn btn-primary"
  submit.innerText = "Edit"
  
//  debugger
  form.append(aLabel, author, qLabel, quote, br, submit)
  li.append(hr, form)
  
  submit.addEventListener("click", (e) => {
    editQuote(q, form, li)
  })
//  debugger
  form.style.display = "none"
}

function editQuote(q, form, li){
  
  const id = q.id
  const data = {author: form.author.value, quote: form.quote.value}
  
  document.getElementById(`${q.id} - author`).innerText = form.author.value
  document.getElementById(`${q.id} - quote`).innerText = form.quote.value
  
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    headers: {
      'Application': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(console.log)
  .then(form.style.display = "none")
}




















