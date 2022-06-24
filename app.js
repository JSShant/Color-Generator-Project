//GLOBAL SELECTION AND VARIABLES
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate__btn");
const sliders = document.querySelectorAll("input[type='range']");
const currentHex = document.querySelectorAll(".color h2");
let initialColors;



// EVENT LISTENERS

generateBtn.addEventListener("click", randomColors);

//FUNCTIONS

//Color Generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors(){
    colorDivs.forEach((div,index) =>{
        const hexText = div.children[0];
        const randomColor = generateHex();

        //Add color to background
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        //Check for contrast
        checkTextContrast(randomColor, hexText);
    })
};
randomColors()

function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    console.log(color)
    if(luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}




