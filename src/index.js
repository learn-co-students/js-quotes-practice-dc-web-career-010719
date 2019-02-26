// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
let quoteList
let form
let div
let form1
let input
let label
let toggle

document.addEventListener("DOMContentLoaded", init)

function init() {
  quoteList = document.querySelector("#quote-list")
  getAllCodes()

  form = document.querySelector("#new-quote-form")
  form.addEventListener('submit', handleSubmitOfForm)

  div = document.createElement('div')
  document.querySelector('.container').appendChild(div)
  form1 = document.createElement('form')
  div.appendChild(form1)
  input = document.createElement('input')
  input.id = 'sort'
  input.placeholder = 'Enter Author name...'
  label = document.createElement('label')
  label.for = 'sort'
  label.innerText = 'Sort Quotes By Author Name: '
  form1.appendChild(label)
  form1.appendChild(input)
  toggle = document.createElement('input')
  form1.appendChild(toggle)
  toggle.id = 'toggle'
  toggle.type = 'submit'
  toggle.value = 'Sort!'
  form1.addEventListener('submit', handleClickOfSort)
}

function getAllCodes() {
  fetch(`http://localhost:3000/quotes`)
  .then(res => res.json())
  .then(allCodesData => {
    allCodesData.forEach(renderQuote)
  })
}

function renderQuote(quoteObj) {
  let li = document.createElement('li')
  quoteList.appendChild(li)
  li.classList.add('quote-card')
  li.id = "quote-" + quoteObj.id

  let blockQuote = document.createElement('blockquote')
  li.appendChild(blockQuote)
  blockQuote.id = 'block-' + quoteObj.id
  blockQuote.classList.add("blockquote")

  let p = document.createElement('p')
  blockQuote.appendChild(p)
  p.classList.add('mb-0')
  p.id = 'p-' + quoteObj.id
  p.innerText = quoteObj.quote

  let footer = document.createElement('footer')
  blockQuote.appendChild(footer)
  footer.classList.add('blockquote-footer')
  footer.id = "footer-" + quoteObj.id
  footer.innerText = quoteObj.author

  let br = document.createElement('br')
  blockQuote.appendChild(br)

  let likeButton = document.createElement('button')
  blockQuote.appendChild(likeButton)
  likeButton.classList.add("btn-success")
  likeButton.innerHTML = `Likes: <span>${quoteObj.likes}</span>`
  likeButton.dataset.id = quoteObj.id
  likeButton.id = 'like-button-' + quoteObj.id
  likeButton.addEventListener('click', handleClickOfLikeButton)

  let deleteButton = document.createElement('button')
  blockQuote.appendChild(deleteButton)
  deleteButton.classList.add("btn-danger")
  deleteButton.innerText = "Delete"
  deleteButton.dataset.id = quoteObj.id
  deleteButton.addEventListener('click', handleClickOfDeleteButton)

  let editButton = document.createElement('button')
  blockQuote.appendChild(editButton)
  editButton.classList.add("btn-success")
  editButton.innerText = "Show Edit"
  editButton.id = 'edit-button-' + quoteObj.id
  editButton.dataset.id = quoteObj.id
  editButton.addEventListener('click', handleClickOfEditButton)
}

function handleSubmitOfForm(event) {
  event.preventDefault()
  postNewQuote()
}

function postNewQuote() {
  let postData = {
    quote: document.querySelector('#new-quote').value,
    author: document.querySelector("#author").value,
    likes: 0
  }
  document.querySelector('#new-quote').value = ''
  document.querySelector("#author").value = ''
  fetch(`http://localhost:3000/quotes`, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(res => res.json())
  .then(newQuoteObj => {
    renderQuote(newQuoteObj)
  })
}

function handleClickOfDeleteButton(event) {
  let id = event.currentTarget.dataset.id
  deleteQuote(id)
}

function deleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "DELETE"
  }).then(res => res.json())
    .then(() => {
      document.querySelector(`#quote-${id}`).remove()
    })
}

