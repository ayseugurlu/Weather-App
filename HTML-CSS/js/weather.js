

const button = document.querySelector("button")
const input = document.querySelector("input")
const message = document.querySelector(".msg")
const form= document.querySelector("form")

const cities = document.querySelector(".cities")

const searchedCities=[]

button.addEventListener("click", (e) => {
    e.preventDefault()

    let inputValue = input.value.trim().toLowerCase()


    if(searchedCities.includes(inputValue)){
          message.textContent = `You already know the weather for ${input.value}.Please search for another city. 😎`
          form.reset()
    }else{
        showScreen(inputValue)
        searchedCities.push(inputValue)
        message.textContent=""

        console.log(searchedCities)
        form.reset()
       
    }

   



})



const showScreen =async(item) => {

    const weather=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${item}&appid=344af0bac8cf965c9169f60d16f1c1ae&units=metric`).then((a) => a.json())

   const iconURL= `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

    console.log(weather)


    cities.innerHTML += `
    
    <li class="city">

                <h2 class="city-name" data-name="${weather.name},${weather.sys.country}">
                <span>${weather.name}</span>
                <sup>${weather.sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(weather.main.temp)}<sup>°C</sup></div>
          <figure>
                <img class="city-icon" src=${iconURL}>
                <figcaption>${weather.weather[0].description}</figcaption>
          </figure>

    
    
    </li>
    
    `

}





