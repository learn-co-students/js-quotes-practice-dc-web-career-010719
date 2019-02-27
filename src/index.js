// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
sorted = false

document.addEventListener('DOMContentLoaded', init)

function init() {
  renderQuotes()
  document.getElementById('new-quote-form').addEventListener('submit', addQuote)
  document.getElementById('sort-button').addEventListener('click', ()=>{
    sorted = !sorted
    renderQuotes(sorted)
  })
}

function renderQuotes(sorted=false) {
  if (sorted) {
    document.getElementById('quote-list').innerHTML = ''
    fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(json => {
      // debugger
      json.sort((a, b) => a.author.localeCompare(b.author)).forEach(renderQuote)
    })
  } else {
    document.getElementById('quote-list').innerHTML = ''
    fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(json => json.forEach(renderQuote))
  }
}

function sortAuthors(json) {
  return json.sort((a, b) => a.author.localeCompare(b.author))
}

function renderQuote(quote) {
  let quoteList = document.getElementById('quote-list')

  let li = document.createElement('li')
  quoteList.appendChild(li)
  li.id = `quote-${quote.id}`
  li.classList.add('quote-card')

  let bq = document.createElement('blockquote')
  li.appendChild(bq)
  bq.classList.add('blockquote')

  let p = document.createElement('p')
  bq.appendChild(p)
  p.classList.add('mb-0')
  p.innerText = quote.quote

  let footer = document.createElement('footer')
  bq.appendChild(footer)
  footer.classList.add('blockquote-footer')
  footer.innerText = quote.author

  let likeBtn = document.createElement('button')
  bq.appendChild(likeBtn)
  likeBtn.classList.add('btn-success')
  likeBtn.innerHTML = `Likes: <span>${quote.likes}</span>`

  let delBtn = document.createElement('button')
  bq.appendChild(delBtn)
  delBtn.classList.add('btn-danger')
  delBtn.innerText = 'Delete'

  let editBtn = document.createElement('button')
  bq.appendChild(editBtn)
  editBtn.classList.add('btn-edit')
  editBtn.innerText = 'Edit'

  likeBtn.addEventListener('click', () => {
    likeQuote(quote)
  })

  delBtn.addEventListener('click', () => {
    deleteQuote(quoteList, quote)
  })

  editBtn.addEventListener('click', () => {
    drawEditForm(li)
  })

}

function addQuote(e) {
  e.preventDefault()
  let data = {
    quote: e.target.children[0].children[1].value,
    likes: 0,
    author: e.target.children[1].children[1].value
  }
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(quote => renderQuote(quote))
}

function deleteQuote(quoteList, quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'DELETE'
  })
  quoteList.removeChild(document.getElementById(`quote-${quote.id}`))
}

function likeQuote(quote) {
  let newLikes = quote.likes + 1
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({likes: newLikes})
  })
  // document.querySelector(`#quote-${quote.id}`).firstChild.children[2].children[0].innerText = `${newLikes}`
  // renderQuotes()
  setTimeout(renderQuotes, 75)
}

function drawEditForm(parent) {
  //takes an li element as a parent and renders the form under that element
  let id = parent.id.split('-')[1]
  let form = document.createElement('form')
  parent.appendChild(form)
  form.innerHTML =
  `
  <input type="text" id="edit-quote" value="${parent.firstElementChild.firstElementChild.innerText}"><br>
  <input type="text" id="edit-author" value="${parent.firstElementChild.children[1].innerText}"><br>
  <input type="hidden" value="${id}">
  <button type="submit" id="submit-edit-btn" class="btn btn-edit">Submit Edit</button>
  `
  document.querySelector('#submit-edit-btn').addEventListener('click', editQuote)
}

function editQuote(e) {
  e.preventDefault()
  let data = {
    quote: e.target.parentElement.children[0].value,
    author: e.target.parentElement.children[2].value
  }
  fetch(`http://localhost:3000/quotes/${e.target.parentElement.children[4].value}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  })
  setTimeout(renderQuotes, 75)
}










//
