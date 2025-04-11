//-----------------------------------lock system-------------------------------------
import { copy } from "./copy.js"; copy();
let body, value, edit_content, lock_system_timer, lock_system, form_for_lock_system, password_for_locksystem;
value = false;
lock_system = document.querySelector(".lock_system");
form_for_lock_system = document.getElementById("form_for_lock_system");
edit_content = document.getElementById("edit_content");
edit_content.remove();
lock_system_timer = document.getElementById("lock_system_timer");
lock_system_timer.remove();
body = document.getElementById("body");

//---------------------------- start the timer for lock system -------------------------------
async function stfls() {
    try {
        let response = await fetch("/start_time_for_lock_system", {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
        if (response.ok) {
            let data = await response.json();
            if (data.chance == 0) {
                form_for_lock_system.reset();
                lock_system.remove();
                document.body.appendChild(lock_system_timer);
                lsts()
            }
        }
    } catch (err) {
        console.error(err);
    }
}
//------------------------- end start the timer for lock system ------------------------------

//---------------------------- lock system timer status render -------------------------------
async function lsts() {
    try {
        let response = await fetch("/lock_system_timer_status", {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
        if (response.ok) {
            let data = await response.json();
            lock_system_timer.innerText = Math.floor(data.time / 1000);
            if (data.time > 0) {
                setTimeout(lsts, 1000);
                lock_system.remove();
                document.body.appendChild(lock_system_timer);
            }
            if (data.time === 0) {
                document.body.appendChild(lock_system);
                lock_system_timer.remove();
            }
        }
    } catch (err) {
        console.error(err);
    }

}
lsts();
//----------------------------- end lock system timer status render --------------------------

//---------------------------- lock system reset ---------------------------------------------
async function reset() {//lock system reset
    try {
        let response = await fetch("/reset", {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
        if (response.ok) {
            let data = await response.json();
        }
    } catch (err) {
        console.error(err);
    }

}
//---------------------------- end lock system reset -----------------------------------------

form_for_lock_system.addEventListener("submit", async (e) => {
    e.preventDefault();
    password_for_locksystem = document.getElementById("password_for_locksystem").value;
    try {
        const response = await fetch("/locksystem", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: password_for_locksystem })
        })
        if (response.ok) {
            const results = await response.json();
            if (results.value) {
                reset()
                lock_system.remove();
                value = results.value;
                [body, edit_content].forEach((element) => {
                    element.style.display = "flex";
                    element.style.flexDirection = "column";
                    element.style.gap = "10px";
                })
                body.style.height = "auto";
                edit_content.style.justifyContent = "center";
                edit_content.style.alignItems = "center";
                document.body.appendChild(edit_content);
                if (value) {
                    async function calling_Projects() {
                        loader9(true);
                        const response = await fetch("/projects");
                        let project_id = document.getElementById("project-id");
                        let change_element = document.getElementById("change_element");
                        change_element.disabled = true;
                        console.log(response.status);
                        if (response.ok) {
                            const data = await response.json();
                            console.log(data);
                            if (data.length === 0) {
                                edit_content.style.display = "none";
                                console.log("ZERO");
                                let H1 = document.createElement("h1");
                                let link = document.createElement("a");
                                H1.innerText = "No data available!";
                                link.href = "./";
                                link.textContent = "HOME";
                                link.style.position = "absolute";
                                link.style.top = "10px";
                                link.style.right = "10px";
                                document.body.append(H1, link);
                                loader9(false);
                                return;
                            }
                            loader9(false);
                            data.forEach(ids => {
                                project_id.innerHTML += `<option value =${ids._id}>${ids._id}</option>`;
                            });
                        } else {
                            console.error("Error in fetching!");
                        }
                    }
                    calling_Projects()

                    function projects_id() {
                        let project_id = document.getElementById("project-id");
                        project_id.addEventListener("change", async function () {
                            console.log(project_id.value);
                            const response = await fetch(`/projects/${project_id.value}`);
                            console.log(response.status);
                            if (response.ok) {
                                const results = await response.json();
                                console.log(results);
                                change_element.disabled = false;
                                //-----------------------------------------------------------------------------
                                change_element.addEventListener("change", async function () {
                                    console.log(change_element.value);
                                    //-------------------------------------------------------------------------
                                    if (change_element.value === "title") {
                                        update_("title", results.data, project_id.value);
                                    }
                                    if (change_element.value === "githublink") {
                                        update_("github", results.data, project_id.value);
                                    }
                                    if (change_element.value === "weblink") {
                                        update_("weblink", results.data, project_id.value);
                                    }
                                    if (change_element.value === "technologies") {
                                        update_("technologies", results.data, project_id.value);
                                    }
                                    if (change_element.value === "lastupdate") {
                                        update_("lastupdate", results.data, project_id.value);
                                    }
                                    if (change_element.value === "description") {
                                        update_("description", results.data, project_id.value);
                                    }
                                    if (change_element.value === "images") {
                                        if (results.data.files) {
                                            const images_edit = document.getElementById("images_edit");
                                            images_edit.style.display = "flex";
                                            const images_edit2 = document.getElementById("images_edit2");
                                            images_edit2.style.display = "flex";
                                            images_edit2.style.flexWrap = "wrap";
                                            const uploadtheImg = document.getElementById("uploadtheImg");
                                            uploadtheImg.addEventListener("change", function () {
                                                console.log(uploadtheImg.value);
                                                //file id and button ---------------------------------------------
                                                const form_image_loptop = document.getElementById("form_image_loptop");
                                                const upload1 = document.getElementById("upload1");
                                                if (uploadtheImg.value === "insert") {
                                                    images_edit2.style.display = " none";
                                                    form_image_loptop.style.display = "flex";
                                                    upload1.style.display = "flex";
                                                    //-----------inserting the file -------------------------------
                                                    form_image_loptop.addEventListener("submit", async function (E) {
                                                        E.preventDefault();
                                                        loader6(true);
                                                        const formData = new FormData();
                                                        let id = results.data._id;
                                                        console.log(id)
                                                        appendFiles("images-loptop");
                                                        appendFiles("videos-loptop");
                                                        appendFiles("images-tab");

                                                        const response = await fetch(`/insertIMG/${id}`, {
                                                            method: "POST",
                                                            body: formData,
                                                        })
                                                        console.log(response.status);
                                                        if (response.ok) {
                                                            const results = await response.json();
                                                            loader6(false)
                                                            notification("successful img inserted");
                                                            console.log(results);
                                                        } else {
                                                            console.error("error");
                                                        }
                                                        function appendFiles(fieldNames) {
                                                            const files = document.getElementById(fieldNames).files;
                                                            for (let i = 0; i < files.length; i++) {
                                                                formData.append(fieldNames, files[i]);
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    form_image_loptop.style.display = "none";
                                                    upload1.style.display = "none";
                                                    images_edit2.style.display = " flex"
                                                }
                                            });

                                            console.log(results.data.files)
                                            Object.keys(results.data.files).forEach(img => {
                                                console.log(results.data.files[img]);
                                                results.data.files[img].forEach(el => {
                                                    console.log("ELEMENTS", el)
                                                    const wrapper = document.createElement("div");
                                                    wrapper.className = "image-wrapper";
                                                    const imageElement = document.createElement("img");
                                                    imageElement.src = `data:image/png;base64,${el.buffer}`;
                                                    imageElement.alt = "IMG";
                                                    imageElement.width = 100;
                                                    const checkbox = document.createElement("input");
                                                    checkbox.type = "checkbox";
                                                    checkbox.name = "check";
                                                    checkbox.addEventListener("change", async function () {
                                                        if (checkbox.checked) {
                                                            let id = results.data._id;
                                                            loader7(true);
                                                            console.log(el.fieldname, el.originalname, results.data._id);
                                                            const response = await fetch(`/deleteIMG/${id}`, {
                                                                method: "DELETE",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ fieldname: el.fieldname, originalname: el.originalname })
                                                            })
                                                            console.log(response.status);
                                                            if (response.ok) {
                                                                const data = await response.json();
                                                                loader7(false)
                                                                notification("successful img deleted");
                                                                console.log(data);
                                                            } else {
                                                                console.error("errro");
                                                            }
                                                        }
                                                    })

                                                    wrapper.appendChild(imageElement);
                                                    wrapper.appendChild(checkbox);

                                                    images_edit2.appendChild(wrapper);

                                                });
                                            });
                                        }
                                    }
                                    if (change_element.value == "delete_Project") {
                                        const confirmation = confirm("deleting the project!");
                                        if (confirmation) {
                                            const id = project_id.value;
                                            loader8(true);
                                            console.log(id);
                                            try {
                                                const response = await fetch(`/delProject/${id}`, {
                                                    method: "DELETE",
                                                    headers: { "Content-Type": "application/json" },
                                                });
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    console.log(data);
                                                    loader8(false);
                                                    setTimeout(() => {
                                                        location.reload()
                                                    }, 500)
                                                }
                                            } catch (error) {
                                                console.error("error");
                                            }
                                        } else {
                                            console.log("deletation CANCELD!")
                                        }
                                    }
                                })
                            } else {
                                console.error("Error in fetching!");
                            }
                        })
                    }
                    projects_id();
                }
            } else {
                stfls();//when password was invalid. then call stfls() start timer for lock system.
                let Invalid_message = document.getElementById("Invalid_message");
                Invalid_message.style.display = "block";
                setTimeout(() => {
                    form_for_lock_system.reset();
                    Invalid_message.style.display = "none";
                }, 1000);
            }
        } else {
            console.error("post in locksystem error");
        }
    } catch (error) {
        console.error(error);
    }
});

async function update_(update_item, results, project_id) {
    console.log(results[update_item])
    if (results) {
        let item_arr = items_value(update_item);
        console.log(project_id);
        const _item = document.getElementById(item_arr[0]);
        _item.style.display = "flex";
        _item.value = results[update_item];
        const _item1 = document.getElementById(item_arr[1]);
        _item1.style.display = "flex";
        //----------------------------------------------------------------
        document.getElementById(item_arr[2]).addEventListener("submit", async function (E) {
            disable([_item, _item1]);
            E.preventDefault();
            loader(true, item_arr[1]);
            const response = await fetch(`/editProjects/${project_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Sending data as JSON
                },
                body: JSON.stringify({ [update_item]: _item.value })
            });
            console.log(response.status);
            if (response.ok) {
                const data = await response.json();
                loader(false, item_arr[1])
                notification(`successful ${update_item} updated`);
                console.log(data);
            } else {
                console.log("error");
            }

        })
    }
}

function items_value(items_value) {
    if (items_value == "title") {
        return ["title", "update", "editformtitle"];
    } else if (items_value == "github") {
        return ["githublink", "update2", "editformgithublink"];
    } else if (items_value == "weblink") {
        return ["weblink", "update3", "editformweblink"];
    } else if (items_value == "technologies") {
        return ["tech", "update4", "editformtech"];
    } else if (items_value == "lastupdate") {
        return ["lastupdate", "update5", "editformlastupdate"];
    } else if (items_value == "description") {
        return ["projectdescription", "update6", "editformprojectdescription"]
    }
}

function loader(value, update) {
    let loader_wrapper = document.getElementById("loader_wrapper");
    let update_btn = document.getElementById(update);
    if (value) {
        loader_wrapper.style.display = "flex";
        update_btn.innerText = '';
        update_btn.style.padding = "8px";
        update_btn.appendChild(loader_wrapper);
    } else {
        loader_wrapper.style.display = "none";
        update_btn.innerText = "Update";
        update_btn.style.padding = "5px";
        setTimeout(() => {
            location.reload();
        }, 2100);

    }
}

function loader6(value) {
    let loader_wrapper = document.getElementById("loader_wrapper");
    let upload1 = document.getElementById("upload1");
    if (value) {
        loader_wrapper.style.display = "flex";
        upload1.innerText = '';
        upload1.style.padding = "8px";
        upload1.appendChild(loader_wrapper);
    } else {
        loader_wrapper.style.display = "none";
        upload1.innerText = "Update";
        upload1.style.padding = "5px";
        setTimeout(() => {
            location.reload();
        }, 2100);

    }
}

function loader7(value) {
    let loader_wrapper = document.getElementById("loader_wrapper");
    let images_edit2 = document.getElementById("images_edit2");
    if (value) {
        loader_wrapper.style.display = "flex";
        images_edit2.style.alignItems = "center";
        images_edit2.appendChild(loader_wrapper);
    } else {
        loader_wrapper.style.display = "none";
        setTimeout(() => {
            location.reload();
        }, 2100);

    }
}

function loader8(value) {
    let loader_wrapper = document.getElementById("loader_wrapper");
    if (value) {
        loader_wrapper.style.display = "flex";
        document.body.appendChild(loader_wrapper);
    } else {
        loader_wrapper.style.display = "none";
        setTimeout(() => {
            location.reload();
        }, 2100);

    }
}

function loader9(value) {
    let loader_wrapper = document.getElementById("loader_wrapper");
    if (value) {
        loader_wrapper.style.display = "flex";
        document.body.appendChild(loader_wrapper);
    } else {
        loader_wrapper.style.display = "none";
    }
}

function notification(message) {
    let notification = document.getElementById("notification");
    let notification_info = document.getElementById("notification_info");
    notification.style.display = "flex";
    notification.style.transition = "All";
    notification.style.transitionDuration = "0.3s";
    notification.style.transform = "translateX(0px)";
    notification.style.top = "15px";
    notification.style.left = "0px";
    notification_info.innerText = message;
    setTimeout(() => {
        notification.style.transform = "translateX(-150vw)";
    }, 2000)
}

function disable(array) {
    array.forEach(element => {
        element.disabled = true;
    });
}