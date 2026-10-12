
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

const app = express();

// Ghi log cac request HTTP - Cau 77
app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );
    next();
});

// Cau hinh CORS
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin khong duoc phep boi CORS"));
    },
    credentials: true
}));

app.use(express.json());

// Kiem tra Backend
app.get("/api/hello", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// READ: Lay danh sach sinh vien
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("GET students error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// CREATE: Them sinh vien
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        console.log("Created student:", student._id);
        res.status(201).json(student);
    } catch (error) {
        console.error("POST students error:", error.message);
        res.status(400).json({ message: error.message });
    }
});

// UPDATE: Cap nhat sinh vien
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log("Updated student:", student._id);
        res.json(student);
    } catch (error) {
        console.error("PUT students error:", error.message);
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Xoa sinh vien
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        console.log("Deleted student:", student._id);
        res.json({
            message: "Student deleted successfully",
            student: student
        });
    } catch (error) {
        console.error("DELETE students error:", error.message);
        res.status(400).json({ message: error.message });
    }
});

// Ket noi MongoDB Atlas
const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI environment variable!");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
