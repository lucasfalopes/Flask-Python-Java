let deleteModalInstance;  
let movieIdToDelete;      

document.addEventListener('DOMContentLoaded', function() {
    updateMovieList();
});


function updateMovieList() {
    fetch('/movies/json')
    .then(response => response.json())
    .then(movies => {
        const movieContainer = document.getElementById('movies-container');
        movieContainer.innerHTML = ''; 
        movies.forEach(movie => {
            movieContainer.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <img src="${movie.image_url || 'https://via.placeholder.com/150'}" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="Movie Poster">
                    <div class="card-body">
                        <p class="card-text">${movie.name}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick='showDetailsPopup(${JSON.stringify(movie)})'>Details</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="location.href='/edit/${movie.id}'">Edit</button>
                                <button type="button" class="btn btn-sm btn-outline-danger" onclick="showConfirmPopup('${movie.id}', '${movie.name}')">
                                    Delete
                                </button>
                            </div>
                            <small class="text-muted">${movie.runtime} min</small>
                        </div>
                    </div>
                </div>
            </div>`;
        });
    })
    .catch(error => console.error('Error loading the movies:', error));
}


function showConfirmPopup(movieId, movieName) {
    movieIdToDelete = movieId;  
    document.getElementById('movieName').textContent = movieName;
    deleteModalInstance = new bootstrap.Modal(document.getElementById('deleteModal'), {
        keyboard: false
    });
    deleteModalInstance.show(); 
}

function closeModal() {
    if (deleteModalInstance) {
        deleteModalInstance.hide(); 
    }
}

function confirmDelete() {
    if (movieIdToDelete) {
        fetch(`/delete/${movieIdToDelete}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                updateMovieList();  
                closeModal();      
            } else {
                alert('Erro ao deletar o filme');
            }
        })
        .catch(error => {
            console.error('Error deleting the movie:', error);
            alert('Erro ao deletar o filme');
        });
    }
}

function deleteMovie(movieId) {
    fetch(`/delete/${movieId}`, { method: 'POST' })
    .then(response => {
        if (response.ok) {
            updateMovieList();
        } else {
            alert('Erro ao deletar o filme');
        }
    })
    .catch(error => console.error('Error deleting the movie:', error));
}

function showDetailsPopup(movie) {
    document.getElementById('detailImage').src = movie.image_url || 'https://via.placeholder.com/450x300';
    document.getElementById('detailName').textContent = movie.name;
    document.getElementById('detailRuntime').textContent = movie.runtime;
    document.getElementById('detailDescription').textContent = movie.description || 'Não disponível';
    document.getElementById('detailLink').href = movie.details_url; // Define o link do botão

    let detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
        keyboard: true
    });
    detailsModal.show(); // Mostra o modal
}

