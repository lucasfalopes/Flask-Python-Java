from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_unique_id(movies):
    if not movies:
        return 1  # Primeiro ID se não houver filmes
    else:
        return max(movie['id'] for movie in movies) + 1

def load_movies():
    try:
        with open('db.json', 'r') as file:
            movies = json.load(file)
    except (json.JSONDecodeError, FileNotFoundError):
        movies = []
    return movies

def save_movies(movies):
    with open('db.json', 'w') as file:
        json.dump(movies, file, indent=4)  # Adiciona indentação para melhorar a legibilidade do arquivo

@app.route('/')
def home():
    return render_template('home.html', title='Home', movielist=load_movies())

@app.route('/movies')
def movies_list():
    return render_template('list.html', movielist=load_movies())

@app.route('/movies/json')
def movies_json():
    movies = load_movies()
    return jsonify(movies)


@app.route('/add', methods=['GET', 'POST'])
def add_movie():
    movies = load_movies()  # Carrega uma vez para uso em POST e GET
    if request.method == 'POST':
      new_movie = {
          'id': generate_unique_id(movies),
          'name': request.form['name'],
          'image_url': request.form['image_url'],
          'details_url': request.form['details_url'],
          'runtime': request.form['runtime'],
          'description': request.form['description']  # Inclua a resenha
      }
      movies.append(new_movie)
      save_movies(movies)
      return redirect(url_for('movies_list'))

    movie = {'id': None, 'name': '', 'image_url': '', 'details_url': '', 'runtime': ''}
    return render_template('form.html', form_title='Add Movie', button_label='Add Movie', movie=movie)

@app.route('/edit/<int:movie_id>', methods=['GET', 'POST'])
def edit_movie(movie_id):
    movies = load_movies()
    movie = next((m for m in movies if m['id'] == movie_id), None)

    if movie is None:
        return "Movie not found", 404

    if request.method == 'POST':
      movie['name'] = request.form['name']
      movie['image_url'] = request.form['image_url']
      movie['details_url'] = request.form['details_url']
      movie['runtime'] = request.form['runtime']
      movie['description'] = request.form['description']  # Atualiza a resenha
      save_movies(movies)
      return redirect(url_for('movies_list'))


    return render_template('form.html', form_title='Edit Movie', button_label='Update Movie', movie=movie)

@app.route('/delete/<int:movie_id>', methods=['POST'])
def delete_movie(movie_id):
    movies = load_movies()
    movie_index = next((i for i, m in enumerate(movies) if m['id'] == movie_id), -1)

    if movie_index == -1:
        return "Movie not found", 404

    del movies[movie_index]
    save_movies(movies)
    return redirect(url_for('movies_list'))

if __name__ == '__main__':
    app.run(debug=True)
