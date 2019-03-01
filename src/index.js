// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener('DOMContentLoaded', init);

function init() {
  fetchAllQuotes();
  newFormEventListener();
}

function fetchAllQuotes() {
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => getQuote(quote)));
}

function getQuote(quote) {
  const quoteUl = document.querySelector('#quote-list');

  const quoteLi = document.createElement('li');
  quoteLi.classList = 'quote-card';

  const blockQuote = document.createElement('blockquote');
  blockQuote.classList = 'blockquote';

  const quoteP = document.createElement('p');
  quoteP.classList = 'mb-0';
  quoteP.innerText = quote.quote;

  const quoteFooter = document.createElement('footer');
  quoteFooter.classList = 'blockquote-footer';
  quoteFooter.innerText = quote.author;

  const quoteBr = document.createElement('br');

  const successBtn = document.createElement('button');
  successBtn.classList = 'btn-success';
  successBtn.innerText = 'Likes: ';
  successBtn.addEventListener('click', () => {
    updateLikes(quote, successBtn);
  });

  const dangerBtn = document.createElement('button');
  dangerBtn.classList = 'btn-danger';
  dangerBtn.innerText = 'Delete';
  dangerBtn.addEventListener('click', () => {
    quoteLi.remove();
    deleteQuote(quote);
  });

  const editBtn = document.createElement('button');
  editBtn.innerText = 'Edit';
  editBtn.addEventListener('click', () => {
    addEditQuoteToIput(quote);
  });

  const quoteSpan = document.createElement('span');
  quoteSpan.innerText = quote.likes;

  successBtn.appendChild(quoteSpan);

  blockQuote.append(
    quoteP,
    quoteFooter,
    quoteBr,
    successBtn,
    dangerBtn,
    editBtn
  );
  quoteLi.appendChild(blockQuote);
  quoteUl.appendChild(quoteLi);
}

function captureInputs() {
  const newQuote = document.getElementById('new-quote').value;
  const newAuthor = document.getElementById('author').value;

  createNewQuote(newQuote, newAuthor);
}

function newFormEventListener() {
  const newForm = document.getElementById('new-quote-form');
  newForm.addEventListener('submit', e => {
    e.preventDefault();
    captureInputs();
  });
}

function createNewQuote(newQuote, newAuthor) {
  data = { quote: newQuote, likes: 0, author: newAuthor };
  fetch(`http://localhost:3000/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(quote => render(quote));

  const newForm = document.getElementById('new-quote-form');
  newForm.reset();
}

function deleteQuote(quote) {
  data = { id: quote.id };

  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => console.log(data));
}

function updateLikes(quote, successBtn) {
  updatedLikes = ++quote.likes;

  data = { likes: updatedLikes };
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(frontEndLikes(updatedLikes, successBtn));
}

function frontEndLikes(updatedLikes, successBtn) {
  successBtn.children[0].innerText = `${updatedLikes}`;
}

// function addEditQuoteToIput(quote) {
//   const newQuote = (document.getElementById('new-quote').value = quote.quote);
//   const newAuthor = (document.getElementById('author').value = quote.author);

//   updatedQuotes(newQuote, newAuthor, quote);
// }

// function addEditQuoteEventListener() {
//   document.querySelector('#edit').addEventListener('click', () => {
//     update
//   });
// }

// function updatedQuotes(updatedQuote, updatedAuthor, quote) {
//   data = { quote: updatedQuote, author: updatedAuthor };

//   fetch(`http://localhost:3000/quotes/${quote.id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//     .then(res => res.json())
//     .then(quote => console.log(quote));
// }
