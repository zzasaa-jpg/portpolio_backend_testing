//-----------------------------------lock system-------------------------------------
import { copy } from "./copy.js";
copy();
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
                    async function a() {
                        loader9(true)
                        const response = await fetch("/projects");
                        let project_id = document.getElementById("project-id");
                        let change_element = document.getElementById("change_element");
                        change_element.disabled = true;
                        console.log(response.status);
                        if (response.ok) {
                            const data = await response.json();
                            console.log(data);
                            loader9(false)
                            data.forEach(ids => {
                                project_id.innerHTML += `<option value =${ids._id}>${ids._id}</option>`;
                            });
                        } else {
                            console.error("Error in fetching!");
                        }
                    }
                    a()

                    function projects_id() {
                        let project_id = document.getElementById("project-id");
                        project_id.addEventListener("change", async function () {
                            // console.log(project_id.value);
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
                                        if (results.data.title) {
                                            console.log(project_id.value)
                                            const title = document.getElementById("title");
                                            title.style.display = "flex";
                                            title.value = results.data.title;
                                            const update = document.getElementById("update");
                                            update.style.display = "flex";
                                            //----------------------------------------------------------------
                                            document.getElementById("editformtitle").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader(true);
                                                let updateTitle = title.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json" // Sending data as JSON
                                                    },
                                                    body: JSON.stringify({ title: updateTitle })
                                                });
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader(false)
                                                    notification("successful title updated");
                                                    console.log(data);
                                                } else {
                                                    console.log("error");
                                                }

                                            })
                                        }
                                    }
                                    if (change_element.value === "githublink") {
                                        if (results.data.github) {
                                            const githublink = document.getElementById("githublink");
                                            githublink.style.display = "flex";
                                            githublink.value = results.data.github;
                                            const update2 = document.getElementById("update2");
                                            update2.style.display = "flex";
                                            document.getElementById("editformgithublink").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader1(true);
                                                let updateGithublink = githublink.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    body: JSON.stringify({ github: updateGithublink })
                                                })
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader1(false)
                                                    notification("successful github updated");
                                                    console.log(data);
                                                } else {
                                                    console.error("error");
                                                }
                                            })
                                        }
                                    }
                                    if (change_element.value === "weblink") {
                                        if (results.data.weblink) {
                                            const weblink = document.getElementById("weblink");
                                            weblink.style.display = "flex";
                                            weblink.value = results.data.weblink;
                                            const update3 = document.getElementById("update3");
                                            update3.style.display = "flex";
                                            document.getElementById("editformweblink").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader2(true);
                                                let updateWeblink = weblink.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ weblink: updateWeblink })
                                                })
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader2(false)
                                                    notification("successful weblink updated");
                                                    console.log(data);
                                                } else {
                                                    console.error("Error");
                                                }
                                            })
                                        }
                                    }
                                    if (change_element.value === "technologies") {
                                        if (results.data.technologies) {
                                            const tech = document.getElementById("tech");
                                            tech.style.display = "flex";
                                            tech.value = results.data.technologies;
                                            const update4 = document.getElementById("update4");
                                            update4.style.display = "flex";
                                            document.getElementById("editformtech").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader3(true);
                                                let updateTech = tech.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ technologies: updateTech })
                                                })
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader3(false)
                                                    notification("successful techs updated");
                                                    console.log(data);
                                                } else {
                                                    console.log("ERROR")
                                                }
                                            })
                                        }
                                    }
                                    if (change_element.value === "lastupdate") {
                                        if (results.data.lastupdate) {
                                            const lastupdate = document.getElementById("lastupdate");
                                            lastupdate.style.display = "flex";
                                            lastupdate.value = results.data.lastupdate;
                                            let update5 = document.getElementById("update5");
                                            update5.style.display = "flex";
                                            document.getElementById("editformlastupdate").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader4(true);
                                                let updateLastUpdate = lastupdate.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ lastupdate: updateLastUpdate })
                                                })
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader4(false)
                                                    notification("successful last updated");
                                                    console.log(data);
                                                } else {
                                                    console.error("error");
                                                }
                                            })
                                        }
                                    }
                                    if (change_element.value === "description") {
                                        if (results.data.description) {
                                            const projectdescription = document.getElementById("projectdescription");
                                            projectdescription.style.display = "flex";
                                            projectdescription.value = results.data.description;
                                            let update6 = document.getElementById("update6");
                                            update6.style.display = "flex";
                                            document.getElementById("editformprojectdescription").addEventListener("submit", async function (E) {
                                                E.preventDefault();
                                                loader5(true);
                                                let updateProjectDescription = projectdescription.value;
                                                const response = await fetch(`/editProjects/${project_id.value}`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ description: updateProjectDescription })
                                                })
                                                console.log(response.status);
                                                if (response.ok) {
                                                    const data = await response.json();
                                                    loader5(false)
                                                    notification("successful descrp updated");
                                                    console.log(data);
                                                } else {
                                                    console.error("error");
                                                }
                                            })
                                        }
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
                                                            notification("successful img iserted");
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
                                            console.log(id)
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
                    projects_id()

                    function notification(message) {
                        let notification = document.getElementById("notification");
                        let notification_info = document.getElementById("notification_info");
                        notification.style.display = "flex";
                        notification.style.transition = "All";
                        notification.style.transitionDuration = "0.3s";
                        notification.style.transform = "translateX(0px)";
                        notification.style.top = "15px";
                        notification.style.left = "10px";
                        notification_info.innerText = message;
                        setTimeout(() => {
                            notification.style.transform = "translateX(-950px)";
                        }, 2000)
                    }

                    function loader(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update = document.getElementById("update");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update.innerText = '';
                            update.style.padding = "8px";
                            update.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update.innerText = "Update";
                            update.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);

                        }
                    }

                    function loader1(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update2 = document.getElementById("update2");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update2.innerText = '';
                            update2.style.padding = "8px";
                            update2.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update2.innerText = "Update";
                            update2.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);

                        }
                    }

                    function loader2(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update3 = document.getElementById("update3");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update3.innerText = '';
                            update3.style.padding = "8px";
                            update3.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update3.innerText = "Update";
                            update3.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);

                        }
                    }

                    function loader3(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update4 = document.getElementById("update4");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update4.innerText = '';
                            update4.style.padding = "8px";
                            update4.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update4.innerText = "Update";
                            update4.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);

                        }
                    }

                    function loader4(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update5 = document.getElementById("update5");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update5.innerText = '';
                            update5.style.padding = "8px";
                            update5.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update5.innerText = "Update";
                            update5.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);

                        }
                    }

                    function loader5(value) {
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let update6 = document.getElementById("update6");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            update6.innerText = '';
                            update6.style.padding = "8px";
                            update6.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            update6.innerText = "Update";
                            update6.style.padding = "5px";
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