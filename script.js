//const baseUrl = "https://ipbackendcontainer.thankfulcliff-61bbdc66.westeurope.azurecontainerapps.io/api"
const baseUrl = location.protocol + "//" + window.location.host + "/api"
const topAnimalsUrl = "/mostAnimals?limit=5"
const latestAnimalsUrl = "/last5"
const totalAnimalsUrl = "/total"
const topUsersUrl = "/highscore?limit=5"

var total = 0
var page = 0

const urlParams = new URLSearchParams(window.location.search)
const pageParam = urlParams.get("page")

function changeCont() {
  if (page == 1) {
    page = 2
  } else {
    page = 1
  }
  setPage()
}

function setPage() {
  document.getElementById("container_1").hidden = page != 1
  document.getElementById("container_2").hidden = page == 1
}

async function loop() {
  const totalAnimals = await getData(totalAnimalsUrl)
  const totalAnimalsElement = document.getElementById("totalAnimals")

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
  const topAnimalsElement = document.getElementById("topAnimals")
  topAnimalsElement.innerHTML = ""

  topAnimals.forEach((animal) => {
    const animalHeader = document.createElement("h2")
    animalHeader.append(animal.Username + ": " + animal.Score)

    topAnimalsElement.appendChild(animalHeader)
  })

  drawChart()
}

async function createLatestAnimals() {
  const latestAnimals = await getData(latestAnimalsUrl)
  const latestAnimalElement = document.getElementById("latestAnimals")
  latestAnimalElement.innerHTML = ""

  latestAnimals.forEach((animal) => {
    const animalElement = document.createElement("div")

    const animalHeader = document.createElement("h2")
    if (animal.acceptedVernacularName != "") {
      animalHeader.append(animal.acceptedVernacularName)
    } else if (animal.scientificName != "") {
      animalHeader.append(animal.scientificName)
    } else {
      animalHeader.append("Ukendt Art")
    }

    let animalIMG = new Image()
    if (animal.medias.length > 0) {
      animalIMG.src = animal.medias[0].url
    }
    animalIMG.width = 300
    animalIMG.height = 400

    const animalSpotter = document.createElement("p")
    animalSpotter.append("Spottet af: " + animal.observers[0])

    const animalTimeSpottet = document.createElement("p")
    const date = new Date(animal.observationAt)
    animalTimeSpottet.append("kl." + date.toLocaleTimeString())

    animalElement.appendChild(animalHeader)
    animalElement.appendChild(animalIMG)
    animalElement.appendChild(animalSpotter)
    animalElement.appendChild(animalTimeSpottet)

    latestAnimalElement.appendChild(animalElement)
  })
}

async function createLeaderboard() {
  const topUsers = await getData(topUsersUrl)
  const topUsersElement = document.getElementById("leaderboard")
  topUsersElement.innerHTML = ""

  topUsers.forEach((user) => {
    const userHeader = document.createElement("h2")
    userHeader.append(user.Username + " | Dyr fundet: " + user.Score)

    topUsersElement.appendChild(userHeader)
  })
}

async function getData(url) {
  return fetch(baseUrl + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      // console.log(data)
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

function drawChart() {
  // Set Data
  const data = [["Dyregruppe", "Antal"]]

  topAnimals.forEach((animal) => {
    data.push([animal.Username, animal.Score])
  })

  var arrayData = google.visualization.arrayToDataTable(data)

  // Set Options
  const options = {
    title: "Dyregrupper",
    width: isMobile() ? 250 : 500,
    height: isMobile() ? 250 : 500,
    chartArea: { width: "100%", height: "80%" },
    legend: { position: "bottom" },
  }

  // Draw
  const chart = new google.visualization.PieChart(
    document.getElementById("topAnimalsChart")
  )
  chart.draw(arrayData, options)
}

loop()
setInterval(loop, 5000)

google.charts.load("current", { packages: ["corechart"] })
google.charts.setOnLoadCallback(drawChart)

if (pageParam == null) {
  setInterval(changeCont, 10000)
} else {
  page = pageParam
}
setPage()

function isMobile() {
  var check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}
