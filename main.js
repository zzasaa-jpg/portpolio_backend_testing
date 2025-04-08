require('dotenv').config();
const port = process.env.PORT || 5342;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const bodyParser = require("body-parser");

mongoose.connect(process.env.Mongoose_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 200 * 1024 * 1024 } });

const ProjectSchema = new mongoose.Schema({
    title: process.env.qrFww_1312,
    weblink: process.env.dsfdf_8088,
    technologies: process.env.fesfa_2342,
    github: process.env.bghge_2144,
    lastupdate: process.env.dlote_0999,
    description: process.env.geNtr_6764,
    files: process.env.wewro_5323,
});

const Project = mongoose.model("Projects", ProjectSchema);

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//lock_system
let timer_value = false;
let timer_stamp = null;
let chance = 5;
let value_ = 1;
let update_value = 0.5;
let timeid;

app.post('/locksystem', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password is required!", value: false });
    }

    if (password === process.env.password) {
        res.status(200).json({ message: "Unlocked!", value: true });
    } else {
        res.status(200).json({ message: "Invalid Password!", value: false });
    }
});

app.get('/start_time_for_lock_system', (req, res) => {
    chance = chance - 1;
    if (chance === 0) {
        timer_value = !timer_value;
        timer_stamp = Date.now();
    }
    res.status(200).json({ "chance": chance });
})

app.get('/lock_system_timer_status', (req, res) => {
    if (timer_value) {
        const elapsed = Date.now() - timer_stamp;
        const remaining = Math.max(update_value * 60 * 1000 - elapsed, 0);
        if (remaining === 0) {
            timer_value = false;
            chance = chance + 1;
            value_ = value_ + value_;
            timer_stamp = null;
            if (update_value == 0.5) {
                update_value = 1;
            }
            if (value_ > 2) {
                update_value++;
            }
        }
        res.status(200).json({ "time": remaining });
    } else {
        res.status(200).json({ "time": 0 });
    }

})

app.get('/reset', (req, res) => {
    timer_value = false;
    timer_stamp = null;
    chance = 5;
    value_ = 1;
    update_value = 0.5;
    clearInterval(timeid);
    res.status(200).json({ "status": "reseted!", "chance": chance });
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/storedata", upload.fields([
    { name: "images-loptop", maxCount: 10 },
    { name: "videos-loptop", maxCount: 10 },
    { name: "images-tab", maxCount: 10 },
]), async (req, res) => {
    try {
        const a = { title, weblink, technologies, github, lastupdate, description } = req.body;
        console.log(a)
        const files = req.files;

        const newProject = new Project({
            title,
            weblink,
            technologies,
            github,
            lastupdate,
            description,
            files
        });

        const savedData = await newProject.save();
        console.log("Data saved successfully!", savedData);
        res.status(200).json({ message: "Data saved successfully!", data: savedData })
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "error saving data", error });
    }

})

app.get("/projects", async (req, res) => {
    try {
        const data = await Project.find();
        console.log(data);
        res.send(data);
    } catch (error) {
        console.log("error", error);

    }
});

app.get("/projects/:id", async (req, res) => {
    const project_id = req.params.id;
    console.log(project_id)
    try {
        const data = await Project.findById(project_id);
        console.log("succefully data rendered", data);
        res.status(200).send({ message: "succefully data rendered", data: data });
    } catch (error) {
        console.error("error", error);
        res.status(500).send({ message: "Error for getting data", error: error });
    }
})

app.get("/editProject", (req, res) => {
    res.sendFile(path.join(__dirname, "views/project.html"))
})


app.post("/editProjects/:id", async (req, res) => {
    const project_id = req.params.id;
    console.log(project_id)
    const { title, github, weblink, technologies, lastupdate, description } = req.body;
    try {
        const data = await Project.findByIdAndUpdate(project_id, { title, github, weblink, technologies, lastupdate, description }, { new: true });
        console.log("successfully edit data", data);
        res.status(200).send({ message: "succesfully edited data", data: data });
    } catch (error) {
        console.log("error", error);
        res.stastus(500).send({ message: "not getting data", error: error });
    }
});


app.delete("/deleteIMG/:id", async (req, res) => {
    const id = req.params.id;
    const { originalname, fieldname } = req.body;
    console.log("Request body:", req.body);
    try {
        const data = await Project.findByIdAndUpdate(
            id,
            { $pull: { [`files.${fieldname}`]: { originalname: originalname } } },
            { new: true }
        );
        console.log("Successfully deleted data", data);
        res.status(200).json({ message: "Successfully deleted image!", data: data });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Error deleting the image", error });
    }
});

app.post("/insertIMG/:id", upload.fields([
    { name: "images-loptop", maxCount: 10 },
    { name: "videos-loptop", maxCount: 10 },
    { name: "images-tab", maxCount: 10 }]), async (req, res) => {
        const id = req.params.id;
        const newFiles = req.files;
        try {
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).send({ message: "project not found!" });
            }

            const uploadFiles = { ...project.files };
            for (const key in newFiles) {
                if (!uploadFiles[key]) {
                    uploadFiles[key] = [];
                }
                uploadFiles[key] = uploadFiles[key].concat(newFiles[key]);
            }
            const data = await Project.findByIdAndUpdate(id, { files: uploadFiles }, { new: true });
            console.log(data);
            res.status(200).send({ message: "succesfully IMG added!", data: data });
        } catch (error) {
            console.error("error", error);
            res.status(500).send({ message: "Error in addeding the IMG", error });
        }
    })

app.delete("/delProject/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        const data = await Project.findByIdAndDelete(id);
        console.log("successfully deleted data!", data);
        res.status(200).send({ message: "successfully deleted data!", data: data });
    } catch (error) {
        console.error("error", error);
        res.status(500).send({ message: "Not getting data!", error: error });
    }
})
app.listen(port, () => {
    console.log(`APP RUNNING ON ${port}`);
})