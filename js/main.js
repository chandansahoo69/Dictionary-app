const input = document.querySelector('#input')
const searchBtn = document.querySelector('#search')
const notFound = document.querySelector('.not_found')
const def = document.querySelector('.def')
const audioBox = document.querySelector('.audio')
const loading = document.querySelector('.loading')
const data_container = document.querySelector('.data_container')
const key = 'ab36e8bf-8dee-49a7-95eb-4f43dfe0dd7e'

searchBtn.addEventListener('click', function (e) {
    data_container.style.display = 'block'

    //clear data before searching for the another input
    audioBox.innerHTML = ''
    notFound.innerText = ''
    def.innerText = ''

    //get input
    let word = input.value;
    //if word is empty show alert
    if (word === '') {
        alert('Word is required')
        return;
    }
    //api call
    getData(word);
})
//api call
async function getData(word) {
    //show the loading icon till data is not comes from 
    //the server
    loading.style.display = 'block';
    //call the api
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`)
    //parse the data into json format
    const data = await response.json();
    //check for empty results
    if (!data.length) {
        //remove the loading class when data comes
        loading.style.display = 'none';
        //if result is not found show no result
        notFound.innerText = 'No result found !!!'
        return;
    }
    //if result are suggetions then the data type is string
    //so show the suggestions
    if (typeof data[0] === 'string') {
        //remove the loading class when data comes
        loading.style.display = 'none';
        //create a heading 
        let heading = document.createElement('h3');
        heading.innerText = 'Did You Mean?'
        //append to the result div
        notFound.appendChild(heading)
        //show all the suggetion in a block
        data.forEach(element => {
            const suggetion = document.createElement('span')
            //add the styling to the span
            suggetion.classList.add('suggested')
            //set the inner text
            suggetion.innerText = element
            //append to the result div
            notFound.appendChild(suggetion)
        })
        return;
    }
    //if result found show the data
    loading.style.display = 'none';
    //get the defination
    const defination = data[0].shortdef[0];
    //add it to the dom
    def.innerText = defination;

    //sound is present in the nested 
    const soundName = data[0].hwi.prs[0].sound.audio;
    //if sound is not present then dont show the audio
    if (soundName) {
        //if sound fle exist
        getSound(soundName);
    }
}
//sound function
function getSound(soundName) {
    //the server needs the subFolder that means take the
    //first charcter  
    let subFolder = soundName.charAt(0);
    //call the api with subfolder and api key
    const soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${key}`
    //then create an audio element 
    let aud = document.createElement('audio')
    //add the sound link
    aud.src = soundSrc;
    aud.controls = true;
    // aud.play()
    //append it to the result div
    audioBox.appendChild(aud);
}