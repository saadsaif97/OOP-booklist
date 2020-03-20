class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBook(book){
        //Create a row containing the title, author and isbn and delete icon
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='delete'>X</a></td>
        `;

        //Append row to the list-item (tbody)
        document.getElementById('book-list').appendChild(row);
    }

    eraseFields(){
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }

    deleteBook(target){
        if(target.className==='delete')
        target.parentElement.parentElement.remove();
    }

    showAlert(message, CSSClass){
        //Create a div element and add the classes to it
        const div = document.createElement('div');
        div.className=`alert ${CSSClass}`;
        //Append a text node to div
        div.appendChild(document.createTextNode(message));
        //Add the div in the container and before the form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        //Remove the div after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
}

//Add the book to the local sorage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null)
        books=[];
        else
        books=JSON.parse(localStorage.getItem('books'));

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        const ui = new UI;
        
        books.forEach(function(book){
            ui.addBook(book);
        })
    }

    static addBookToLocalStorage(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBookFromLocalStorage(target){
        const books = Store.getBooks();

        books.forEach(function(book,index){
            if(book.isbn===target)
            books.splice(index,1);
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Event Listener on loading the page
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listener to add book
document.getElementById('book-form').addEventListener('submit',function(e){
    //Create a new Book by using form fields
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //Instantiate a book
    const book = new Book(title, author, isbn);
    
    //Instantiate a new UI
    const ui = new UI();

    //Add book to the local storage
    Store.addBookToLocalStorage(book);

    //Validate the form
    if(title === '' || author=== '' || isbn ==='')
    //Showing the alert in the DOM
    ui.showAlert('Please input the valid information', 'error')
    else{
        //Add the book to the UI
        ui.addBook(book);
    
        //Erase the fields
        ui.eraseFields();

        //Showing the alert in the DOM
        ui.showAlert('Book has been added successfully','success')
    }

    e.preventDefault();
});

//Add event listener to delete the book
document.getElementById('book-list').addEventListener('click',function(e){
    //Instantiate a new UI
    const ui = new UI();

    //Delete the book
    ui.deleteBook(e.target);

    //Delete the book from the local storage
    Store.removeBookFromLocalStorage(e.target.parentElement.previousElementSibling.textContent);

    //Show Alert
    ui.showAlert('Book Deleted!', 'success');

    e.preventDefault();
});