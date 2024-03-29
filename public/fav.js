
var firebase;
var database;
var ref;
var df = [];

const cardList = document.querySelector('#list');

// Add your keys here

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

firebase.initializeApp(firebaseConfig);
database = firebase.database();
ref = database.ref('favorites');

getDataBase();

function getDataBase() {
    ref.on('value', gotData, (error) => {
        console.log(error);
    });

    function gotData(data_) {
        df = [];
        var fields = data_.val();
        var keys = Object.keys(fields);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            df.push(fields[k]);
        }
        generateContent(df);
    }
}

function generateContent(data) {
    console.log(data);
    data.sort(function(a, b) {
        if (a.name < b.name) {return -1;}
        if (a.name > b.name) {return 1;}
        return 0;
    })
    for (var i = 0; i < data.length; i++) {
        const item = document.createElement('ion-item');
        item.id = "item" + i;
        item.class="ion-padding";
        item.addEventListener('click', () => {
            openCard(data, item.id);
        });
        const thumb = document.createElement('ion-thumbnail');
        thumb.slot="start";
        const img = document.createElement('img');
        img.src = data[i].art;
        const label = document.createElement('ion-label');
        label.textContent = data[i].name;
        thumb.appendChild(img);
        item.appendChild(thumb);
        item.appendChild(label);
        cardList.appendChild(item);
    }
}

function openCard(data, id) {
    id_ = parseInt(id.charAt(id.length - 1));

}
