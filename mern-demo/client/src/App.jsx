import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const API_URL =
    "https://didactic-adventure-5gqwq7v5gwwq279x7-5000.app.github.dev";

  // =========================
  // CÂU 47: LẤY DANH SÁCH
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/students`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể kết nối đến Backend");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        setMessage("❌ Không thể tải danh sách sinh viên");
      });
  }, []);

  // =========================
  // CÂU 49: THÊM SINH VIÊN
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newStudent = {
      studentId: studentId,
      name: name,
      email: email,
    };

    fetch(`${API_URL}/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể thêm sinh viên");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sinh viên đã thêm:", data);

        // Thêm vào danh sách
        setStudents((prevStudents) => [...prevStudents, data]);

        // Thông báo
        setMessage("✅ Thêm sinh viên thành công!");

        // Xóa Form
        setStudentId("");
        setName("");
        setEmail("");
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        setMessage("❌ Có lỗi xảy ra khi thêm sinh viên!");
      });
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <p className="subtitle">STUDENT MANAGEMENT SYSTEM</p>
          <h1>Quản lý sinh viên</h1>
          <p className="description">
            Quản lý thông tin sinh viên bằng React, Node.js và MongoDB Atlas
          </p>
        </div>

        <div className="student-count">
          <span>{students.length}</span>
          <small>Sinh viên</small>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        {/* FORM */}
        <section className="form-card">
          <div className="card-title">
            <div className="icon">+</div>
            <div>
              <h2>Thêm sinh viên</h2>
              <p>Nhập thông tin sinh viên mới</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              {/* MSSV */}
              <div className="form-group">
                <label>Mã số sinh viên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 235827"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>

              {/* HỌ TÊN */}
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div className="form-group full">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Ví dụ: nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>

            <button className="submit-btn" type="submit">
              <span>＋</span>
              Thêm sinh viên
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <div className="message">
              {message}
            </div>
          )}
        </section>

        {/* LIST */}
        <section className="list-section">

          <div className="list-header">
            <div>
              <h2>Danh sách sinh viên</h2>
              <p>Thông tin sinh viên hiện có trong hệ thống</p>
            </div>

            <div className="total">
              Tổng: <strong>{students.length}</strong>
            </div>
          </div>

          {/* STUDENT CARDS */}
          <div className="students-grid">

            {students.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <h3>Chưa có sinh viên</h3>
                <p>Hãy thêm sinh viên đầu tiên vào hệ thống.</p>
              </div>
            ) : (
              students.map((student, index) => (
                <div className="student-card" key={student._id}>

                  <div className="student-top">
                    <div className="avatar">
                      {student.name
                        ? student.name.charAt(0).toUpperCase()
                        : "S"}
                    </div>

                    <div>
                      <span className="student-number">
                        #{index + 1}
                      </span>

                      <h3>{student.name}</h3>
                    </div>
                  </div>

                  <div className="student-info">

                    <div className="info-row">
                      <span className="label">MSSV</span>
                      <span className="value">
                        {student.studentId}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Email</span>
                      <span className="value">
                        {student.email}
                      </span>
                    </div>

                  </div>

                </div>
              ))
            )}

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <p>Student Management System © 2026</p>
        <span>React • Node.js • MongoDB Atlas</span>
      </footer>
    </div>
  );
}

export default App;