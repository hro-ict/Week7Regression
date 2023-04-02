import { createChart, updateChart } from "./scatterplot.js"

let nn = ml5.neuralNetwork({ task: 'regression', debug: true })

function loadData() {
  Papa.parse("./data/mobilephones.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: results => checkData(results.data)
  })
}


function checkData(data){
  // data voorbereiden
  // data.sort(() => (Math.random() - 0.5))
  // let trainData = data.slice(0, Math.floor(data.length * 0.8))
  // let testData = data.slice(Math.floor(data.length * 0.8) + 1)

  // neural network aanmaken
  nn = ml5.neuralNetwork({ task: 'regression', debug: true })

  // data toevoegen aan neural network
  for(let phone of data){
      nn.addData({ resoloution: phone.resoloution,
        ppi: phone.ppi,
        cores: phone.cores,
        memory: phone.memory,
        storage: phone.storage,
        rearcam: phone.rearcam,
        frontcam: phone.frontcam,
        battery: phone.battery,
        thickness: phone.thickness }, { price: phone.price })
  }

  // normalize
  nn.normalizeData()

  // start training
  startTraining()
}

function startTraining() {
  nn.train({ epochs: 10 }, () => finishedTraining())
}

async function finishedTraining() {
  //save model
  nn.save()
  console.log("Finished training!")
  // make prediction
  //await makePrediction()
  let result= await nn.predict({ppi:15,cores:3,memory:3, 
    storage:2,rearcam:5,frontcam:9,battery:5555,
    thickness:4, resoloution:5
  })
  console.log(result[0].price)
}

// async function makePrediction() {
//   let input = document.getElementById("field").value
//   let battery = Number(input)

//   if (isNaN(battery)) {
//     document.getElementById("result").innerHTML = "Ongeldige invoer!"
//     return
//   }

//   let results = await nn.predict({ battery: battery })
//   console.log(`Geschat prijs: ${results[0].price}`)
//   document.getElementById("result").innerHTML = `Geschat prijs: ${results[0].price}`

//   // update chart with prediction
//   updateChart([{ x: battery, y: results[0].price }])
// }

loadData()

