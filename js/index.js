document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const apiUrl = "http://localhost:3000/books";
    const currentUser = { id: 1, username: "pouros" }; 

    fetch(apiUrl)
        .then(response => response.json())
        .then(books => {
            books.forEach(displayBookTitle);
        })
        .catch(error => console.error("Error fetching books:", error));

    function displayBookTitle(book) {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
    }

    function showBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.thumbnailUrl}" alt="Book Cover">
            <p>${book.description}</p>
            <h3>Liked By:</h3>
            <ul id="user-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join("")}
            </ul>
            <button id="like-btn">${isUserLiked(book) ? "Unlike" : "Like"}</button>
        `;

        document.getElementById("like-btn").addEventListener("click", () => toggleLike(book));
    }

    function isUserLiked(book) {
        return book.users.some(user => user.id === currentUser.id);
    }

    function toggleLike(book) {
        let updatedUsers;
        
        if (isUserLiked(book)) {
            updatedUsers = book.users.filter(user => user.id !== currentUser.id);
        } else {
            updatedUsers = [...book.users, currentUser];
        }

        fetch(`${apiUrl}/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ users: updatedUsers })
        })
        .then(response => response.json())
        .then(updatedBook => {
            showBookDetails(updatedBook); 
        })
        .catch(error => console.error("Error updating likes:", error));
    }
});
