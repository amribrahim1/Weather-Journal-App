/* Global Variables */
const generate = document.getElementById("generate");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();

// Function event listener 
generate.addEventListener('click', function () {   
    const Zip = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    if (Zip== "") {alert('Enter your Zip code');return false}
    getWeather(Zip)
    .then(function (data) {
        console.log(data);
        if (data.message){
            alert(data.message);
            return false;
        }
        postData('/add', { date: newDate, temp: data.main.temp, content })
    }).then(function (newData) {
        updateUI()
    })
})

// Function to GET data from API
const getWeather = async (Zip) => {    
    const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
    const apiKey = '128f6ed503894b48a2084f80c9e5dc79&units=imperial';
    const res = await fetch(apiUrl+Zip+'&APPID='+ apiKey);    
    const data = await res.json();   
    return data;
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    console.log(data);
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    }
    catch (error) {
        console.log("Error in PostData", error);
    }
}

const updateUI = async () => {
    const request = await fetch('/all');
    try {
    const allData = await request.json()
    document.getElementById('date').innerHTML = `Today's date: ${allData.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${allData.temp} ° Fahrenheit`;
    document.getElementById('content').innerHTML = `You're feeling: ${allData.content} today`;
    }
    catch (error) {
        console.log("error", error);
    }
}; 