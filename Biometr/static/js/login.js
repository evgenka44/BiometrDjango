var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = "http://77.232.138.70:8000/";
const BASE_URL_API = "http://77.232.138.70:8000/api/v1/";
window.onload = () => {
    const loginBtn = document.getElementById("login_btn");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    loginBtn.addEventListener("click", loginBtnClick, false);
    usernameField.addEventListener("change", onUsernameChange, false);
    passwordField.addEventListener("change", onPasswordChange, false);
};
function onUsernameChange() {
    correctCredentials();
}
function onPasswordChange() {
    correctCredentials();
}
function loginBtnClick(event) {
    const password = document.getElementById("password");
    const username = document.getElementById("username");
    event.preventDefault();
    if (username.value.length < 4) {
        incorrectCredentials();
    }
    if (password.value.length < 4) {
        incorrectCredentials();
    }
    postDataToApi(BASE_URL + "login/", {
        username: username.value,
        password: password.value
    }).then((response) => {
        if (response) {
            window.location.replace(BASE_URL + "users/");
        }
        else {
            document.getElementById("incorrect_credentials").classList.remove("incorrect_hidden");
        }
    });
}
function incorrectCredentials() {
    document.getElementById("incorrect_credentials").classList.remove("incorrect_hidden");
}
function correctCredentials() {
    document.getElementById("incorrect_credentials").classList.add("incorrect_hidden");
}
function postDataToApi(url = "", data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                'X-CSRFToken': getCookie("csrftoken"),
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    });
}
function getDataFromApi(url = "") {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                // 'X-CSRFToken': getCookie("csrftoken"),
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}
//# sourceMappingURL=login.js.map