const baseUrl = "https://ipbackendcontainer.thankfulcliff-61bbdc66.westeurope.azurecontainerapps.io/api"
const topAnimalsUrl = "/mostAnimals?limit=5"
const latestAnimalsUrl = "/last5"
const totalAnimalsUrl = "/total"
const topUsersUrl = "/highscore?limit=5"

async function loop() {
    const totalAnimals = await getData(totalAnimalsUrl)
    const totalAnimalsElement = document.getElementById('totalAnimals')

    totalAnimalsElement.textContent = totalAnimals

    createTopAnimals()

    createLatestAnimals()

    createLeaderboard()
}

async function createTopAnimals() {
    const topAnimals = await getData(topAnimalsUrl)
    const topAnimalsElement = document.getElementById('topAnimals')
    topAnimalsElement.innerHTML = "";


    topAnimals.HighScore.forEach(animal => {
        const animalHeader = document.createElement("h2")
        animalHeader.append(animal.Username + ": " + animal.Score)

        topAnimalsElement.appendChild(animalHeader);
    })
}

async function createLatestAnimals() {
    const latestAnimals = await getData(latestAnimalsUrl)
    const leaderboardElement = document.getElementById('latestAnimals')
    leaderboardElement.innerHTML = "";


    latestAnimals.Last5.forEach(animal => {
        const animalElement = document.createElement("div")

        const animalHeader = document.createElement("h2")
        animalHeader.append(animal.acceptedVernacularName)

        let animalIMG = new Image();
        animalIMG.src = animal.medias[0].url
        animalIMG.width = 300

        animalElement.appendChild(animalHeader)
        animalElement.appendChild(animalIMG)

        leaderboardElement.appendChild(animalElement);
    })
}

async function createLeaderboard() {
    const topUsers= await getData(topUsersUrl)
    const topUsersElement = document.getElementById('leaderboard')
    topUsersElement.innerHTML = "";


    topUsers.HighScore.forEach(user => {
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
        console.log(data)
        return data
    })
    .catch(error => {
        console.error('Error:', error)
    });
    
}

loop()
setInterval(loop, 10000)