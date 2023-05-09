const BASE_URL = "http://77.232.138.70:8000/"
const BASE_URL_API = "http://77.232.138.70:8000/api/v1/"

window.onload = () => {
    const loginBtn = document.getElementById("login_btn")
    const usernameField = document.getElementById("username")
    const passwordField = document.getElementById("password")
    loginBtn.addEventListener("click", loginBtnClick, false);
    usernameField.addEventListener("change", onUsernameChange, false);
    passwordField.addEventListener("change", onPasswordChange, false);
}

function onUsernameChange() {
    correctCredentials()
}

function onPasswordChange() {
    correctCredentials()
}



function loginBtnClick(event) {
    const password = document.getElementById("password") as HTMLInputElement
    const username = document.getElementById("username") as HTMLInputElement
    event.preventDefault();
    if (username.value.length < 4) {
        incorrectCredentials()
    }
    if (password.value.length < 4) {
        incorrectCredentials()
    }
    postDataToApi(BASE_URL + "login/", {
        username: username.value,
        password: password.value
    }).then((response) => {
        if (response) {
            window.location.replace(BASE_URL + "users/");
        } else {
           document.getElementById("incorrect_credentials").classList.remove("incorrect_hidden")
        }
    })
}

function incorrectCredentials() {
    document.getElementById("incorrect_credentials").classList.remove("incorrect_hidden")
}

function correctCredentials() {
    document.getElementById("incorrect_credentials").classList.add("incorrect_hidden")
}

async function postDataToApi(url = "", data) {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            'X-CSRFToken': getCookie("csrftoken"),
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getDataFromApi(url = "") {
    const response = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            // 'X-CSRFToken': getCookie("csrftoken"),
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function getCookie(name: string) : string{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}