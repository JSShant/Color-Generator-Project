//GLOBAL SELECTION AND VARIABLES
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate__btn");
const sliders = document.querySelectorAll("input[type='range']");
const currentHex = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy__container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeAdjustment = document.querySelectorAll(".adjustment__close");
const sliderContainers = document.querySelectorAll(".adjustment");
const lockButton = document.querySelectorAll(".lock");
let initialColors;
// this is for local Storage
let savedPalettes = [];


// EVENT LISTENERS

generateBtn.addEventListener("click", randomColors);
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUi(index);
    });
});

currentHex.forEach(hex => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});
popup.addEventListener("click", ()=> {
    const popupBox = popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
})
adjustBtn.forEach((button,index) => {
    button.addEventListener("click", () => {
        openAdjustmentPanel(index);
    })
})
closeAdjustment.forEach((button,index) => {
    button.addEventListener("click", () => {
        closeAdjustmentPanel(index);
    });
});

lockButton.forEach((button, index) => {
    button.addEventListener("click", () => {
        colorDivs[index].classList.toggle("locked");
        if (colorDivs[index].classList.contains("locked")) {
            button.innerHTML = `<i class = "fas fa-lock"></i>`;
        } else {
            button.innerHTML = `<i class = "fas fa-lock-open"></i>`;
        }
    })
})
//FUNCTIONS

//Color Generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors(){
    //Initial Colors
    initialColors = [];
    colorDivs.forEach((div,index) =>{
        const hexText = div.children[0];
        const randomColor = generateHex();
        //Add to initial colors array
        if(div.classList.contains("locked")){
            initialColors.push(hexText.innerText)
            return;
        } else{
            initialColors.push(chroma(randomColor).hex());
        }
        
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
    //Reset inputs
    resetInputs();
    //Check for button contrast
    adjustBtn.forEach((button,index) => {
        checkTextContrast(initialColors[index], button)
        checkTextContrast(initialColors[index], lockButton[index])
    })
    
}


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

function hslControls(slider){
    console.log(slider.target)
    const index = 
        slider.target.getAttribute("data-bright") || 
        slider.target.getAttribute("data-sat") || 
        slider.target.getAttribute("data-hue")
    ;
    let sliders = slider.target.parentElement.querySelectorAll("input[type='range']");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];
    console.log(bgColor);
    


    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value)

    colorDivs[index].style.backgroundColor = color
    //Colorise inputs/sliders
    coloriseAdjustment(color,hue,brightness, saturation);
}

function updateTextUi(index){
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    //Contrast Check for text and icons
    checkTextContrast(color, textHex);
    
    for(icon of icons){
        checkTextContrast(color, icon);
    }

}

function resetInputs(){
    const sliders = document.querySelectorAll(".adjustment input");
    sliders.forEach(slider => {
        if(slider.name === "hue"){
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === "brightness"){
            const brightColor = initialColors[slider.getAttribute("data-bright")];
            const brightnessValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightnessValue * 100) / 100;
        }
        if(slider.name === "saturation"){
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue *100)/100;
        }
    })
}

function copyToClipboard(hex){
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    //Popup Animation
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}

function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle("adjustment__active")
}
function closeAdjustmentPanel(index){
    sliderContainers[index].classList.remove("adjustment__active")
}


//Implement Save to Palette and LOCAL STORAGE
const saveBtn = document.querySelector(".save__btn");
const submitSave = document.querySelector(".save__popup--submit");
const closeSave = document.querySelector(".save__popup--close");
const saveContainer = document.querySelector(".save__container");
const saveInput = document.querySelector(".save__popup--input")

//Event Listeners
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette)



//Functions
function openPalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
}

function closePalette(e){
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
}


randomColors()

