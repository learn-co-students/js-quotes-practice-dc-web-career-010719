// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", init)

function init(){
    getQuotes()
    let form = document.getElementById("new-quote-form")
    form.addEventListener('submit', newQuote)
}

function getQuotes() {
    fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(quote => quote.forEach(showQuotes))
}

function showQuotes(quote){
    let ul = document.getElementById('quote-list')
    let li = document.createElement('li')
    let blockquote = document.createElement('blockquote')
    let p = document.createElement('p')
    let footer = document.createElement('footer')
    let br = document.createElement('br')
    let likeBtn = document.createElement('button')
    let deleteBtn = document.createElement('button')
    let span = document.createElement('span')


    li.classList.add('quote-card')
    blockquote.classList.add('blockquote')
    p.classList.add('mb-0')
    footer.classList.add('blockquote-footer')
    likeBtn.classList.add('btn-success')
    deleteBtn.classList.add('btn-danger')

    li.setAttribute('id', `quote-${quote.id}`)
    likeBtn.setAttribute('id', `like-quote-${quote.id}`)
    deleteBtn.setAttribute('id', `delete-quote-${quote.id}`)

    p.innerText = quote.quote

    footer.innerText = quote.author

    likeBtn.innerText = 'Likes:' 

    deleteBtn.innerText = 'Delete'

    span.innerText = quote.likes 

    ul.appendChild(li)
    likeBtn.appendChild(span)
    li.append(blockquote, p, footer, br, likeBtn, deleteBtn)

    likeBtn.addEventListener('click', likeQuote)
    deleteBtn.addEventListener('click', deleteQuote)

}

function newQuote(e){
    e.preventDefault()
   
    let quote = document.getElementById('new-quote').value
    let author = document.getElementById('new-quote').value
  
    data = {
        quote: quote,
        author: author,
        likes: 0
    }

    fetch('http://localhost:3000/quotes', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => res.json())
        .then(quote => {
            showQuotes(quote)
            document.getElementById('new-quote-form').reset()
    })

}

function likeQuote(e) {
    e.preventDefault()
    let id = e.target.id.split('-')[2]

    let like = document.getElementById(`like-quote-${id}`)
    let stringLikes = document.getElementById(`like-quote-${id}`).innerText.split("").slice(-1)[0]
    let likeCounter = parseInt(stringLikes)
    like.innerText = `Likes: ${++likeCounter}`

    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({likes: likeCounter}),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(res => res.json())
}

function deleteQuote(e){
    let id = e.target.id.split('-')[2]
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: "DELETE"
    }).then(res => res.json())
        .then(json => {
            document.getElementById(`quote-${id}`).remove()
        })

}