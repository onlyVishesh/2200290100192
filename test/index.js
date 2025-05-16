const convert = () => {
    const inputTemp = parseInt(document.getElementById("inputTemp").value)
    const fromUnitSelect = document.getElementById("fromUnit")
    const toUnitSelect = document.getElementById("toUnit")

    const fromUnit = fromUnitSelect.value
    const toUnit = toUnitSelect.value
    const result = document.getElementById("result")
    let celsiusValue;

    switch(fromUnit){
        case "celeius":
            celsiusValue = inputTemp
            break
        case "fahrenheit":
            celsiusValue =  (inputTemp-32) * (5/9)
            break
        case "kelvin":
            celsiusValue = inputTemp - 273.15
            break
    }

    let resultTemp;
    switch(toUnit){
        case "celeius":
            resultTemp = celsiusValue
            break
        case "fahrenheit":
            resultTemp =  celsiusValue * (9/5) + 32
            break
        case "kelvin":
            resultTemp = celsiusValue + 273.15
            break
    }
    console.log(inputTemp)
    console.log(fromUnitSelect.value)
    console.log(toUnitSelect.value)
    console.log(resultTemp)
    result.innerText = resultTemp
    
}

// fromUnitSelect.addEventListener("change", ()=>{

// })