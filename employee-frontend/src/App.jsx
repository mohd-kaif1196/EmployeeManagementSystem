import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // API
  // =========================
  const API_URL = "http://localhost:8080/api/employees";

  // =========================
  // EMPLOYEE DATA
  // =========================
  const [employees, setEmployees] = useState([]);

  // =========================
  // PAGE STATE
  // =========================
  const [activePage, setActivePage] = useState("Dashboard");

  // =========================
  // ADD EMPLOYEE FORM
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");

  // =========================
  // MESSAGE
  // =========================
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // SEARCH
  // =========================
  const [searchTerm, setSearchTerm] = useState("");

  // =========================
  // EDIT EMPLOYEE
  // =========================
  const [editingEmployee, setEditingEmployee] = useState(null);

  // =========================
  // GET ALL EMPLOYEES
  // =========================
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        return response.json();
      })
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);

        setMessage("Failed to load employees.");
        setMessageType("danger");
      });
  }, []);

  // =========================
  // ADD EMPLOYEE
  // =========================
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      department.trim() === "" ||
      salary === ""
    ) {
      setMessage("Please fill all fields.");
      setMessageType("danger");
      return;
    }

    const newEmployee = {
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      salary: Number(salary),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const savedEmployee = await response.json();

      setEmployees((prevEmployees) => [
        ...prevEmployees,
        savedEmployee,
      ]);

      setName("");
      setEmail("");
      setDepartment("");
      setSalary("");

      setMessage("Employee added successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error adding employee:", error);

      setMessage("Failed to add employee.");
      setMessageType("danger");
    }
  };

  // =========================
  // EDIT EMPLOYEE
  // =========================
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setMessage("");
  };

  // =========================
  // UPDATE EMPLOYEE
  // =========================
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (
      editingEmployee.name.trim() === "" ||
      editingEmployee.email.trim() === "" ||
      editingEmployee.department.trim() === "" ||
      editingEmployee.salary === ""
    ) {
      setMessage("Please fill all fields.");
      setMessageType("danger");
      return;
    }

    const updatedEmployee = {
      name: editingEmployee.name.trim(),
      email: editingEmployee.email.trim(),
      department: editingEmployee.department.trim(),
      salary: Number(editingEmployee.salary),
    };

    try {
      const response = await fetch(
        `${API_URL}/${editingEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEmployee),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      const savedEmployee = await response.json();

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === savedEmployee.id
            ? savedEmployee
            : employee
        )
      );

      setEditingEmployee(null);
      setMessage("Employee updated successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error updating employee:", error);
      setMessage("Failed to update employee.");
      setMessageType("danger");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setMessage("");
  };

  // =========================
  // DELETE EMPLOYEE
  // =========================
  const handleDeleteEmployee = async (id) => {
    const employee = employees.find(
      (employee) => employee.id === id
    );

    if (!employee) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setEmployees((prevEmployees) =>
        prevEmployees.filter(
          (employee) => employee.id !== id
        )
      );

      setMessage("Employee deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error deleting employee:", error);
      setMessage("Failed to delete employee.");
      setMessageType("danger");
    }
  };

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================
  const totalEmployees = employees.length;

  const departments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const averageSalary =
    totalEmployees > 0
      ? employees.reduce(
          (total, employee) => total + employee.salary,
          0
        ) / totalEmployees
      : 0;

  // =========================
  // SEARCH FILTER
  // =========================
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex min-vh-100">

      {/* =========================
          SIDEBAR
      ========================= */}
      <div
        className="bg-dark text-white p-3"
        style={{
          width: "250px",
          minHeight: "100vh",
        }}
      >
        <h3 className="text-center mb-4">
          Employee MS
        </h3>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Dashboard"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Employees"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Employees")}
        >
          👥 Employees
        </button>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Add Employee"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Add Employee")}
        >
          ➕ Add Employee
        </button>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Search"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Search")}
        >
          🔍 Search
        </button>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Reports"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Reports")}
        >
          📊 Reports
        </button>

        <button
          className={`btn w-100 text-start mb-2 ${
            activePage === "Settings"
              ? "btn-primary"
              : "btn-dark"
          }`}
          onClick={() => setActivePage("Settings")}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="flex-grow-1 bg-light">

        {/* TOP NAVBAR */}
        <nav className="navbar bg-white shadow-sm px-4">
          <span className="navbar-brand fw-bold">
            {activePage}
          </span>

          <span className="text-muted">
            Welcome, Admin 👋
          </span>
        </nav>

        <div className="container-fluid p-4">

          {/* =========================
              DASHBOARD
          ========================= */}
          {activePage === "Dashboard" && (
            <>
              <h2 className="mb-4">
                Dashboard
              </h2>

              <div className="row g-4 mb-4">

                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">
                        Total Employees
                      </h6>

                      <h2 className="fw-bold">
                        {totalEmployees}
                      </h2>

                      <p className="text-success mb-0">
                        Employees registered
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">
                        Departments
                      </h6>

                      <h2 className="fw-bold">
                        {departments}
                      </h2>

                      <p className="text-primary mb-0">
                        Active departments
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h6 className="text-muted">
                        Average Salary
                      </h6>

                      <h2 className="fw-bold">
                        ₹
                        {Math.round(
                          averageSalary
                        ).toLocaleString("en-IN")}
                      </h2>

                      <p className="text-warning mb-0">
                        Average employee salary
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* RECENT EMPLOYEES */}
              <div className="card shadow-sm border-0">
                <div className="card-body">

                  <h4 className="mb-3">
                    Recent Employees
                  </h4>

                  <div className="table-responsive">
                    <table className="table table-hover">

                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Salary</th>
                        </tr>
                      </thead>

                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.department}</td>
                            <td>
                              ₹
                              {Number(
                                employee.salary
                              ).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* =========================
              EMPLOYEES PAGE
          ========================= */}
          {activePage === "Employees" && (
            <>
              <h2 className="mb-4">
                All Employees
              </h2>

              {message && (
                <div
                  className={`alert alert-${messageType}`}
                >
                  {message}
                </div>
              )}

              <div className="card shadow-sm border-0">
                <div className="card-body">

                  <div className="table-responsive">
                    <table className="table table-hover">

                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Salary</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {employees.length > 0 ? (
                          employees.map((employee) => (
                            <tr key={employee.id}>

                              <td>{employee.id}</td>

                              <td>{employee.name}</td>

                              <td>{employee.email}</td>

                              <td>
                                {employee.department}
                              </td>

                              <td>
                                ₹
                                {Number(
                                  employee.salary
                                ).toLocaleString("en-IN")}
                              </td>

                              <td>
                                <div className="d-flex gap-2">

                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() =>
                                      handleEditEmployee(
                                        employee
                                      )
                                    }
                                  >
                                    ✏️ Edit
                                  </button>

                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      handleDeleteEmployee(
                                        employee.id
                                      )
                                    }
                                  >
                                    🗑️ Delete
                                  </button>

                                </div>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center"
                            >
                              No employees available.
                            </td>
                          </tr>
                        )}
                      </tbody>

                    </table>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* =========================
              ADD EMPLOYEE
          ========================= */}
          {activePage === "Add Employee" && (
            <>
              <h2 className="mb-4">
                Add Employee
              </h2>

              <div className="card shadow-sm border-0">
                <div className="card-body">

                  {message && (
                    <div
                      className={`alert alert-${messageType}`}
                    >
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAddEmployee}>

                    <div className="row">

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Name
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter employee name"
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Email
                        </label>

                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter employee email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                        />
                      </div>

                    </div>

                    <div className="row">

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Department
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter department"
                          value={department}
                          onChange={(e) =>
                            setDepartment(e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Salary
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter salary"
                          value={salary}
                          onChange={(e) =>
                            setSalary(e.target.value)
                          }
                        />
                      </div>

                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Add Employee
                    </button>

                  </form>

                </div>
              </div>
            </>
          )}

          {/* =========================
              SEARCH
          ========================= */}
          {activePage === "Search" && (
            <>
              <h2 className="mb-4">
                Search Employees
              </h2>

              <div className="card shadow-sm border-0">

                <div className="card-body">

                  <div className="mb-4">

                    <label className="form-label fw-bold">
                      Search Employee
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        🔍
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(e.target.value)
                        }
                      />

                    </div>

                  </div>

                  <h5 className="mb-3">
                    Search Results
                  </h5>

                  {filteredEmployees.length > 0 ? (
                    <div className="table-responsive">

                      <table className="table table-hover">

                        <thead className="table-dark">
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Salary</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredEmployees.map(
                            (employee) => (
                              <tr key={employee.id}>

                                <td>{employee.id}</td>

                                <td>{employee.name}</td>

                                <td>{employee.email}</td>

                                <td>
                                  {employee.department}
                                </td>

                                <td>
                                  ₹
                                  {Number(
                                    employee.salary
                                  ).toLocaleString("en-IN")}
                                </td>

                              </tr>
                            )
                          )}
                        </tbody>

                      </table>

                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      No employees found.
                    </div>
                  )}

                </div>
              </div>
            </>
          )}

          {/* =========================
              EDIT EMPLOYEE MODAL
          ========================= */}
          {editingEmployee && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >

              <div className="modal-dialog modal-lg">

                <div className="modal-content">

                  <div className="modal-header">

                    <h5 className="modal-title">
                      Edit Employee
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCancelEdit}
                    ></button>

                  </div>

                  <div className="modal-body">

                    {message && (
                      <div
                        className={`alert alert-${messageType}`}
                      >
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleUpdateEmployee}>

                      <div className="row">

                        <div className="col-md-6 mb-3">

                          <label className="form-label">
                            Name
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            value={editingEmployee.name}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                name: e.target.value,
                              })
                            }
                          />

                        </div>

                        <div className="col-md-6 mb-3">

                          <label className="form-label">
                            Email
                          </label>

                          <input
                            type="email"
                            className="form-control"
                            value={editingEmployee.email}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                email: e.target.value,
                              })
                            }
                          />

                        </div>

                      </div>

                      <div className="row">

                        <div className="col-md-6 mb-3">

                          <label className="form-label">
                            Department
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            value={
                              editingEmployee.department
                            }
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                department:
                                  e.target.value,
                              })
                            }
                          />

                        </div>

                        <div className="col-md-6 mb-3">

                          <label className="form-label">
                            Salary
                          </label>

                          <input
                            type="number"
                            className="form-control"
                            value={editingEmployee.salary}
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                salary: e.target.value,
                              })
                            }
                          />

                        </div>

                      </div>

                      <div className="d-flex gap-2">

                        <button
                          type="submit"
                          className="btn btn-success"
                        >
                          Update Employee
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>

                      </div>

                    </form>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =========================
              REPORTS
          ========================= */}
          {activePage === "Reports" && (
            <>
              <h2 className="mb-4">
                Reports
              </h2>

              <div className="card shadow-sm border-0">

                <div className="card-body">

                  <h5>
                    Employee Reports
                  </h5>

                  <p className="text-muted mb-0">
                    Reports section will be added in
                    the next step.
                  </p>

                </div>

              </div>
            </>
          )}

          {/* =========================
              SETTINGS
          ========================= */}
          {activePage === "Settings" && (
            <>
              <h2 className="mb-4">
                Settings
              </h2>

              <div className="card shadow-sm border-0">

                <div className="card-body">

                  <h5>
                    Application Settings
                  </h5>

                  <p className="text-muted mb-0">
                    Settings section will be added
                    later.
                  </p>

                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;