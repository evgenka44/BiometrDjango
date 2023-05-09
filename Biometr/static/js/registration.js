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
window.onload = function () {
    const registerButton = document.getElementById("register_btn");
    const passwordField = document.getElementById("password");
    const passwordAgainField = document.getElementById("password_again");
    const typeSelect = document.getElementById("type");
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const doctorsSelect = document.getElementById("doctors_select");
    const doctorsBlock = document.getElementById("doctors_block");
    const loginFormElement = document.getElementById("login_form");
    registerButton === null || registerButton === void 0 ? void 0 : registerButton.addEventListener("click", (event) => {
        onRegister(event, usernameField, passwordField, passwordAgainField, emailField, typeSelect, doctorsSelect);
    }, false);
    passwordField === null || passwordField === void 0 ? void 0 : passwordField.addEventListener("change", () => { passwordCheckAndColor(passwordField, passwordAgainField); }, false);
    passwordField === null || passwordField === void 0 ? void 0 : passwordField.addEventListener("input", () => { passwordCheckAndColor(passwordField, passwordAgainField); }, false);
    passwordAgainField === null || passwordAgainField === void 0 ? void 0 : passwordAgainField.addEventListener("change", () => { passwordCheckAndColor(passwordField, passwordAgainField); }, false);
    passwordAgainField === null || passwordAgainField === void 0 ? void 0 : passwordAgainField.addEventListener("input", () => { passwordCheckAndColor(passwordField, passwordAgainField); }, false);
    usernameField === null || usernameField === void 0 ? void 0 : usernameField.addEventListener("change", () => { usernameCheck(usernameField); }, false);
    usernameField === null || usernameField === void 0 ? void 0 : usernameField.addEventListener("input", () => { usernameCheck(usernameField); }, false);
    emailField === null || emailField === void 0 ? void 0 : emailField.addEventListener("input", () => { emailCheck(emailField); }, false);
    emailField === null || emailField === void 0 ? void 0 : emailField.addEventListener("change", () => { emailCheck(emailField); }, false);
    typeSelect === null || typeSelect === void 0 ? void 0 : typeSelect.addEventListener("change", () => {
        onTypeSelectChange(typeSelect, doctorsBlock, doctorsSelect, loginFormElement);
    }, false);
};
function onRegister(event, usernameField, passwordField, passwordAgainField, emailField, typeSelect, doctorsSelect) {
    event.preventDefault();
    if (emailCheck(emailField) && usernameCheck(usernameField) && passwordCheckAndColor(passwordField, passwordAgainField)) {
        postDataToApi(BASE_URL + "registration/", {
            username: usernameField.value,
            email: emailField.value,
            password: passwordField.value,
            type: typeSelect.value,
            doctor: typeSelect.value === "patient" ? doctorsSelect.value : null,
        }).then((isSuccess) => {
            if (isSuccess) {
                window.location.replace(BASE_URL + "users/");
            }
            else {
                alert("Логин занят");
            }
        });
    }
    else {
        alert("Поля заполнены неправильно");
    }
}
function emailCheck(emailField) {
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };
    if (validateEmail(emailField.value)) {
        emailField.style.backgroundColor = "#D2F7B5";
        return true;
    }
    else {
        emailField.style.backgroundColor = "#F5C5C5";
        return false;
    }
}
function passwordCheckAndColor(password, passwordAgain) {
    if (password.value === passwordAgain.value && password.value.length >= 4) {
        password.style.backgroundColor = "#D2F7B5";
        passwordAgain.style.backgroundColor = "#D2F7B5";
        return true;
    }
    else {
        password.style.backgroundColor = "#F5C5C5";
        passwordAgain.style.backgroundColor = "#F5C5C5";
        return false;
    }
}
function usernameCheck(usernameField) {
    if (usernameField.value.length >= 4) {
        usernameField.style.backgroundColor = "#D2F7B5";
        return true;
    }
    else {
        usernameField.style.backgroundColor = "#F5C5C5";
        return false;
    }
}
function onTypeSelectChange(typeSelect, doctorsBlock, doctorsSelect, loginFormElement) {
    if (typeSelect.value == "patient") {
        doctorsBlock.classList.remove("hidden");
        loginFormElement.style.height = loginFormElement.offsetHeight + 100 + "px";
        getDataFromApi(BASE_URL_API + "users/?type=doctor").then((response) => {
            console.log(response);
            response.forEach(doctor => {
                console.log(response[0]);
                const option = document.createElement("option");
                option.value = doctor.id;
                option.innerHTML = doctor.user.last_name + " " + doctor.user.first_name;
                doctorsSelect.appendChild(option);
            });
        });
    }
    else {
        loginFormElement.style.height = loginFormElement.offsetHeight - 100 + "px";
        doctorsBlock.classList.add("hidden");
    }
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
//# sourceMappingURL=registration.js.map