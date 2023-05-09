const BASE_URL = "http://77.232.138.70:8000/"
const BASE_URL_API = "http://77.232.138.70:8000/api/v1/"
const editableFields = ["firstname", "surname", "middlename", "email", "address", "date_of_birth"]
let currentUserId = null
let currentUser = null


window.onload = () => {
    // Image upload
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var img = document.getElementById('big_avatar') as HTMLImageElement
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            }

            const formElem = document.getElementById("avatar_form") as HTMLFormElement
            const formData = new FormData(formElem)
            formData.append("image", this.files[0])
            fetch(BASE_URL_API + "users/" + currentUserId + "/upload_avatar/", {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie("csrftoken"),
                }
            }).then((response) => {
                alert("Аватарка успешно загружена")
            })

            img.src = URL.createObjectURL(this.files[0]);
            document.querySelector("img.avatar").src = img.src
        }
    });
    // ----- 
    currentUserId = document.getElementById("user_id").textContent
    fillMyCard(currentUserId)
    addListenersToEditIcons()
    const passwordButton = document.getElementById("password_btn")
    const oldPassword = document.getElementById("old_password") as HTMLInputElement
    const newPassword = document.getElementById("new_password") as HTMLInputElement
    const newPasswordAgain = document.getElementById("new_password_again") as HTMLInputElement

    passwordButton.addEventListener("click", () => {
        updatePassword(
            oldPassword.value,
            newPassword.value,
            newPasswordAgain.value
        ).then((response) => {
            alert(response)
        })
    }, false
    )

    getDataFromApi(BASE_URL_API + "users/" + currentUserId + "/").then((user) => {
        currentUser = user
        if (currentUser.type === "doctor") {
            buildPatientList()
        } else {
            buildEquipmentList()
        }
    });
}

function buildPatientList() {
    getDataFromApi(BASE_URL_API + "users/?patients_of=" + currentUser.id + "&type=patient").then((patientList) => {
        const patientListHtml = document.getElementById("patient_list")
        for (const i in patientList) {
            const patient = patientList[i]

            const patientCard = document.createElement("div")
            patientCard.classList.add("patient_card")

            const avatar = document.createElement("img")
            avatar.classList.add("avatar")
            avatar.id = "avatar_" + patient.id
            avatar.src = (patient.avatar === null ? "../static/image/no_photography.png" : patient.avatar)

            const fio = document.createElement("span")
            fio.classList.add("patient_card__fio")
            fio.innerText = patient.user.last_name + " " + patient.user.first_name

            const plusIcon = document.createElement("img")
            plusIcon.src = "../static/image/plus_icon.png"
            plusIcon.width = 20
            plusIcon.height = 20
            plusIcon.classList.add("patient_icon")
            plusIcon.addEventListener("click", () => {
                sendRequestApi(BASE_URL_API + "users/" + patient.id + "/", { doctor: currentUser.id }, "PATCH").then(() => {
                    plusIcon.replaceWith(crossIcon)
                })
            }, false)

            const crossIcon = document.createElement("img")
            crossIcon.src = "../static/image/cross_icon.png"
            crossIcon.width = 20
            crossIcon.height = 20
            crossIcon.classList.add("patient_icon")
            crossIcon.addEventListener("click", () => {
                sendRequestApi(BASE_URL_API + "users/" + patient.id + "/", { doctor: null }, "PATCH").then(() => {
                    crossIcon.replaceWith(plusIcon)
                })
            }, false)
            patientCard.appendChild(avatar)
            patientCard.appendChild(fio)
            if (patient.doctor === null) {
                patientCard.appendChild(plusIcon)
            } else {
                patientCard.appendChild(crossIcon)
            }
            patientListHtml.appendChild(patientCard)
        }
    })
}

