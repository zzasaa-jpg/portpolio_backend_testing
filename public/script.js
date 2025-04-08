//-----------------------------------lock system-------------------------------------
import { copy } from "./copy.js";
copy();
let body, value, upload_content, lock_system_timer, lock_system, form_for_lock_system, password_for_locksystem;
value = false;
lock_system = document.querySelector(".lock_system");
form_for_lock_system = document.getElementById("form_for_lock_system");
upload_content = document.getElementById("upload_content");
upload_content.remove();
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
        let response = await fetch("http://localhost:9090/reset", {
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
                [body, upload_content].forEach((element) => {
                    element.style.display = "flex";
                    element.style.flexDirection = "column";
                });
                body.style.justifyContent = "center";
                body.style.alignItems = "center";
                document.body.appendChild(upload_content);
                if (value) {
                    document.getElementById("form").addEventListener("submit", sendData);
                    async function sendData(E) {
                        E.preventDefault();
                        loader(true);
                        const formDta = new FormData();
                        formDta.append("title", document.getElementById("title").value);
                        formDta.append("weblink", document.getElementById("weblink").value);
                        formDta.append("technologies", document.getElementById("tech").value);
                        formDta.append("github", document.getElementById("githublink").value);
                        formDta.append("lastupdate", document.getElementById("lastupdate").value);
                        formDta.append("description", document.getElementById("projectdescription").value);

                        appendFiles("images-loptop");
                        appendFiles("videos-loptop");
                        appendFiles("images-tab");

                        const response = await fetch("/storedata", {
                            method: "POST",
                            body: formDta,
                        });
                        console.log("responseStatus:", response.status);
                        if (response.ok) {
                            const results = await response.json();
                            loader(false);
                            notification("successful data Stored!");
                            console.log(results);
                        } else {
                            console.error("Failed")
                        }

                        function appendFiles(fieldName) {
                            const files = document.getElementById(fieldName).files;
                            for (let i = 0; i < files.length; i++) {
                                formDta.append(fieldName, files[i]);
                            }
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
                        notification.style.left = "10px";
                        notification_info.innerText = message;
                        notification.style.zIndex = "4";
                        setTimeout(() => {
                            notification.style.transform = "translateX(-450px)";
                        }, 2000)
                    }

                    function loader(value) {
                        let form = document.getElementById("form");
                        let loader_wrapper = document.getElementById("loader_wrapper");
                        let submit = document.getElementById("submit");
                        if (value) {
                            loader_wrapper.style.display = "flex";
                            submit.innerText = '';
                            submit.style.padding = "8px";
                            submit.appendChild(loader_wrapper);
                        } else {
                            loader_wrapper.style.display = "none";
                            submit.innerText = "Submit";
                            submit.style.padding = "5px";
                            setTimeout(() => {
                                location.reload();
                            }, 2100);
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