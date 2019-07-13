let base_url = 'https://itunes.apple.com/search?term=';
let search_url = '';
let artist;
var artist_name = '';
const album_list = document.querySelector('#albumslist');
const header = document.querySelector('#results');
let data = null;
var firebase;
var database;
var ref;
var trackId = [];
var dtrackId = [];
const alertCtrl = document.querySelector('#alert-controller');

const search_bar = document.querySelector('#artist');

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: ",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

firebase.initializeApp(firebaseConfig);
database = firebase.database();
ref = database.ref('favorites');

search_bar.addEventListener('change', () => {
    artist_name = '';
    artist = null;
    album_list.innerHTML = '';
    artist = search_bar.value.split(' ');
    for (var i = 0; i < artist.length; i++) {
        if (i != artist.length - 1) {
            artist_name += artist[i] + '+'
        } else {
            artist_name += artist[i];
        }
    }
    search_url = base_url + artist_name;
    getData(search_url).catch(error => {
        console.error(error);
    });
});

async function getData(search_url) {
    const response = await fetchJsonp(search_url);
    data = await response.json();
    console.log(data);
    let name = '';
    for (var i = 0; i < artist.length; i++) {
        name += artist[i].charAt(0).toUpperCase() + artist[i].substr(1, artist[i].length) + ' ';
    }
    header.textContent = 'Results for ' + name;
    trackId = [];
    var df_;

    ref.on('value', dgetData, (error) => {
        console.error(error);
    });

    function dgetData(df) {
        dtrackId = [];
        var fields = df.val();
        var keys = Object.keys(fields);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            dtrackId.push(fields[k].id);
        }
        df_ = dtrackId;
    // }

    for (var i = 0; i < data.resultCount; i++) {
        // let entity = document.createElement('ion-item');
        // album_list.appendChild(entity);
        trackId.push(data.results[i].trackId);
        let album_card = document.createElement('ion-card');
        album_card.id = "card";
        const art = document.createElement('img');
        art.id = "albumArt";
        art.src = data.results[i].artworkUrl100;
        const details = document.createElement('ion-list');
        details.id = "details";
        const albumName = document.createElement('ion-card-title');
        albumName.id = "title";
        albumName.textContent = data.results[i].collectionName;
        albumName.color="danger";
        const genre = document.createElement('h5');
        genre.textContent = 'Genre: ' + data.results[i].primaryGenreName;
        const trackName = document.createElement('h5');
        trackName.textContent = data.results[i].trackName;
        const like = document.createElement('ion-button');
        like.color = "danger";
        like.value = toString(i);
        like.textContent = "Like";
        like.id = 'like' + i;
        like.value = "off";
        like.fill = "outline";
        if (dtrackId.includes(data.results[i].trackId)) {
            like.value = "on";
            like.fill = "solid";
        }
        like.addEventListener('click', () => {
            triggerLike(like.id);
        });
        const like_icon = document.createElement('ion-icon');
        like_icon.name = "heart-empty";
        like_icon.slot="start";
        like.appendChild(like_icon);
        // like.expand="block";
        const play = document.createElement('ion-button');
        const play_icon = document.createElement('ion-icon');
        play_icon.name = "play";
        play.color = "danger";
        play.value = data.results[i].trackViewUrl;
        play.textContent = "Play";
        play.id = "play" + i;
        play.addEventListener('click', () => {
            triggerPlay(play.value)
        });
        play_icon.slot="start";
        play.fill = "outline";
        play.appendChild(play_icon);
        play.appendChild(play_icon);
        // play.expand="block";
        album_card.appendChild(albumName);
        album_card.appendChild(art);
        details.appendChild(trackName);
        details.appendChild(genre);
        album_card.appendChild(details);
        album_card.appendChild(play);
        album_card.appendChild(like);
        album_list.appendChild(album_card);
    }
}
}

function triggerLike(id) {
    const ele = document.querySelector('#' + id);
    if (ele.value == "on") {
        alertCtrl.create({
            message: 'This item is already in your Favorites',
            header: 'Favorites',
            buttons: ['Ok']
        }).then(ele => {
            ele.present();
        });
    }
    if (ele.value == "off") {
        ele.value = "on";
        ele.fill = "solid";
        id_ = parseInt(id.charAt(id.length - 1));
        var itemData = {
            id: data.results[id_].trackId,
            name: data.results[id_].trackName,
            artist: data.results[id_].artistName,
            genre: data.results[id_].primaryGenreName,
            art: data.results[id_].artworkUrl100,
            album: data.results[id_].collectionName,
            song: data.results[id_].trackViewUrl,
        }
        
        ref.on('value', (data_) => {
            var fields = data_.val();
            if (fields == null) {
                ref.push(itemData);
            } else {
                var keys = Object.keys(fields);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    if (trackId[id_] == fields[k].id) {
                        return false;
                    }
                }
                ref.push(itemData);
                return false;
            }
        }
        , (error) => {
            console.log(error);
        });
    }


function triggerPlay(url) {
    window.open(url, '_blank');
}
