console.log("Hello World!")

const inputTitle = document.getElementById("input-title");
const inputPrice = document.querySelector("#input-price");
const inputDescription = document.getElementById("input-description");
const buttonCancel = document.getElementById("button-cancel");

const oncClickedCancel = (evt) => {
    // Don't navigate to a different page
    evt.preventDefault();
    console.log("Cancel Button pressed");
    clearAllInputFields();
}

function clearAllInputFields() {
    inputTitle.value = "";
    inputDescription.value = "";
    inputPrice.value = "";
}

buttonCancel.addEventListener("click", oncClickedCancel);