function handleClickOfLikeButton(event) {
  let id = event.currentTarget.dataset.id
  increaseLikes(id)
}

function increaseLikes(id) {
  let patchData = {
    likes: parseInt(document.querySelector(`#like-button-${id}`).innerText.split(" ")[1]) + 1
  }
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchData),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(res => res.json())
    .then(patchedQuoteObj => {
      document.querySelector(`#like-button-${id}`).innerHTML = `Likes: <span>${patchedQuoteObj.likes}</span>`
    })
}

function handleClickOfEditButton(event) {
  let id = event.currentTarget.dataset.id
  if (event.currentTarget.innerText === 'Show Edit') {
    fetch(`http://localhost:3000/quotes/${id}`)
    .then(res => res.json())
    .then(quoteObj => {
      editQuote(quoteObj)
    })
    event.currentTarget.innerText = 'Hide Edit'
  } else {
    event.currentTarget.innerText = 'Show Edit'
    document.querySelector(`#block-${id}`).removeChild(document.querySelector(`#edit-${id}`))
  }
}

function editQuote(quoteObj) {
  let editForm = document.createElement('form')
  editForm.dataset.id = quoteObj.id
  editForm.id = "edit-" + quoteObj.id
  document.querySelector(`#block-${quoteObj.id}`).appendChild(editForm)

  let quoteLabel = document.createElement('label')
  editForm.appendChild(quoteLabel)
  quoteLabel.for = "quote-input"
  quoteLabel.innerText = "Edit Quote"

  let quote = document.createElement('input')
  editForm.appendChild(quote)
  quote.id = "quote-input"
  quote.type = "text"
  quote.classList.add("form-control")
  quote.placeholder = quoteObj.quote

  let authorLabel = document.createElement('label')
  editForm.appendChild(authorLabel)
  authorLabel.for = "author-input"
  authorLabel.innerText = "Edit Author"

  let author = document.createElement('input')
  editForm.appendChild(author)
  author.id = "author-input"
  author.type = "text"
  author.classList.add("form-control")
  author.placeholder = quoteObj.author

  let submit = document.createElement('input')
  editForm.appendChild(submit)
  submit.type = "submit"
  submit.classList.add("btn")
  submit.classList.add("btn-primary")

  editForm.addEventListener('submit', handleSubmitOfEditForm)
}

function handleSubmitOfEditForm(event) {
  event.preventDefault()
  let id = event.currentTarget.dataset.id
  patchQuote(id)
}

function patchQuote(id) {
  let patchData = {
    quote: document.querySelector('#quote-input').value,
    author: document.querySelector('#author-input').value
  }
  document.querySelector(`#block-${id}`).removeChild(document.querySelector(`#edit-${id}`))
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patchData),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(res => res.json())
    .then(patchedQuoteObj => {
      document.querySelector(`#p-${id}`).innerText = patchedQuoteObj.quote
      document.querySelector(`#footer-${id}`).innerText = patchedQuoteObj.author
      document.querySelector(`#edit-button-${id}`).innerText = "Show Edit"
    })
}

function handleClickOfSort(event) {
  event.preventDefault()
  if (document.querySelector("#toggle").value === 'Sort!') {
    let parameter = document.querySelector('#sort').value
      if (parameter) {
        fetch('http://localhost:3000/quotes/')
        .then(res => res.json())
        .then(allQuotesData => {
          document.querySelector("#quote-list").innerHTML = ''
          document.querySelector("#toggle").value = 'Unsort!'
          // document.querySelector('#sort').value = ''
          if (allQuotesData.filter(quote => quote.author === parameter).length === 0) {
            document.querySelector("#toggle").value = 'Sort!'
            getAllCodes()
            alert('There is no author with this name!')
          } else {
            allQuotesData.filter(quote => quote.author === parameter).forEach(renderQuote)
          }
        })
      } else {
        alert('Author name must be entered!')
      }
  } else {
    document.querySelector("#toggle").value = 'Sort!'
    document.querySelector("#quote-list").innerHTML = ''
    getAllCodes()
  }
}