function buildEquipmentList() {
    getDataFromApi(BASE_URL_API + "equipments/").then((equipmentList) => {
        console.log(currentUser);
        console.log(equipmentList);

        const equipmentListHtml = document.getElementById("equipment_list")
        if (equipmentList.length === 0) {
            alert("Оборудования нет")
        }
        for (const equipment of equipmentList) {
            const equipmentCard = document.createElement("div")
            equipmentCard.classList.add("equipment_card")

            // const avatar = document.createElement("img")
            // avatar.classList.add("avatar")
            // avatar.id = "avatar_" + equipment.id
            // avatar.src = (equipment.avatar === null ? "../static/image/no_photography.png" : equipment.avatar)

            const name = document.createElement("span")
            name.classList.add("equipment_card__fio")
            name.innerText = equipment.name

            const plusIcon = document.createElement("img")
            plusIcon.src = "../static/image/plus_icon.png"
            plusIcon.width = 20
            plusIcon.height = 20
            plusIcon.classList.add("equipment_icon")
            plusIcon.addEventListener("click", () => {
                sendRequestApi(BASE_URL_API + "users/" + currentUser.id + "/", { equipment_id: equipment.id }, "PATCH").then((response) => {
                    plusIcon.replaceWith(crossIcon)
                })
            }, false)

            const crossIcon = document.createElement("img")
            crossIcon.src = "../static/image/cross_icon.png"
            crossIcon.width = 20
            crossIcon.height = 20
            crossIcon.classList.add("equipment_icon")
            crossIcon.addEventListener("click", () => {
                sendRequestApi(BASE_URL_API + "users/" + currentUser.id + "/", { equipment_id: -equipment.id }, "PATCH").then((response) => {
                    crossIcon.replaceWith(plusIcon)
                })
            }, false)
            equipmentCard.appendChild(name)
            if (currentUser.equipments.includes(equipment.id)) {
                equipmentCard.appendChild(crossIcon)
            } else {
                equipmentCard.appendChild(plusIcon)
            }
            equipmentListHtml.appendChild(equipmentCard)
        }
    })
}

function addListenersToEditIcons() {
    for (const editableId in editableFields) {
        const editable = editableFields[editableId]
        const iconId = editable + "_edit_icon"

        document.getElementById(iconId)
            .addEventListener("click", function onEdit() { onEditIcon(iconId, editable, onEdit) }, false)
    }
}

function onEditIcon(editIconId: string, elementId: string, onEdit) {
    console.log("onEditIcon");

    const text = document.getElementById(elementId)

    const field = document.createElement("input")
    field.classList.add("information_block__description")
    field.value = text.innerText

    if (elementId === "date_of_birth") {
        field.type = "date"
    }

    text.parentNode.replaceChild(field, text)
    const icon = document.getElementById(editIconId) as HTMLImageElement
    icon.src = "../static/image/save_icon.png"
    icon.width = 35
    icon.height = 35
    icon.removeEventListener("click", onEdit, false)
    icon.addEventListener("click", function onSave() { onSaveIconClick(elementId, field, text, icon, onSave, onEdit) })
}

function onSaveIconClick(
    fieldName: string,
    field: HTMLInputElement,
    text: HTMLElement,
    icon: HTMLImageElement,
    onSave,
    onEdit,
) {
    const requestBody = JSON.parse("{\"" + fieldName + "\":\"" + field.value + "\"}")

    sendRequestApi(BASE_URL_API + "users/" + currentUserId + "/", requestBody, "PATCH").then((user) => {
        console.log(user);
        text.innerText = field.value
        field.parentNode.replaceChild(text, field)
        icon.src = "../static/image/edit_icon.png"
        icon.width = 50
        icon.height = 50
        icon.removeEventListener("click", onSave, false)
        icon.addEventListener("click", onEdit, false)
    })
}

function fillMyCard(id: number) {
    const firstname = document.getElementById("firstname")
    const surname = document.getElementById("surname")
    const middlename = document.getElementById("middlename")
    const dateOfBirth = document.getElementById("date_of_birth")
    const address = document.getElementById("address")
    const bigAvatar = document.getElementById("big_avatar") as HTMLImageElement
    const email = document.getElementById("email")
    const password = document.getElementById("password")

    getDataFromApi(BASE_URL_API + "users/" + id + "/").then((user) => {
        if (user.avatar === null) {
            bigAvatar.src = "../static/image/no_photography.png"
        } else {
            bigAvatar.src = user.avatar
        }

        firstname.innerText = user.user.first_name
        surname.innerText = user.user.last_name
        middlename.innerText = user.middlename
        email.innerText = user.user.email
        dateOfBirth.innerText = " " + user.date_of_birth
        address.innerText = user.address
    })
}

async function updatePassword(oldPassword: string, newPassword: string, newPasswordAgain: string): Promise<string> {
    if (newPassword != newPasswordAgain) {
        return "Новые пароли не совпадают"
    }
    return postDataToApi(BASE_URL_API + "update_password/", {
        old_password: oldPassword,
        new_password: newPassword
    }).then((response) => {
        if (response) {
            return "Пароль изменён"
        }
        return "Старый пароль введён неправильно"
    })
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

async function sendRequestApi(url = "", data: object, method: string) {
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
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

function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function insertAfter(referenceNode: HTMLElement, newNode: HTMLElement) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}