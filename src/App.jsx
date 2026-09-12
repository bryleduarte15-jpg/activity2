import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
  useInRouterContext,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

const initialStudents = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "juan@gmail.com",
    course: "BSIT",
    year: "4th Year",
    phone: "09123456789",
    status: "Active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@gmail.com",
    course: "BSBA",
    year: "3rd Year",
    phone: "09234567890",
    status: "Active",
  },
  {
    id: 3,
    name: "Mark Reyes",
    email: "mark@gmail.com",
    course: "BSCRIM",
    year: "2nd Year",
    phone: "09345678901",
    status: "Active",
  },
  {
    id: 4,
    name: "Angela Garcia",
    email: "angela@gmail.com",
    course: "BEED",
    year: "1st Year",
    phone: "09456789012",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Kevin Flores",
    email: "kevin@gmail.com",
    course: "BSHM",
    year: "4th Year",
    phone: "09567890123",
    status: "Active",
  },
  {
    id: 6,
    name: "Sofia Mendoza",
    email: "sofia@gmail.com",
    course: "BSA",
    year: "3rd Year",
    phone: "09678901234",
    status: "Active",
  },
];

const courses = [
  "All Courses",
  "BSIT",
  "BSCRIM",
  "BSBA",
  "BEED",
  "BSHM",
  "BSA",
];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function App() {
  const alreadyHasRouter = useInRouterContext();

  if (alreadyHasRouter) {
    return <Portal />;
  }

  return (
    <BrowserRouter>
      <Portal />
    </BrowserRouter>
  );
}

