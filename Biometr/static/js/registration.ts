const BASE_URL = "http://77.232.138.70:8000/"
const BASE_URL_API = "http://77.232.138.70:8000/api/v1/"

window.onload = function () {
    const registerButton = document.getElementById("register_btn") as HTMLInputElement
    const passwordField = document.getElementById("password") as HTMLInputElement
    const passwordAgainField = document.getElementById("password_again") as HTMLInputElement
    const typeSelect = document.getElementById("type") as HTMLInputElement
    const usernameField = document.getElementById("username") as HTMLInputElement
    const emailField = document.getElementById("email") as HTMLInputElement
    const doctorsSelect = document.getElementById("doctors_select") as HTMLInputElement
    const doctorsBlock = document.getElementById("doctors_block") as HTMLInputElement
    const loginFormElement = document.getElementById("login_form") as HTMLElement

    registerButton?.addEventListener("click", (event) => {
        onRegister(
            event,
            usernameField,
            passwordField,
            passwordAgainField,
            emailField,
            typeSelect,
            doctorsSelect
        )
    }, false)
    passwordField?.addEventListener("change", () => { passwordCheckAndColor(passwordField, passwordAgainField) }, false)
    passwordField?.addEventListener("input", () => { passwordCheckAndColor(passwordField, passwordAgainField) }, false)
    passwordAgainField?.addEventListener("change", () => { passwordCheckAndColor(passwordField, passwordAgainField) }, false)
    passwordAgainField?.addEventListener("input", () => { passwordCheckAndColor(passwordField, passwordAgainField) }, false)
    usernameField?.addEventListener("change", () => { usernameCheck(usernameField) }, false)
    usernameField?.addEventListener("input", () => { usernameCheck(usernameField) }, false)
    emailField?.addEventListener("input", () => { emailCheck(emailField) }, false)
    emailField?.addEventListener("change", () => { emailCheck(emailField) }, false)
    typeSelect?.addEventListener("change", () => {
        onTypeSelectChange(
            typeSelect,
            doctorsBlock,
            doctorsSelect,
            loginFormElement
        )
    }, false)
}

function onRegister(
    event: MouseEvent,
    usernameField: HTMLInputElement,
    passwordField: HTMLInputElement,
    passwordAgainField: HTMLInputElement,
    emailField: HTMLInputElement,
    typeSelect: HTMLInputElement,
    doctorsSelect: HTMLInputElement,
) {
    event.preventDefault()
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
            } else {
                alert("Логин занят")
            }
            
        })
    }
    else {
        alert("Поля заполнены неправильно")
    }
}

function emailCheck(emailField: HTMLInputElement): boolean {
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    if (validateEmail(emailField.value)) {
        emailField.style.backgroundColor = "#D2F7B5"
        return true
    } else {
        emailField.style.backgroundColor = "#F5C5C5"
        return false
    }
}



function passwordCheckAndColor(password: HTMLInputElement, passwordAgain: HTMLInputElement) {
    if (password.value === passwordAgain.value && password.value.length >= 4) {
        password.style.backgroundColor = "#D2F7B5"
        passwordAgain.style.backgroundColor = "#D2F7B5"
        return true
    } else {
        password.style.backgroundColor = "#F5C5C5"
        passwordAgain.style.backgroundColor = "#F5C5C5"
        return false
    }
}

function usernameCheck(usernameField: HTMLInputElement): boolean {
    if (usernameField.value.length >= 4) {
        usernameField.style.backgroundColor = "#D2F7B5"
        return true
    } else {
        usernameField.style.backgroundColor = "#F5C5C5"
        return false
    }
}

function onTypeSelectChange(
    typeSelect: HTMLInputElement,
    doctorsBlock: HTMLInputElement,
    doctorsSelect: HTMLInputElement,
    loginFormElement: HTMLElement
) {
    if (typeSelect.value == "patient") {
        doctorsBlock.classList.remove("hidden")
        loginFormElement.style.height = loginFormElement.offsetHeight + 100 + "px"
        getDataFromApi(BASE_URL_API + "users/?type=doctor").then((response) => {
            console.log(response)
            response.forEach(doctor => {
                console.log(response[0])
                const option = document.createElement("option")
                option.value = doctor.id
                option.innerHTML = doctor.user.last_name + " " + doctor.user.first_name
                doctorsSelect.appendChild(option)
            });
        })
    } else {
        loginFormElement.style.height = loginFormElement.offsetHeight - 100 + "px"
        doctorsBlock.classList.add("hidden")
    }
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

function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}