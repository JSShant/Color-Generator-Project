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
        //Initial Sliders Color
        const color = chroma(randomColor);
        const adjustment = div.querySelectorAll(".adjustment input");
        const hue = adjustment[0];
        const brightness = adjustment[1];
        const saturation = adjustment[2];

        coloriseAdjustment(color,hue,brightness, saturation);
    })
};
randomColors()

function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}


function coloriseAdjustment(color,hue,brightness, saturation){
    //Saturation Scale
    const noSaturation = color.set("hsl.s", 0);
    const fullSaturation = color.set("hsl.s", 1);
    const scaleSaturation = chroma.scale([noSaturation,color,fullSaturation]);
    //Brightness Scale
    const midbright = color.set("hsl.l",0.5);
    const scaleBrightness = chroma.scale(["black", midbright,"white"])
    //Update Input Color
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSaturation(0)}, ${scaleSaturation(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBrightness(0)}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(74,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

