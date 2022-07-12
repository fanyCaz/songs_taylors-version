const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

function processAlbums(albums){
  let album_comparison = {}
  albums.forEach( (album) => {
    if( new Date(album["release_date"]) < new Date('2019-01-01')
    && !album["name"].includes("Taylor's Version") ){
      album_comparison[album["name"]] = album["id"];
    }
  });
  console.log(album_comparison);
}

app.get('/get_albums', (req,res) => {
  let offset = req.query.offset || 0;
  let id_artist = req.query.id_artist;
  console.log("Se esta haciendo la request...")
  axios.get(`https://api.spotify.com/v1/artists/${id_artist}/albums?include_groups=album&offset=${offset}`, 
    { headers: { 'Authorization': 'Bearer '+process.env.SPOTIFY_TOKEN } })
    .then(function(response){
      if(response.status === 200){
        console.log("Se termino la request");
        let albums = response.data["items"];
        processAlbums(albums);
      } else {
        console.log("Algo salio mal en la request, aunque no es error ");
      }
    })
    .catch(function(err){
      console.log("Hay un errorsote");
      console.log(err);
    });
  res.send("Respuesta en consola");
});

app.get('/', (req,res) => {
  res.send("Esta app actualiza tu poor version to Tays Version");
});

app.get('/search', (req,res) => {
  artist_search = req.query.artist;
  let infoArtist;
  if(artist_search){
    console.log("Se esta haciendo la request...")
    axios.get('https://api.spotify.com/v1/search?q='+artist_search+'&type=artist&limit=2',
      { headers: { 'Authorization': 'Bearer '+process.env.SPOTIFY_TOKEN } })
    .then(function(response){
      if(response.status === 200){
        infoArtist = response.data;
        console.log("Se termino la request");
        let id_artist = infoArtist["artists"]["items"][0]["id"];
        console.log(`Id del artista: ${id_artist}`);
      } else {
        console.log("Algo salio mal en la request, aunque no es error ");
        console.log( response)
      }
    })
    .catch(function(err){
      console.log("Hubo un errorzazo")
      console.log(err)
    });
    res.send("Respuesta en console");
  } else {
    res.send("Aqui van a ir las busquedas");
  }
});

app.get('/get_playlists', (req,res) => {
  console.log("TOken : "+ process.env.SPOTIFY_TOKEN);
  axios.get('https://api.spotify.com/v1/me/playlists',
    { headers: { 'Authorization': 'Bearer '+process.env.SPOTIFY_TOKEN } })
  .then(function(response){
    if(response.status === 200){
      console.log("Se termino la request");
      console.log( response.data["items"]);
    }
  })
  .catch(function(err){
    console.log("Hubo un errorzazo")
    console.log(err)
    console.log(err.status);
    console.log(err.message);
  });

  res.send("Aqui se va estar la función que actualize todo");
});

app.listen(port, () => console.log(`Escucha en ${port}`));

