//const baseUrl = "https://ipbackendcontainer.thankfulcliff-61bbdc66.westeurope.azurecontainerapps.io/api"
const baseUrl = location.protocol + "//" + window.location.host + "/api";
//const baseUrl = "http://localhost:8080/api"
const topAnimalsUrl = "/mostAnimals?limit=5"
const latestAnimalsUrl = "/last5"
const totalAnimalsUrl = "/total"
const topUsersUrl = "/highscore?limit=5"

var total = 0
var page = 0

const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('page');

function changeCont() {
    if (page == 1) {
        page = 2
    } else {
        page = 1
    }
    setPage()
}

function setPage() {
    document.getElementById('container_1').hidden = page != 1
    document.getElementById('container_2').hidden = page == 1
}

async function loop() {
    const totalAnimals = await getData(totalAnimalsUrl)
    const totalAnimalsElement = document.getElementById('totalAnimals')

    totalAnimalsElement.textContent = totalAnimals

    if (total != totalAnimals) {
        total = totalAnimals

        createTopAnimals()

        createLatestAnimals()

        createLeaderboard()
    }
}

var topAnimals = []
async function createTopAnimals() {
    topAnimals = await getData(topAnimalsUrl)
    const topAnimalsElement = document.getElementById('topAnimals')
    topAnimalsElement.innerHTML = "";


    topAnimals.forEach(animal => {
        const animalHeader = document.createElement("h2")
        animalHeader.append(animal.Username + ": " + animal.Score)

        topAnimalsElement.appendChild(animalHeader);
    })

    drawChart()
}

async function createLatestAnimals() {
    const latestAnimals = await getData(latestAnimalsUrl)
    const latestAnimalElement = document.getElementById('latestAnimals')
    latestAnimalElement.innerHTML = "";

    latestAnimals.forEach(animal => {
        const animalElement = document.createElement("div")

        const animalHeader = document.createElement("h2")
        if (animal.acceptedVernacularName != "") {
            animalHeader.append(animal.acceptedVernacularName)
        } else if (animal.scientificName != "") {
            animalHeader.append(animal.scientificName)
        } else {
            animalHeader.append("Ukendt Art")
        }

        let animalIMG = new Image();
        if (animal.medias.length > 0) {
            animalIMG.src = animal.medias[0].url
        }
        animalIMG.width = 300

        animalElement.appendChild(animalHeader)
        animalElement.appendChild(animalIMG)

        latestAnimalElement.appendChild(animalElement);
    })
}

async function createLeaderboard() {
    const topUsers = await getData(topUsersUrl)
    const topUsersElement = document.getElementById('leaderboard')
    topUsersElement.innerHTML = "";


    topUsers.forEach(user => {
        const userHeader = document.createElement("h2")
        userHeader.append(user.Username + " | Dyr fundet: " + user.Score)

        topUsersElement.appendChild(userHeader);
    })
}

async function getData(url) {
    return fetch(baseUrl + url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(data => {
            // console.log(data)
            return data
        })
        .catch(error => {
            console.error('Error:', error)
        });

}


function drawChart() {

    // Set Data
    const data = [['Dyregruppe', 'Antal']];

    topAnimals.forEach(animal => {
        data.push([animal.Username, animal.Score])
    })

    var arrayData = google.visualization.arrayToDataTable(data)

    // Set Options
    const options = {
        title: 'Dyregrupper'
    };

    // Draw
    const chart = new google.visualization.PieChart(document.getElementById('topAnimalsChart'));
    chart.draw(arrayData, options);

}


loop()
setInterval(loop, 5000)

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

if (pageParam == null) {
    setInterval(changeCont, 10000)
} else {
    page = pageParam
}
setPage()