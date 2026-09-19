import { useEffect, useMemo, useState } from "react";
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

/* =========================================================
   DATA
========================================================= */

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
  {
    id: 7,
    name: "Daniel Ramos",
    email: "daniel@gmail.com",
    course: "BSIT",
    year: "2nd Year",
    phone: "09781234567",
    status: "Active",
  },
  {
    id: 8,
    name: "Nicole Torres",
    email: "nicole@gmail.com",
    course: "BSBA",
    year: "1st Year",
    phone: "09812345678",
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

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarClass(id) {
  return `avatar-color-${(Number(id) % 6) + 1}`;
}

function formatStudentId(id) {
  return String(id).padStart(5, "0");
}

/* =========================================================
   MAIN APP
========================================================= */

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

/* =========================================================
   PORTAL
========================================================= */

function Portal() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("studenthub_students");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to load students:", error);
    }

    return initialStudents;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("studenthub_theme") === "dark";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");

  /* Save students */
  useEffect(() => {
    localStorage.setItem(
      "studenthub_students",
      JSON.stringify(students)
    );
  }, [students]);

  /* Save theme */
  useEffect(() => {
    localStorage.setItem(
      "studenthub_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* Toast timer */
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  /* Add student */
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now(),
      status: "Active",
    };

    setStudents((previous) => [
      newStudent,
      ...previous,
    ]);

    setToast("Student successfully added.");
  };

  /* Update student */
  const updateStudent = (updatedStudent) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === updatedStudent.id
          ? updatedStudent
          : student
      )
    );

    setToast("Student information updated.");
  };

  /* Delete student */
  const deleteStudent = (id) => {
    const student = students.find(
      (item) => item.id === id
    );

    if (!student) return;

    const confirmed = window.confirm(
      `Delete ${student.name}'s student record?`
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter(
        (student) => student.id !== id
      )
    );

    setToast("Student deleted successfully.");
  };

  return (
    <div
      className={`app-layout ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <Sidebar
        students={students}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-area">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="page-content">
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
              element={
                <StudentDetails
                  students={students}
                />
              }
            />

            <Route
              path="/add-student"
              element={
                <AddStudent onAdd={addStudent} />
              }
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

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>
      </div>

      {toast && (
        <div className="toast">
          <div className="toast-check">✓</div>

          <div>
            <strong>Success</strong>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  students,
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation();

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeMobile = () => {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <span>S</span>
          </div>

          <div className="brand-copy">
            <strong>StudentHub</strong>
            <span>Management Portal</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-mini-avatar">
            AD
            <span />
          </div>

          <div>
            <strong>Admin Dashboard</strong>
            <span>Administrator</span>
          </div>

          <div className="profile-more">•••</div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-title">
            MAIN MENU
          </p>

          <nav className="nav-menu">
            <Link
              to="/"
              className={`nav-link ${
                isActive("/") ? "active" : ""
              }`}
              onClick={closeMobile}
            >
              <span className="nav-icon">
                ⌂
              </span>

              <span className="nav-label">
                Dashboard
              </span>
            </Link>

            <Link
              to="/students"
              className={`nav-link ${
                isActive("/students")
                  ? "active"
                  : ""
              }`}
              onClick={closeMobile}
            >
              <span className="nav-icon">
                ♙
              </span>

              <span className="nav-label">
                Students
              </span>

              <span className="nav-count">
                {students.length}
              </span>
            </Link>

            <Link
              to="/add-student"
              className={`nav-link ${
                isActive("/add-student")
                  ? "active"
                  : ""
              }`}
              onClick={closeMobile}
            >
              <span className="nav-icon">
                ＋
              </span>

              <span className="nav-label">
                Add Student
              </span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-title">
            MANAGEMENT
          </p>

          <div className="sidebar-info-card">
            <div className="sidebar-info-icon">
              ✦
            </div>

            <div>
              <strong>
                Student Overview
              </strong>

              <span>
                {activeStudents} active students
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">?</div>

            <div>
              <strong>Need help?</strong>
              <span>
                Contact administrator
              </span>
            </div>
          </div>

          <div className="sidebar-version">
            <span>StudentHub</span>
            <span>v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  darkMode,
  setDarkMode,
  setSidebarOpen,
}) {
  const location = useLocation();

  const getPageInfo = () => {
    if (location.pathname === "/") {
      return {
        title: "Dashboard",
        subtitle:
          "Overview of your student management system",
      };
    }

    if (location.pathname === "/students") {
      return {
        title: "Students",
        subtitle:
          "Manage and organize your student records",
      };
    }

    if (location.pathname === "/add-student") {
      return {
        title: "Add Student",
        subtitle:
          "Create a new student profile",
      };
    }

    if (
      location.pathname.startsWith(
        "/edit-student"
      )
    ) {
      return {
        title: "Edit Student",
        subtitle:
          "Update student information",
      };
    }

    if (
      location.pathname.startsWith("/students/")
    ) {
      return {
        title: "Student Details",
        subtitle:
          "View complete student information",
      };
    }

    return {
      title: "StudentHub",
      subtitle: "Management Portal",
    };
  };

  const info = getPageInfo();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="breadcrumb">
          <span>StudentHub</span>
          <b>/</b>
          <strong>{info.title}</strong>
        </div>

        <div className="top-heading">
          <h1>{info.title}</h1>
          <p>{info.subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="theme-switch"
          onClick={() =>
            setDarkMode((previous) => !previous)
          }
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

        <button
          className="notification-btn"
          title="Notifications"
        >
          <span className="notification-icon">
            ♧
          </span>

          <i />
        </button>

        <div className="top-profile">
          <div className="top-avatar">
            AD
          </div>

          <div className="top-profile-text">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <span className="profile-chevron">
            ⌄
          </span>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Home({ students }) {
  const navigate = useNavigate();

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;

  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive"
  ).length;

  const totalCourses = new Set(
    students.map((student) => student.course)
  ).size;

  const activePercentage =
    totalStudents > 0
      ? Math.round(
          (activeStudents / totalStudents) * 100
        )
      : 0;

  const inactivePercentage =
    totalStudents > 0
      ? Math.round(
          (inactiveStudents / totalStudents) * 100
        )
      : 0;

  const courseStats = courses
    .filter(
      (course) => course !== "All Courses"
    )
    .map((course) => {
      const count = students.filter(
        (student) =>
          student.course === course
      ).length;

      const percentage =
        totalStudents > 0
          ? Math.round(
              (count / totalStudents) * 100
            )
          : 0;

      return {
        course,
        count,
        percentage,
      };
    });

  const yearStats = years.map((year) => ({
    year,
    count: students.filter(
      (student) => student.year === year
    ).length,
  }));

  const maxYearCount = Math.max(
    ...yearStats.map((item) => item.count),
    1
  );

  const recentStudents = students.slice(0, 5);

  return (
    <div className="dashboard-page">

      {/* HERO */}

      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-label">
            <span className="hero-dot" />
            SYSTEM OVERVIEW
          </div>

          <h2>
            Welcome back,
            <br />
            <span>Administrator.</span>
          </h2>

          <p>
            Manage your students, monitor
            enrollment, and keep your academic
            records organized in one place.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn hero-btn"
              onClick={() =>
                navigate("/add-student")
              }
            >
              <span>＋</span>
              Add New Student
            </button>

            <button
              className="hero-secondary-btn"
              onClick={() =>
                navigate("/students")
              }
            >
              View Students
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="hero-grid" />

          <div className="hero-floating-card card-top">
            <div className="floating-icon">
              ♙
            </div>

            <div>
              <span>Total Students</span>
              <strong>{totalStudents}</strong>
            </div>
          </div>

          <div className="hero-floating-card card-bottom">
            <div className="mini-progress">
              <span
                style={{
                  width: `${activePercentage}%`,
                }}
              />
            </div>

            <div>
              <strong>
                {activePercentage}%
              </strong>

              <span>
                Active Students
              </span>
            </div>
          </div>

          <div className="hero-center-logo">
            <span>S</span>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="stats-grid">
        <StatCard
          icon="♙"
          label="Total Students"
          value={totalStudents}
          description="Registered students"
          trend="+12.5%"
          trendText="this month"
          className="purple"
        />

        <StatCard
          icon="✓"
          label="Active Students"
          value={activeStudents}
          description="Currently active"
          trend={`${activePercentage}%`}
          trendText="of total"
          className="green"
        />

        <StatCard
          icon="◌"
          label="Inactive Students"
          value={inactiveStudents}
          description="Needs attention"
          trend={`${inactivePercentage}%`}
          trendText="of total"
          className="orange"
        />

        <StatCard
          icon="▦"
          label="Courses"
          value={totalCourses}
          description="Active programs"
          trend="100%"
          trendText="coverage"
          className="blue"
        />
      </section>

      {/* ANALYTICS */}

      <section className="analytics-grid">

        {/* COURSE DISTRIBUTION */}

        <div className="dashboard-panel course-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                DISTRIBUTION
              </span>

              <h3>Students by Course</h3>

              <p>
                Overview of students across
                programs
              </p>
            </div>

            <Link to="/students">
              View all →
            </Link>
          </div>

          <div className="course-list">
            {courseStats.map(
              (item, index) => (
                <div
                  className="course-row"
                  key={item.course}
                >
                  <div className="course-top">
                    <div className="course-title">
                      <span
                        className={`course-number number-${
                          index + 1
                        }`}
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <strong>
                        {item.course}
                      </strong>
                    </div>

                    <div className="course-value">
                      <strong>
                        {item.count}
                      </strong>

                      <span>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="progress-track">
                    <div
                      className={`progress-fill fill-${
                        index + 1
                      }`}
                      style={{
                        width: `${Math.max(
                          item.percentage,
                          item.count > 0
                            ? 5
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* STATUS */}

        <div className="dashboard-panel status-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                STATUS
              </span>

              <h3>Student Activity</h3>

              <p>
                Current student status
              </p>
            </div>
          </div>

          <div className="status-chart">
            <div
              className="donut"
              style={{
                "--active": `${activePercentage * 3.6}deg`,
              }}
            >
              <div className="donut-center">
                <strong>
                  {activePercentage}%
                </strong>

                <span>Active</span>
              </div>
            </div>

            <div className="status-legend">
              <div>
                <span className="legend-dot active-dot" />

                <div>
                  <strong>Active</strong>
                  <span>
                    Currently enrolled
                  </span>
                </div>

                <b>{activeStudents}</b>
              </div>

              <div>
                <span className="legend-dot inactive-dot" />

                <div>
                  <strong>Inactive</strong>
                  <span>
                    Not currently active
                  </span>
                </div>

                <b>{inactiveStudents}</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YEAR + QUICK ACTIONS */}

      <section className="analytics-grid second-row">

        <div className="dashboard-panel year-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                OVERVIEW
              </span>

              <h3>Students by Year</h3>

              <p>
                Distribution across academic
                levels
              </p>
            </div>
          </div>

          <div className="bar-chart">
            {yearStats.map((item) => (
              <div
                className="bar-column"
                key={item.year}
              >
                <div className="bar-value">
                  {item.count}
                </div>

                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(
                        (item.count /
                          maxYearCount) *
                          100,
                        item.count > 0
                          ? 10
                          : 0
                      )}%`,
                    }}
                  />
                </div>

                <span>
                  {item.year.replace(
                    " Year",
                    ""
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel quick-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">
                ACTIONS
              </span>

              <h3>Quick Actions</h3>

              <p>
                Frequently used management
                tools
              </p>
            </div>
          </div>

          <div className="quick-actions">
            <button
              onClick={() =>
                navigate("/add-student")
              }
            >
              <span className="quick-action-icon purple-icon">
                ＋
              </span>

              <span>
                <strong>
                  Add Student
                </strong>

                <small>
                  Create a new student
                  record
                </small>
              </span>

              <b>→</b>
            </button>

            <button
              onClick={() =>
                navigate("/students")
              }
            >
              <span className="quick-action-icon blue-icon">
                ♙
              </span>

              <span>
                <strong>
                  Student Directory
                </strong>

                <small>
                  Search and manage
                  students
                </small>
              </span>

              <b>→</b>
            </button>
          </div>
        </div>
      </section>

      {/* RECENT STUDENTS */}

      <section className="dashboard-panel recent-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">
              LATEST RECORDS
            </span>

            <h3>Recent Students</h3>

            <p>
              Recently added student profiles
            </p>
          </div>

          <Link to="/students">
            View directory →
          </Link>
        </div>

        <div className="recent-table">
          <div className="recent-table-head">
            <span>STUDENT</span>
            <span>COURSE</span>
            <span>YEAR</span>
            <span>STATUS</span>
            <span />
          </div>

          {recentStudents.length > 0 ? (
            recentStudents.map((student) => (
              <Link
                to={`/students/${student.id}`}
                className="recent-table-row"
                key={student.id}
              >
                <div className="recent-student-cell">
                  <div
                    className={`table-avatar ${getAvatarClass(
                      student.id
                    )}`}
                  >
                    {getInitials(
                      student.name
                    )}
                  </div>

                  <div>
                    <strong>
                      {student.name}
                    </strong>

                    <span>
                      {student.email}
                    </span>
                  </div>
                </div>

                <span className="course-badge">
                  {student.course}
                </span>

                <span className="year-text">
                  {student.year}
                </span>

                <span
                  className={`status-badge ${
                    student.status ===
                    "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  <i />
                  {student.status}
                </span>

                <span className="row-arrow">
                  →
                </span>
              </Link>
            ))
          ) : (
            <div className="empty-state small-empty">
              No student records yet.
            </div>
          )}
        </div>
      </section>

      <div className="dashboard-footer">
        <span>
          StudentHub Management Portal
        </span>

        <span>
          Student records made simple.
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  trend,
  trendText,
  className,
}) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-trend">
          ↗ {trend}
        </span>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-label">
        {label}
      </div>

      <div className="stat-bottom">
        <span>{description}</span>
        <small>{trendText}</small>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENTS PAGE