function Portal() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("studenthub_students");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialStudents;
      }
    }

    return initialStudents;
  });

  const [toast, setToast] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("studenthub_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "studenthub_students",
      JSON.stringify(students)
    );
  }, [students]);

  useEffect(() => {
    localStorage.setItem(
      "studenthub_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now(),
      status: "Active",
    };

    setStudents((prev) => [newStudent, ...prev]);

    showToast("Student added successfully!");
  };

  const updateStudent = (id, updatedStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === Number(id)
          ? {
              ...student,
              ...updatedStudent,
            }
          : student
      )
    );

    showToast("Student updated successfully!");
  };

  const deleteStudent = (id) => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== Number(id))
    );

    showToast("Student deleted successfully!");
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />

      <main className="main-area">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={<Home students={students} />}
            />

            <Route
              path="/students"
              element={
                <Students
                  students={students}
                  onDelete={deleteStudent}
                />
              }
            />

            <Route
              path="/students/:id"
              element={<StudentDetails students={students} />}
            />

            <Route
              path="/add-student"
              element={<AddStudent onAdd={addStudent} />}
            />

            <Route
              path="/edit-student/:id"
              element={
                <EditStudent
                  students={students}
                  onUpdate={updateStudent}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar() {
  const location = useLocation();

  const menu = [
    {
      path: "/",
      label: "Dashboard",
      icon: "▦",
    },
    {
      path: "/students",
      label: "Students",
      icon: "♙",
    },
    {
      path: "/add-student",
      label: "Add Student",
      icon: "＋",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>

        <div>
          <h2>StudentHub</h2>
          <span>Management Portal</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">MAIN MENU</p>

        <nav>
          {menu.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${active ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>

                <span className="nav-label">
                  {item.label}
                </span>

                {item.path === "/students" && (
                  <span className="nav-count">
                    {String(6).padStart(2, "0")}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="admin-card">
          <div className="admin-avatar">AD</div>

          <div className="admin-info">
            <strong>Administrator</strong>
            <span>Portal Manager</span>
          </div>

          <span className="online-dot"></span>
        </div>
      </div>
    </aside>
  );
}

/* =========================
   TOPBAR
========================= */

function Topbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const pageInfo = {
    "/": {
      title: "Dashboard",
      subtitle: "Overview of your student management system",
    },

    "/students": {
      title: "Students",
      subtitle: "Manage and view all registered students",
    },

    "/add-student": {
      title: "Add Student",
      subtitle: "Create a new student record",
    },
  };

  let current = pageInfo[location.pathname];

  if (location.pathname.startsWith("/students/")) {
    current = {
      title: "Student Details",
      subtitle: "View complete student information",
    };
  }

  if (location.pathname.startsWith("/edit-student/")) {
    current = {
      title: "Edit Student",
      subtitle: "Update student information",
    };
  }

  return (
    <header className="topbar">
      <div>
        <h1>{current?.title || "StudentHub"}</h1>
        <p>{current?.subtitle}</p>
      </div>

      <div className="topbar-right">
        {/* THEME SWITCH */}
        <button
          className={`theme-switch ${
            darkMode ? "dark" : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
          title={
            darkMode
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"
          }
        >
          <span className="theme-icon">
            {darkMode ? "☀" : "☾"}
          </span>

          <span className="theme-text">
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>

        <button className="notification-btn">
          ♧
          <span></span>
        </button>

        <div className="top-profile">
          <div className="top-avatar">AD</div>

          <div className="top-profile-text">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================
   HOME
========================= */

function Home({ students }) {
  const navigate = useNavigate();

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  );

  const courseCounts = courses
    .slice(1)
    .map((course) => ({
      course,
      count: students.filter(
        (student) => student.course === course
      ).length,
    }));

  return (
    <section>
      <div className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-small">
            WELCOME BACK
          </span>

          <h2>
            Manage your students
            <br />
            <span>with confidence.</span>
          </h2>

          <p>
            Keep your student records organized, updated,
            and easy to manage.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/add-student")}
          >
            <span>＋</span>
            Add New Student
          </button>
        </div>

        <div className="welcome-decoration">
          <div className="circle circle-one"></div>
          <div className="circle circle-two"></div>

          <div className="floating-card">
            <span>STUDENTS</span>
            <strong>{students.length}</strong>
            <small>Total registered</small>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="♙"
          label="Total Students"
          value={students.length}
          description="Registered students"
          className="purple"
        />

        <StatCard
          icon="✓"
          label="Active Students"
          value={activeStudents.length}
          description="Currently active"
          className="green"
        />

        <StatCard
          icon="⌘"
          label="Courses"
          value={
            courseCounts.filter(
              (item) => item.count > 0
            ).length
          }
          description="Available programs"
          className="blue"
        />

        <StatCard
          icon="↗"
          label="New Students"
          value={students.slice(0, 3).length}
          description="Recent registrations"
          className="orange"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                ACADEMIC
              </span>

              <h3>Students by Course</h3>
            </div>

            <Link to="/students">View all →</Link>
          </div>

          <div className="course-list">
            {courseCounts.map((item) => {
              const percentage =
                students.length === 0
                  ? 0
                  : Math.round(
                      (item.count / students.length) *
                        100
                    );

              return (
                <div
                  className="course-row"
                  key={item.course}
                >
                  <div className="course-top">
                    <span className="course-name">
                      {item.course}
                    </span>

                    <span className="course-number">
                      {item.count}
                    </span>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                LATEST
              </span>

              <h3>Recent Students</h3>
            </div>

            <Link to="/students">View all →</Link>
          </div>

          <div className="recent-list">
            {students.slice(0, 5).map((student) => (
              <Link
                to={`/students/${student.id}`}
                className="recent-student"
                key={student.id}
              >
                <div className="avatar">
                  {getInitials(student.name)}
                </div>

                <div className="recent-info">
                  <strong>{student.name}</strong>

                  <span>
                    {student.course} • {student.year}
                  </span>
                </div>

                <span className="arrow">›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  className,
}) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>

        <span className="stat-arrow">↗</span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-label">{label}</div>

      <div className="stat-description">
        {description}
      </div>
    </div>
  );
}

/* =========================
   STUDENTS
========================= */

function Students({ students, onDelete }) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("All Courses");

  const filteredStudents = students.filter((student) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue) ||
      student.course.toLowerCase().includes(searchValue);

    const matchesCourse =
      course === "All Courses" ||
      student.course === course;

    return matchesSearch && matchesCourse;
  });

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(
      `Delete ${name} from the student list?`
    );

    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            DIRECTORY
          </span>

          <h2>All Students</h2>

          <p>
            Browse, search and manage your student records.
          </p>
        </div>

        <Link to="/add-student" className="primary-btn">
          <span>＋</span>
          Add Student
        </Link>
      </div>

      <div className="students-panel">
        <div className="filter-bar">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by name, email or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </div>

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            {courses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <div className="result-count">
            {filteredStudents.length}{" "}
            {filteredStudents.length === 1
              ? "student"
              : "students"}
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>COURSE</th>
                  <th>YEAR</th>
                  <th>CONTACT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">⌕</div>

            <h3>No students found</h3>

            <p>
              Try changing your search or course filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function StudentRow({ student, onDelete }) {
  return (
    <tr>
      <td>
        <div className="student-cell">
          <div className="avatar table-avatar">
            {getInitials(student.name)}
          </div>

          <div>
            <strong>{student.name}</strong>
            <span>{student.email}</span>
          </div>
        </div>
      </td>

      <td>
        <span className="course-badge">
          {student.course}
        </span>
      </td>

      <td>{student.year}</td>

      <td>{student.phone}</td>

      <td>
        <span
          className={`status-badge ${
            student.status === "Active"
              ? "active"
              : "inactive"
          }`}
        >
          <span></span>
          {student.status}
        </span>
      </td>

      <td>
        <div className="action-buttons">
          <Link
            to={`/students/${student.id}`}
            className="table-action view"
            title="View Student"
          >
            ↗
          </Link>

          <Link
            to={`/edit-student/${student.id}`}
            className="table-action edit"
            title="Edit Student"
          >
            ✎
          </Link>

          <button
            className="table-action delete"
            title="Delete Student"
            onClick={() =>
              onDelete(student.id, student.name)
            }
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================
   ADD STUDENT
========================= */

function AddStudent({ onAdd }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "BSIT",
    year: "1st Year",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Student name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
    } catch (error) {
      console.log(
        "Axios request:",
        error.message
      );
    }

    onAdd(form);

    navigate("/students");
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            NEW RECORD
          </span>

          <h2>Add Student</h2>

          <p>
            Enter the student's information below.
          </p>
        </div>

        <Link
          to="/students"
          className="secondary-btn"
        >
          ← Back to Students
        </Link>
      </div>

      <form
        className="student-form"
        onSubmit={handleSubmit}
      >
        <div className="form-intro">
          <div className="form-intro-icon">＋</div>

          <div>
            <h3>Student Information</h3>

            <p>
              Fill in all required information to create
              a new student record.
            </p>
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-grid">
          <div className="form-field full">
            <label>
              Full Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Juan Dela Cruz"
              value={form.name}
              onChange={handleChange}
              className={
                errors.name
                  ? "input-error"
                  : ""
              }
            />

            {errors.name && (
              <small className="error-message">
                {errors.name}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>
              Email Address <span>*</span>
            </label>

            <input
              type="email"
              name="email"
              placeholder="student@email.com"
              value={form.email}
              onChange={handleChange}
              className={
                errors.email
                  ? "input-error"
                  : ""
              }
            />

            {errors.email && (
              <small className="error-message">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>
              Phone Number <span>*</span>
            </label>

            <input
              type="text"
              name="phone"
              placeholder="09XXXXXXXXX"
              value={form.phone}
              onChange={handleChange}
              className={
                errors.phone
                  ? "input-error"
                  : ""
              }
            />

            {errors.phone && (
              <small className="error-message">
                {errors.phone}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>Course</label>

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              {courses.slice(1).map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Year Level</label>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-footer">
          <p>
            <span>*</span> Required fields
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/students")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              <span>✓</span>
              Save Student
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

/* =========================
   STUDENT DETAILS
========================= */

function StudentDetails({ students }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find(
    (item) => item.id === Number(id)
  );

  if (!student) {
    return (
      <div className="not-found">
        <div className="not-found-icon">?</div>

        <h2>Student Not Found</h2>

        <p>
          The student record you're looking for
          doesn't exist.
        </p>

        <Link
          to="/students"
          className="primary-btn"
        >
          ← Back to Students
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className="details-actions">
        <button
          className="back-link"
          onClick={() =>
            navigate("/students")
          }
        >
          ← Back to Students
        </button>

        <Link
          to={`/edit-student/${student.id}`}
          className="primary-btn"
        >
          ✎ Edit Student
        </Link>
      </div>

      <div className="profile-card">
        <div className="profile-cover">
          <div className="cover-shape shape-one"></div>
          <div className="cover-shape shape-two"></div>
        </div>

        <div className="profile-main">
          <div className="large-avatar">
            {getInitials(student.name)}
          </div>

          <div className="profile-info">
            <div className="profile-name-row">
              <h2>{student.name}</h2>

              <span
                className={`status-badge ${
                  student.status === "Active"
                    ? "active"
                    : "inactive"
                }`}
              >
                <span></span>
                {student.status}
              </span>
            </div>

            <p>{student.email}</p>

            <div className="profile-tags">
              <span>{student.course}</span>
              <span>{student.year}</span>
              <span>ID #{student.id}</span>
            </div>
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="details-section">
          <div className="section-label">
            PERSONAL INFORMATION
          </div>

          <div className="details-grid">
            <DetailItem
              icon="✉"
              label="Email Address"
              value={student.email}
            />

            <DetailItem
              icon="☎"
              label="Phone Number"
              value={student.phone}
            />

            <DetailItem
              icon="⌘"
              label="Course"
              value={student.course}
            />

            <DetailItem
              icon="▣"
              label="Year Level"
              value={student.year}
            />

            <DetailItem
              icon="●"
              label="Account Status"
              value={student.status}
            />

            <DetailItem
              icon="#"
              label="Student ID"
              value={`STU-${String(
                student.id
              ).padStart(4, "0")}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-item">
      <div className="detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/* =========================
   EDIT STUDENT
========================= */

function EditStudent({
  students,
  onUpdate,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find(
    (item) => item.id === Number(id)
  );

  const [form, setForm] = useState({
    name: student?.name || "",
    email: student?.email || "",
    course: student?.course || "BSIT",
    year: student?.year || "1st Year",
    phone: student?.phone || "",
  });

  const [errors, setErrors] = useState({});

  if (!student) {
    return (
      <div className="not-found">
        <div className="not-found-icon">?</div>

        <h2>Student Not Found</h2>

        <Link
          to="/students"
          className="primary-btn"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Student name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(form.email)
    ) {
      newErrors.email =
        "Enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onUpdate(student.id, form);

    navigate(
      `/students/${student.id}`
    );
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            UPDATE RECORD
          </span>

          <h2>Edit Student</h2>

          <p>
            Update the information of{" "}
            {student.name}.
          </p>
        </div>

        <Link
          to={`/students/${student.id}`}
          className="secondary-btn"
        >
          ← Cancel
        </Link>
      </div>

      <form
        className="student-form"
        onSubmit={handleSubmit}
      >
        <div className="edit-profile-preview">
          <div className="large-avatar small">
            {getInitials(student.name)}
          </div>

          <div>
            <strong>{student.name}</strong>

            <span>
              {student.course} • {student.year}
            </span>
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-grid">
          <div className="form-field full">
            <label>
              Full Name <span>*</span>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={
                errors.name
                  ? "input-error"
                  : ""
              }
            />

            {errors.name && (
              <small className="error-message">
                {errors.name}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>
              Email Address <span>*</span>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={
                errors.email
                  ? "input-error"
                  : ""
              }
            />

            {errors.email && (
              <small className="error-message">
                {errors.email}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>
              Phone Number <span>*</span>
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={
                errors.phone
                  ? "input-error"
                  : ""
              }
            />

            {errors.phone && (
              <small className="error-message">
                {errors.phone}
              </small>
            )}
          </div>

          <div className="form-field">
            <label>Course</label>

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              {courses.slice(1).map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Year Level</label>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>
        </div>

        <div className="form-divider"></div>

        <div className="form-footer">
          <p>
            <span>*</span> Required fields
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(
                  `/students/${student.id}`
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              <span>✓</span>
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default App;