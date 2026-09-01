import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // STATE
  // =========================
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  // ID sinh viên đang sửa
  const [editingId, setEditingId] = useState(null);

  // Trạng thái loading
  const [loading, setLoading] = useState(false);

  // =========================
  // API URL
  // =========================
  const API_URL =
    "http://localhost:5000"


  // =====================================================
  // CÂU 47 + CÂU 59 + CÂU 63
  // GET - LẤY DANH SÁCH SINH VIÊN
  // =====================================================
  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/students`
      );

      if (!response.ok) {
        throw new Error(
          "Không thể kết nối đến Backend"
        );
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {
      console.error("Lỗi:", error);

      setMessage(
        "❌ Không thể tải danh sách sinh viên"
      );

    } finally {
      setLoading(false);
    }
  };


  // Khi mở trang → gọi GET
  useEffect(() => {
    loadStudents();
  }, []);


  // =====================================================
  // XÓA FORM
  // =====================================================
  const clearForm = () => {
    setStudentId("");
    setName("");
    setEmail("");
    setEditingId(null);
  };


  // =====================================================
  // CÂU 49
  // POST - THÊM SINH VIÊN
  //
  // CÂU 61
  // PUT - CẬP NHẬT SINH VIÊN
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!studentId || !name || !email) {
      setMessage(
        "⚠️ Vui lòng nhập đầy đủ thông tin!"
      );

      return;
    }

    const studentData = {
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim(),
    };


    try {

      // =================================================
      // CÂU 61: PUT - CẬP NHẬT
      // =================================================
      if (editingId) {

        const response = await fetch(
          `${API_URL}/api/students/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(studentData),
          }
        );


        if (!response.ok) {
          throw new Error(
            "Không thể cập nhật sinh viên"
          );
        }


        await response.json();


        setMessage(
          "✅ Cập nhật sinh viên thành công!"
        );


        // Xóa form
        clearForm();


        // CÂU 63:
        // Gọi lại GET sau khi cập nhật
        await loadStudents();

        return;
      }


      // =================================================
      // CÂU 49: POST - THÊM
      // =================================================
      const response = await fetch(
        `${API_URL}/api/students`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(studentData),
        }
      );


      if (!response.ok) {
        throw new Error(
          "Không thể thêm sinh viên"
        );
      }


      await response.json();


      setMessage(
        "✅ Thêm sinh viên thành công!"
      );


      // Xóa form
      clearForm();


      // CÂU 63:
      // Gọi lại GET sau khi thêm
      await loadStudents();

    } catch (error) {

      console.error("Lỗi:", error);

      setMessage(
        "❌ Có lỗi xảy ra khi thực hiện thao tác!"
      );
    }
  };


  // =====================================================
  // CÂU 61
  // CHỌN SINH VIÊN ĐỂ SỬA
  // =====================================================
  const handleEdit = (student) => {

    setEditingId(student._id);

    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);

    setMessage(
      `✏️ Đang chỉnh sửa sinh viên: ${student.name}`
    );


    // Cuộn lên đầu trang
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // HỦY SỬA
  // =====================================================
  const handleCancelEdit = () => {

    clearForm();

    setMessage(
      "Đã hủy chỉnh sửa."
    );
  };


  // =====================================================
  // CÂU 62
  // DELETE - XÓA SINH VIÊN
  // =====================================================
  const handleDelete = async (student) => {

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa sinh viên "${student.name}" không?`
    );


    // Nếu chọn Cancel
    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/api/students/${student._id}`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {
        throw new Error(
          "Không thể xóa sinh viên"
        );
      }


      await response.json();


      // Nếu đang sửa sinh viên vừa xóa
      if (editingId === student._id) {
        clearForm();
      }


      setMessage(
        "✅ Xóa sinh viên thành công!"
      );


      // CÂU 63:
      // Gọi lại GET sau khi xóa
      await loadStudents();

    } catch (error) {

      console.error("Lỗi:", error);

      setMessage(
        "❌ Có lỗi xảy ra khi xóa sinh viên!"
      );
    }
  };


  // =====================================================
  // GIAO DIỆN
  // =====================================================
  return (
    <div className="app">


      {/* =================================================
          HEADER
      ================================================= */}
      <header className="header">

        <div className="header-content">

          <p className="subtitle">
            STUDENT MANAGEMENT SYSTEM
          </p>


          <h1>
            Quản lý sinh viên - Version 2.0
          </h1>


          <p className="description">
            Quản lý thông tin sinh viên bằng React,
            Node.js và MongoDB Atlas
          </p>

        </div>


        {/* SỐ LƯỢNG SINH VIÊN */}
        <div className="student-count">

          <span>
            {students.length}
          </span>


          <small>
            Sinh viên
          </small>

        </div>

      </header>



      {/* =================================================
          MAIN
      ================================================= */}
      <main className="container">


        {/* =================================================
            FORM
        ================================================= */}
        <section className="form-card">


          <div className="card-title">

            <div className="icon">
              {editingId ? "✏" : "+"}
            </div>


            <div>

              <h2>
                {editingId
                  ? "Cập nhật sinh viên"
                  : "Thêm sinh viên"}
              </h2>


              <p>
                {editingId
                  ? "Chỉnh sửa thông tin sinh viên"
                  : "Nhập thông tin sinh viên mới"}
              </p>

            </div>

          </div>



          {/* FORM */}
          <form onSubmit={handleSubmit}>


            <div className="form-grid">


              {/* MSSV */}
              <div className="form-group">

                <label>
                  Mã số sinh viên
                </label>


                <input
                  type="text"
                  placeholder="Ví dụ: 235827"
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(
                      e.target.value
                    )
                  }
                />

              </div>



              {/* HỌ TÊN */}
              <div className="form-group">

                <label>
                  Họ và tên
                </label>


                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

              </div>



              {/* EMAIL */}
              <div className="form-group full">

                <label>
                  Email
                </label>


                <input
                  type="email"
                  placeholder="Ví dụ: nguyenvana@gmail.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>



            {/* BUTTON GROUP */}
            <div className="button-group">


              {/* THÊM / CẬP NHẬT */}
              <button
                className="submit-btn"
                type="submit"
              >

                <span>
                  {editingId
                    ? "✓"
                    : "＋"}
                </span>


                {editingId
                  ? "Cập nhật sinh viên"
                  : "Thêm sinh viên"}

              </button>



              {/* HỦY */}
              {editingId && (

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCancelEdit
                  }
                >
                  ✕ Hủy
                </button>

              )}

            </div>

          </form>



          {/* MESSAGE */}
          {message && (

            <div className="message">
              {message}
            </div>

          )}

        </section>



        {/* =================================================
            DANH SÁCH
        ================================================= */}
        <section className="list-section">


          {/* LIST HEADER */}
          <div className="list-header">


            <div>

              <h2>
                Danh sách sinh viên
              </h2>


              <p>
                Thông tin sinh viên hiện có
                trong hệ thống
              </p>

            </div>



            {/* RIGHT */}
            <div className="list-buttons">


              {/* NÚT LÀM MỚI */}
              <button
                type="button"
                className="refresh-btn"
                onClick={loadStudents}
                disabled={loading}
              >

                {loading
                  ? "⟳ Đang tải..."
                  : "↻ Làm mới"}

              </button>



              {/* TỔNG */}
              <div className="total">

                Tổng:

                <strong>
                  {students.length}
                </strong>

              </div>

            </div>

          </div>



          {/* =================================================
              STUDENT GRID
          ================================================= */}
          <div className="students-grid">


            {/* KHÔNG CÓ SINH VIÊN */}
            {students.length === 0 ? (

              <div className="empty">

                <div className="empty-icon">
                  📋
                </div>


                <h3>
                  Chưa có sinh viên
                </h3>


                <p>
                  Hãy thêm sinh viên đầu tiên
                  vào hệ thống.
                </p>

              </div>

            ) : (


              // CÓ SINH VIÊN
              students.map(
                (student, index) => (

                  <div
                    className="student-card"
                    key={student._id}
                  >


                    {/* STUDENT TOP */}
                    <div className="student-top">


                      {/* AVATAR */}
                      <div className="avatar">

                        {student.name
                          ? student.name
                              .charAt(0)
                              .toUpperCase()
                          : "S"}

                      </div>



                      {/* NAME */}
                      <div>

                        <span className="student-number">
                          #{index + 1}
                        </span>


                        <h3>
                          {student.name}
                        </h3>

                      </div>

                    </div>



                    {/* INFORMATION */}
                    <div className="student-info">


                      {/* MSSV */}
                      <div className="info-row">

                        <span className="label">
                          MSSV
                        </span>


                        <span className="value">
                          {student.studentId}
                        </span>

                      </div>



                      {/* EMAIL */}
                      <div className="info-row">

                        <span className="label">
                          Email
                        </span>


                        <span className="value">
                          {student.email}
                        </span>

                      </div>

                    </div>



                    {/* ACTION BUTTONS */}
                    <div className="student-actions">


                      {/* SỬA */}
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            student
                          )
                        }
                      >
                        ✏ Sửa
                      </button>



                      {/* XÓA */}
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            student
                          )
                        }
                      >
                        🗑 Xóa
                      </button>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </main>



      {/* =================================================
          FOOTER
      ================================================= */}
      <footer>

        <p>
          Student Management System © 2026
        </p>


        <span>
          React • Node.js • MongoDB Atlas
        </span>

      </footer>

    </div>
  );
}

export default App;