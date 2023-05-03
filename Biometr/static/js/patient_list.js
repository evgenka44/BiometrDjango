var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPatientId = null;
let currentUserId = null;
let currentUser = null;
const selectedClass = "patient_card__selected";
const BASE_URL = "http://127.0.0.1:8000/";
const BASE_URL_API = "http://127.0.0.1:8000/api/v1/";
const editableFields = ["anamnesis", "diagnosis"];
window.onload = function () {
    const logoutButton = document.getElementById("logout_btn");
    let currentUserId = document.getElementById("user_id").textContent;
    logoutButton.addEventListener("click", logout, false);
    getDataFromApi(BASE_URL_API + "users/" + currentUserId + "/").then((user) => {
        currentUser = user;
        if (user.type === "patient") {
            fillPatientCard(currentUserId);
        }
        else {
            const patientsListHtml = document.getElementById("patient_list").children;
            addListenersToEditIcons();
            try {
                onPatientClick(patientsListHtml[0].id);
                for (var i = 0; i < patientsListHtml.length; i++) {
                    const patientId = patientsListHtml[i].id;
                    const avatar = patientsListHtml[i].getElementsByClassName("avatar")[0];
                    getDataFromApi(BASE_URL_API + "users/" + patientId + "/").then((user) => {
                        console.log(user);
                        console.log("avatar=" + user.avatar);
                        console.log(avatar[0]);
                        if (user.avatar === null) {
                            avatar[0].src = "../static/image/no_photography.png";
                        }
                        else {
                            avatar[0].src = user.avatar;
                        }
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    });
};
function logout() {
    getDataFromApi(BASE_URL + "logout/").then((isSuccess) => {
        if (isSuccess) {
            window.location.replace("http://127.0.0.1:8000/login/");
        }
    });
}
function addListenersToEditIcons() {
    for (const i in editableFields) {
        const editable = editableFields[i];
        const iconId = editable + "_edit_icon";
        document.getElementById(iconId)
            .addEventListener("click", function onEdit() { onEditIcon(iconId, editable, onEdit); }, false);
    }
}
function onEditIcon(editIconId, elementId, onEdit) {
    console.log("onEditIcon");
    const text = document.getElementById(elementId);
    const field = document.createElement("textarea");
    field.classList.add("information_block__description");
    field.value = text.innerText;
    field.rows = 10;
    text.parentNode.replaceChild(field, text);
    const icon = document.getElementById(editIconId);
    icon.src = "../static/image/save_icon.png";
    icon.width = 35;
    icon.height = 35;
    icon.removeEventListener("click", onEdit, false);
    icon.addEventListener("click", function onSave() { onSaveIconClick(elementId, field, text, icon, onSave, onEdit); });
}
function onSaveIconClick(fieldName, field, text, icon, onSave, onEdit) {
    const requestBody = JSON.parse("{\"" + fieldName + "\":\"" + field.value + "\"}");
    sendRequestApi(BASE_URL_API + "users/" + currentPatientId + "/", requestBody, "PATCH").then((user) => {
        console.log(user);
        text.innerText = field.value;
        field.parentNode.replaceChild(text, field);
        icon.src = "../static/image/edit_icon.png";
        icon.width = 50;
        icon.height = 50;
        icon.removeEventListener("click", onSave, false);
        icon.addEventListener("click", onEdit, false);
    });
}
function fillPatientCard(id) {
    currentPatientId = id;
    const name = document.getElementById("name");
    const dateOfBirth = document.getElementById("date_of_birth");
    const anamnesis = document.getElementById("anamnesis");
    const diagnosis = document.getElementById("diagnosis");
    const address = document.getElementById("address");
    const equipments = document.getElementById("equipments");
    const bigAvatar = document.getElementById("big_avatar");
    getDataFromApi(BASE_URL_API + "users/" + id + "/").then((user) => {
        console.log(user);
        if (user.avatar === null) {
            bigAvatar.src = "../static/image/no_photography.png";
        }
        else {
            bigAvatar.src = user.avatar;
        }
        name.innerText = user.surname + " " + user.firstname + " " + user.middlename;
        dateOfBirth.innerText = " " + user.date_of_birth;
        anamnesis.innerText = user.anamnesis;
        diagnosis.innerText = user.diagnosis;
        address.innerText = user.address;
        let equipmentHtmlList = "<ul>";
        if (user.equipments.length === 0) {
            equipments.innerHTML = "Показатели отсутствуют";
        }
        else {
            user.equipments.forEach(equipmentId => {
                getDataFromApi(BASE_URL_API + "equipments/" + equipmentId).then((equipment) => {
                    getDataFromApi(BASE_URL_API + "values/search?" + "equipment_id=" + equipment.id + "&user_id=" + user.id)
                        .then((valueList) => {
                        let valuesHtml = "<ul>";
                        valueList.forEach(value => {
                            let valueHtml = "<li class=\"equipment_item__values_item\">";
                            valueHtml += "Значение:" + value.value + "\n";
                            valueHtml += "Время:" + value.time.slice(0, -1).replace("T", " ");
                            valueHtml += "</li>";
                            valuesHtml += valueHtml;
                        });
                        valuesHtml += "</ul>";
                        equipmentHtmlList += "<li class=\"equipment_item\">"
                            + "<div class =\"equipment_item__content\">"
                            + "<div class=\"equipment_item__title\">"
                            + equipment.name
                            + "</div>"
                            + "<div class=\"equipment_item__values\">"
                            + valuesHtml
                            + "</div>"
                            + "</div>"
                            + "</li>";
                        equipments.innerHTML = equipmentHtmlList;
                    });
                });
            });
        }
    });
}
function onPatientClick(id) {
    if (currentPatientId !== null) {
        document.getElementById(currentPatientId).classList.remove(selectedClass);
    }
    const patientCard = document.getElementById(id);
    patientCard.classList.add(selectedClass);
    fillPatientCard(id);
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
function sendRequestApi(url = "", data, method) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url, {
            method: method,
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
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}
//# sourceMappingURL=patient_list.js.map