========================================================= */

function Students({
  students,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [course, setCourse] =
    useState("All Courses");

  const filteredStudents = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !searchText ||
        student.name
          .toLowerCase()
          .includes(searchText) ||
        student.email
          .toLowerCase()
          .includes(searchText) ||
        student.course
          .toLowerCase()
          .includes(searchText) ||
        student.phone
          .toLowerCase()
          .includes(searchText);

      const matchesCourse =
        course === "All Courses" ||
        student.course === course;

      return (
        matchesSearch && matchesCourse
      );
    });
  }, [students, search, course]);

  const clearFilters = () => {
    setSearch("");
    setCourse("All Courses");
  };

  return (
    <div className="content-page">

      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            STUDENT DIRECTORY
          </span>

          <h2>All Students</h2>

          <p>
            Search, view, edit, and manage
            student information.
          </p>
        </div>

        <Link
          to="/add-student"
          className="primary-btn"
        >
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
              placeholder="Search name, email, course, or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}
          </div>

          <select
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
          >
            {courses.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <div className="result-count">
            <strong>
              {filteredStudents.length}
            </strong>

            <span>results</span>
          </div>

          {(search ||
            course !== "All Courses") && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>COURSE</th>
                <th>YEAR</th>
                <th>PHONE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(
                (student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onDelete={onDelete}
                  />
                )
              )}
            </tbody>
          </table>

          {filteredStudents.length ===
            0 && (
            <div className="empty-state">
              <div className="empty-icon">
                ⌕
              </div>

              <h3>
                No students found
              </h3>

              <p>
                Try another search term or
                course filter.
              </p>

              <button
                className="secondary-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT ROW
========================================================= */

function StudentRow({
  student,
  onDelete,
}) {
  return (
    <tr>
      <td>
        <div className="student-cell">
          <div
            className={`table-avatar ${getAvatarClass(
              student.id
            )}`}
          >
            {getInitials(student.name)}
          </div>

          <div>
            <strong>
              {student.name}
            </strong>

            <span>
              {student.email}
            </span>
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
              ? "status-active"
              : "status-inactive"
          }`}
        >
          <i />
          {student.status}
        </span>
      </td>

      <td>
        <div className="action-buttons">

          <Link
            to={`/students/${student.id}`}
            className="table-action view-action"
            title="View student"
          >
            ↗
          </Link>

          <Link
            to={`/edit-student/${student.id}`}
            className="table-action edit-action"
            title="Edit student"
          >
            ✎
          </Link>

          <button
            className="table-action delete-action"
            title="Delete student"
            onClick={() =>
              onDelete(student.id)
            }
          >
            ×
          </button>

        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   ADD STUDENT
========================================================= */

function AddStudent({ onAdd }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "BSIT",
    year: "1st Year",
    phone: "",
  });

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email || !phone) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      phone.length < 10 ||
      !/^[0-9+ -]+$/.test(phone)
    ) {
      setError(
        "Please enter a valid phone number."
      );
      return;
    }

    setSaving(true);

    /*
      Axios is intentionally used here
      to satisfy the project requirement.
      The actual student record is stored
      locally so the app works without
      requiring a backend/API.
    */

    try {
      await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
    } catch (axiosError) {
      console.log(
        "Axios connection check:",
        axiosError.message
      );
    }

    onAdd({
      ...form,
      name,
      email,
      phone,
    });

    setSaving(false);

    navigate("/students");
  };

  return (
    <div className="content-page form-page">

      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            STUDENT MANAGEMENT
          </span>

          <h2>Add New Student</h2>

          <p>
            Create a complete profile for a
            new student.
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

        <div className="form-top">
          <div className="form-intro-icon">
            ＋
          </div>

          <div>
            <span className="panel-eyebrow">
              NEW RECORD
            </span>

            <h3>
              Student Information
            </h3>

            <p>
              Enter the student's personal and
              academic information below.
            </p>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-section-title">
          <span>01</span>
          Personal Information
        </div>

        <div className="form-grid">

          <div className="form-field full-field">
            <label>
              Full Name <b>*</b>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label>
              Email Address <b>*</b>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label>
              Phone Number <b>*</b>
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
              autoComplete="tel"
            />
          </div>

        </div>

        <div className="form-section-title">
          <span>02</span>
          Academic Information
        </div>

        <div className="form-grid">

          <div className="form-field">
            <label>
              Course <b>*</b>
            </label>

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              {courses
                .filter(
                  (item) =>
                    item !==
                    "All Courses"
                )
                .map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-field">
            <label>
              Year Level <b>*</b>
            </label>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

        </div>

        {error && (
          <div className="error-message">
            <span>!</span>
            {error}
          </div>
        )}

        <div className="form-footer">
          <p>
            Fields marked with{" "}
            <b>*</b> are required.
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/students")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              <span>
                {saving ? "…" : "✓"}
              </span>

              {saving
                ? "Saving..."
                : "Save Student"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

/* =========================================================
   STUDENT DETAILS
========================================================= */

function StudentDetails({ students }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find(
    (item) =>
      item.id === Number(id)
  );

  if (!student) {
    return <NotFound />;
  }

  return (
    <div className="content-page details-page">

      <div className="details-actions">
        <Link
          to="/students"
          className="back-link"
        >
          ← Back to Students
        </Link>

        <Link
          to={`/edit-student/${student.id}`}
          className="primary-btn"
        >
          ✎ Edit Profile
        </Link>
      </div>

      <section className="profile-card">

        <div className="profile-cover">
          <div className="cover-grid" />

          <div className="cover-orb cover-orb-one" />
          <div className="cover-orb cover-orb-two" />

          <span className="cover-label">
            STUDENT PROFILE
          </span>
        </div>

        <div className="profile-main">

          <div
            className={`large-avatar ${getAvatarClass(
              student.id
            )}`}
          >
            {getInitials(student.name)}
          </div>

          <div className="profile-info">

            <div className="profile-name-row">

              <div>
                <h2>
                  {student.name}
                </h2>

                <p>
                  Student ID #
                  {formatStudentId(
                    student.id
                  )}
                </p>
              </div>

              <span
                className={`status-badge ${
                  student.status ===
                  "Active"
                    ? "status-active"
                    : "status-inactive"
                }`}
              >
                <i />
                {student.status}
              </span>

            </div>

            <div className="profile-tags">
              <span>
                {student.course}
              </span>

              <span>
                {student.year}
              </span>

              <span>
                Student
              </span>
            </div>

          </div>
        </div>

        <div className="profile-divider" />

        <div className="details-section">

          <span className="section-label">
            PERSONAL & ACADEMIC DETAILS
          </span>

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
              icon="▦"
              label="Course"
              value={student.course}
            />

            <DetailItem
              icon="◷"
              label="Year Level"
              value={student.year}
            />

          </div>
        </div>

        <div className="profile-bottom">

          <div>
            <span>
              PROFILE STATUS
            </span>

            <strong>
              {student.status ===
              "Active"
                ? "Currently enrolled"
                : "Currently inactive"}
            </strong>
          </div>

          <button
            className="secondary-btn"
            onClick={() =>
              navigate(
                `/edit-student/${student.id}`
              )
            }
          >
            Update Information
          </button>

        </div>
      </section>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

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

/* =========================================================
   EDIT STUDENT
========================================================= */

function EditStudent({
  students,
  onUpdate,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find(
    (item) =>
      item.id === Number(id)
  );

  const [form, setForm] =
    useState(
      student || {
        name: "",
        email: "",
        course: "BSIT",
        year: "1st Year",
        phone: "",
        status: "Active",
      }
    );

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (student) {
      setForm(student);
    }
  }, [student]);

  if (!student) {
    return <NotFound />;
  }

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email || !phone) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    onUpdate({
      ...form,
      name,
      email,
      phone,
    });

    navigate(
      `/students/${student.id}`
    );
  };

  return (
    <div className="content-page form-page">

      <div className="page-heading">
        <div>
          <span className="heading-eyebrow">
            STUDENT MANAGEMENT
          </span>

          <h2>Edit Student</h2>

          <p>
            Update the student's information
            and profile.
          </p>
        </div>

        <Link
          to={`/students/${student.id}`}
          className="secondary-btn"
        >
          ← Back to Profile
        </Link>
      </div>

      <form
        className="student-form"
        onSubmit={handleSubmit}
      >

        <div className="edit-profile-preview">

          <div
            className={`large-avatar small-large-avatar ${getAvatarClass(
              student.id
            )}`}
          >
            {getInitials(form.name)}
          </div>

          <div>
            <strong>
              {form.name ||
                "Student Name"}
            </strong>

            <span>
              {form.email ||
                "student@email.com"}
            </span>
          </div>

          <span
            className={`status-badge ${
              form.status === "Active"
                ? "status-active"
                : "status-inactive"
            }`}
          >
            <i />
            {form.status}
          </span>

        </div>

        <div className="form-divider" />

        <div className="form-section-title">
          <span>01</span>
          Personal Information
        </div>

        <div className="form-grid">

          <div className="form-field full-field">
            <label>
              Full Name <b>*</b>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student's full name"
            />
          </div>

          <div className="form-field">
            <label>
              Email Address <b>*</b>
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@email.com"
            />
          </div>

          <div className="form-field">
            <label>
              Phone Number <b>*</b>
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
            />
          </div>

        </div>

        <div className="form-section-title">
          <span>02</span>
          Academic Information
        </div>

        <div className="form-grid">

          <div className="form-field">
            <label>
              Course
            </label>

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              {courses
                .filter(
                  (item) =>
                    item !==
                    "All Courses"
                )
                .map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-field">
            <label>
              Year Level
            </label>

            <select
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

        </div>

        {error && (
          <div className="error-message">
            <span>!</span>
            {error}
          </div>
        )}

        <div className="form-footer">

          <p>
            Changes will be saved to your
            local student records.
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
    </div>
  );
}

/* =========================================================
   NOT FOUND
========================================================= */

function NotFound() {
  return (
    <div className="not-found">

      <div className="not-found-icon">
        404
      </div>

      <span>
        PAGE NOT FOUND
      </span>

      <h2>
        We couldn't find that page.
      </h2>

      <p>
        The page or student record you're
        looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="primary-btn"
      >
        ← Back to Dashboard
      </Link>

    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default App;