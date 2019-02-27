// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", ()=>{
fetchQuotes()
})

function fetchQuotes(){
  fetch ("http://localhost:3000/quotes")
  .then(res => res.json())
  .then(quotes => quotes.forEach(function(quote){renderQuote(quote)}))
  }


function renderQuote(quote){
  let quoteList = document.querySelector("#quote-list")

  let quoteCard = document.createElement("li")
  quoteCard.classList.add('quote-card')
  quoteCard.id = quote.id

  let blockQuote = document.createElement("blockquote")
  blockQuote.classList.add("blockquote")

  let quoteContent = document.createElement("p")
  quoteContent.classList.add("mb-0")
  quoteContent.innerHTML = quote.quote

  let footer = document.createElement("footer")
  footer.classList.add("blockquote-footer")
  footer.innerHTML = quote.author
  let br = document.createElement("br")

   let likeButton = document.createElement("button")
   likeButton.classList.add("btn-success")
   likeButton.innerHTML = "Likes:"
   likeButton.addEventListener("click", (e)=> likeQuote(e, quote))
        let likeCount = document.createElement("span")
        likeCount.innerHTML = quote.likes

   let deleteButton = document.createElement("button")
   deleteButton.classList.add("btn-danger")
   deleteButton.innerHTML = "Delete"
   deleteButton.addEventListener("click", (e) => deleteQuote(quote))

   likeButton.appendChild(likeCount)
   blockQuote.append(quoteContent, footer, br, likeButton, deleteButton)
   quoteCard.appendChild(blockQuote)
   quoteList.appendChild(quoteCard)
  }

let quoteForm = document.querySelector("#new-quote-form")
quoteForm.addEventListener("submit", fetchPostQuote)

function fetchPostQuote(e){
  e.preventDefault()
  let quote = e.target[0].value
  let author = e.target[1].value
  let data = {quote: quote, author: author, likes: 0}

    fetch("http://localhost:3000/quotes", {
      method : "POST",
      headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(renderQuote)
}

function deleteQuote(quote){
let cardToDelete = document.getElementById(`${quote.id}`)
cardToDelete.remove()
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "DELETE"})
  }

  function likeQuote(e, quote){
    
    e.target.firstElementChild.innerHTML++
    let data = {likes: parseInt(e.target.firstElementChild.innerHTML)}

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: "PATCH",
      headers:{
              'Content-Type': 'application/json'
            },
      body: JSON.stringify(data)
    })

  }
