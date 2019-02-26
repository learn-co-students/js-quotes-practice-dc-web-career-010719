// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', () => {
  let quoteDiv = document.createElement('div')
  quoteDiv.setAttribute('id', 'quote-div')
  document.querySelector('body').appendChild(quoteDiv)
  document.getElementById('new-quote-form').addEventListener('submit', newQuote)
  fetchQuotes()
})

function fetchQuotes () {
  fetch('http://localhost:3000/quotes')
  .then(res => res.json())
  .then(quotes => {
    quotes.forEach(quote => showQuote(quote))
  })
}

function showQuote (quote) {
  let quoteDiv = document.getElementById('quote-div')
  let quoteLi = document.createElement('li')
  let blockquote = document.createElement('blockquote')
  let quoteP = document.createElement('p')
  let footer = document.createElement('footer')
  let br = document.createElement('br')
  let likesBtn = document.createElement('button')
  let delBtn = document.createElement('button')

  quoteLi.className = 'quote-card'
  blockquote.className = 'blockquote'
  quoteP.className = 'mb-0'
  footer.className = 'blockquote-footer'
  likesBtn.className = 'btn-success'
  delBtn.className = 'btn-danger'

  quoteP.innerText = `${quote.quote}`
  footer.innerText = `${quote.author}`
  likesBtn.innerText = `Likes: ${quote.likes}`
  delBtn.innerText = 'Delete'

  quoteLi.setAttribute('id', `quote-${quote.id}`)
  likesBtn.setAttribute('id', `like-quote-${quote.id}`)
  delBtn.setAttribute('id', `del-quote-${quote.id}`)

  quoteDiv.appendChild(quoteLi)
  quoteLi.appendChild(blockquote)
  blockquote.append(quoteP, footer, br, likesBtn, delBtn)

  likesBtn.addEventListener('click', likeQuote)
  delBtn.addEventListener('click', delQuote)
}

function newQuote (e) {
  e.preventDefault()
  let newQuote = document.getElementById('new-quote').value
  let author = document.getElementById('author').value

  let data = {
    quote: newQuote,
    author: author,
    likes: 0
  }

  fetch('http://localhost:3000/quotes', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(res => res.json())
  .then(quote => {
    showQuote(quote)
    document.getElementById('new-quote-form').reset()
  })
}

function likeQuote (e) {
  let id = e.currentTarget.id.split('-')[2]
  let likes = document.getElementById(`like-quote-${id}`)
  numLikes = parseInt(likes.innerText.split(' ')[1]) + 1
  likes.innerText = `Likes: ${numLikes}`

  fetch(`http://localhost:3000/quotes/${id}`,{
    method: 'PATCH',
    body: JSON.stringify({likes: numLikes}),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(res => res.json())
  .then(quote => showQuote(quote))
}

function delQuote (e) {
  let id = e.currentTarget.id.split('-')[2]

  fetch(`http://localhost:3000/quotes/${id}`, {method: 'delete'})
  .then(res => res.json())
  .then(obj => {
    document.getElementById(`quote-${id}`).remove()
  })
}
