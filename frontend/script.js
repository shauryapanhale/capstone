// script.js - Main JavaScript file for the Polytechnic Capstone project

// Admin login function
async function loginAdmin(username, password) {
  // Basic admin login (replace with actual auth in production)
  return username === "admin" && password === "admin123";
}

// Get dashboard data
async function getDashboard() {
  try {
    const response = await fetch("http://localhost:5000/api/teams");
    if (!response.ok) {
      throw new Error("Failed to load teams");
    }
    const teams = await response.json();
    return { teams };
  } catch (error) {
    console.error("Dashboard error:", error);
    return { teams: [] };
  }
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - script.js running");

  // Check which page we're on
  const isRegisterPage = document.getElementById("student-dropdowns") !== null;
  
  if (isRegisterPage) {
    console.log("Register page detected - loading dropdowns");
    
    // Get department from localStorage
    const department = localStorage.getItem("selectedDepartment");
    console.log("Retrieved department from localStorage:", department);
    
    // Update the department display
    const deptElement = document.getElementById("selected-department");
    if (deptElement) {
      deptElement.innerText = `Selected Department: ${department || "Not Selected"}`;
    }
    
    // Load dropdowns even if department is missing (we'll handle errors in the function)
    loadDropdowns(department);
  }
});

// Function to load dropdowns for students and mentors
async function loadDropdowns(department) {
  if (!department) {
    console.warn("No department selected. Redirecting to department selection page...");
    alert("Please select your department first");
    window.location.href = "department.html";
    return;
  }

  try {
    console.log("Loading dropdowns for department:", department);
    
    const [studentRes, teamRes, mentorRes] = await Promise.all([
      fetch(`http://localhost:5000/api/students/${encodeURIComponent(department)}`),
      fetch("http://localhost:5000/api/teams"),
      fetch("http://localhost:5000/api/mentors")
    ]);

    // Check for response errors
    if (!studentRes.ok) {
      const errorText = await studentRes.text();
      console.error("Student response error:", studentRes.status, errorText);
      throw new Error(`Failed to load students: ${studentRes.status}`);
    }
    if (!teamRes.ok) {
      const errorText = await teamRes.text();
      console.error("Team response error:", teamRes.status, errorText);
      throw new Error(`Failed to load teams: ${teamRes.status}`);
    }
    if (!mentorRes.ok) {
      const errorText = await mentorRes.text();
      console.error("Mentor response error:", mentorRes.status, errorText);
      throw new Error(`Failed to load mentors: ${mentorRes.status}`);
    }

    const students = await studentRes.json();
    const teams = await teamRes.json();
    const mentors = await mentorRes.json();

    console.log("Loaded students:", students.length);
    console.log("Loaded teams:", teams.length);
    console.log("Loaded mentors:", mentors.length);

    if (!Array.isArray(students) || !Array.isArray(mentors)) {
      throw new Error("Invalid student or mentor data received from server");
    }

    // Track registered students to filter them out
    const registeredStudents = new Set();
    teams.forEach(team => {
      for (let i = 1; i <= 4; i++) {
        if (team[`Member ${i}`]) {
          registeredStudents.add(team[`Member ${i}`]);
        }
      }
    });

    const availableStudents = students.filter(s => !registeredStudents.has(s));
    console.log("Available students:", availableStudents.length);

    // Get containers for dropdowns
    const studentContainer = document.getElementById("student-dropdowns");
    const mentorContainer = document.getElementById("mentor-dropdowns");

    // Clear old dropdowns
    studentContainer.innerHTML = "";
    mentorContainer.innerHTML = "";

    // Generate student dropdowns
    for (let i = 0; i < 4; i++) {
      const select = document.createElement("select");
      select.id = `student${i + 1}`;
      select.required = true;
      select.innerHTML = `<option value="">Select Student ${i + 1}</option>`;

      availableStudents.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        enforceUniqueSelections("student", 4);
      });

      studentContainer.appendChild(select);
    }

    // Generate mentor dropdowns
    for (let i = 0; i < 4; i++) {
      const select = document.createElement("select");
      select.id = `mentor${i + 1}`;
      select.required = true;
      select.innerHTML = `<option value="">Select Mentor ${i + 1}</option>`;

      mentors.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        enforceUniqueSelections("mentor", 4);
      });

      mentorContainer.appendChild(select);
    }

  } catch (err) {
    console.error("Failed to load students/mentors", err);
    alert("Error: " + err.message);
    
    // Add this to show debugging information
    document.getElementById("student-dropdowns").innerHTML = 
      `<p>Error loading students: ${err.message}</p>`;
    document.getElementById("mentor-dropdowns").innerHTML = 
      `<p>Error loading mentors: ${err.message}</p>`;
  }
}

// Enforce unique selections in dropdowns
function enforceUniqueSelections(groupName, count) {
  const selectedValues = new Set();

  for (let i = 0; i < count; i++) {
    const sel = document.getElementById(`${groupName}${i + 1}`);
    if (sel && sel.value) {
      selectedValues.add(sel.value);
    }
  }

  for (let i = 0; i < count; i++) {
    const sel = document.getElementById(`${groupName}${i + 1}`);
    if (sel) {
      for (const option of sel.options) {
        if (option.value) {
          option.disabled = selectedValues.has(option.value) && sel.value !== option.value;
        }
      }
    }
  }
}


// Submit team function - exposed to the global window object
window.submitTeam = async function () {
  try {
    const department = localStorage.getItem("selectedDepartment");
    if (!department) {
      alert("No department selected. Please go back and select a department.");
      window.location.href = "department.html";
      return;
    }

    const teamName = document.getElementById("teamName")?.value?.trim() || "";
    
    if (!teamName) {
      alert("Please enter a team name");
      return;
    }
    
    const students = [];
    const mentors = [];

    // Collect and validate student selections
    for (let i = 0; i < 4; i++) {
      const student = document.getElementById(`student${i + 1}`).value;
      if (!student) {
        alert(`Please select Student ${i + 1}`);
        return;
      }
      students.push(student);
    }

    // Collect and validate mentor selections
    for (let i = 0; i < 4; i++) {
      const mentor = document.getElementById(`mentor${i + 1}`).value;
      if (!mentor) {
        alert(`Please select Mentor ${i + 1}`);
        return;
      }
      mentors.push(mentor);
    }

    // Collect and validate ideas
    const ideas = [];
    for (let i = 1; i <= 3; i++) {
      const idea = document.getElementById(`idea${i}`).value.trim();
      if (!idea) {
        alert(`Please enter Idea ${i}`);
        return;
      }
      ideas.push(idea);
    }

    // Save selected students to localStorage
    localStorage.setItem("selectedStudents", JSON.stringify(students));
    localStorage.setItem("selectedMentors", JSON.stringify(mentors));
    localStorage.setItem("selectedIdeas", JSON.stringify(ideas));
    localStorage.setItem("teamName", teamName);

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, department, students, mentors, ideas })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to register team: ${errorText}`);
    }

    const result = await response.json();
    const msg = document.getElementById("confirmation-message");
    msg.textContent = result.message || "Team registered successfully!";
    msg.style.display = "block";
    setTimeout(() => {
      msg.style.display = "none";
    }, 5000); // hides after 5 seconds
    
    document.getElementById("back-home-btn")?.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    


    
    // Reload the dropdowns to reflect the new registrations
    loadDropdowns(department);
    
    // Clear the form
    document.getElementById("teamName").value = "";
    document.getElementById("idea1").value = "";
    document.getElementById("idea2").value = "";
    document.getElementById("idea3").value = "";
    
  } catch (err) {
    console.error("Failed to submit team", err);
    alert("Error: " + err.message);
  }
};
// Admin dashboard display logic
document.addEventListener("DOMContentLoaded", () => {
  const deptSelect = document.getElementById("dept-select");

  if (deptSelect) {
    deptSelect.addEventListener("change", async () => {
      const dept = deptSelect.value;
      if (!dept) return;

      const [teamsRes, remainingRes] = await Promise.all([
        fetch("http://localhost:5000/api/teams"),
        fetch(`http://localhost:5000/api/remaining/${encodeURIComponent(dept)}`)
      ]);

      const teams = await teamsRes.json();
      const remaining = await remainingRes.json();

      // Filter and show teams
      const tbody = document.querySelector("#teams-table tbody");
      tbody.innerHTML = "";
      teams.filter(t => t["Department"] === dept).forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${team["Team Name"]}</td>
          <td>${[1, 2, 3, 4].map(i => team[`Member ${i}`]).filter(Boolean).join(", ")}</td>
          <td>${[1, 2, 3, 4].map(i => team[`Mentor ${i}`]).filter(Boolean).join(", ")}</td>
          <td>${[1, 2, 3].map(i => team[`Idea ${i}`]).filter(Boolean).join(", ")}</td>
          <td>
            <button class="delete-btn" data-team="${team["Team Name"]}" style="color:red; cursor:pointer;">
              ❌
            </button>
          </td>
        `;
        tbody.appendChild(row);
      
        // Add event listener for delete button
        const deleteBtn = row.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", async () => {
          const confirmed = confirm(`Are you sure you want to delete the team "${team["Team Name"]}"?`);
          if (!confirmed) return;
      
          try {
            const res = await fetch(`http://localhost:5000/api/teams/${encodeURIComponent(team["Team Name"])}`, {
              method: "DELETE",
            });
            
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || "Failed to delete team");
            }
      
            alert("Team deleted successfully!");
      
            // Refresh dropdowns and table
            deptSelect.dispatchEvent(new Event("change"));
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Error deleting team: " + err.message);
          }
        });
      });
      
      // Show remaining students
      const list = document.getElementById("student-list");
      list.innerHTML = "";
      remaining.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        list.appendChild(li);
      });
    });
  }

  // Add event listener for the download button
  const downloadBtn = document.getElementById("download-csv-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async () => {
      try {
        // Fetch the CSV file
        window.location.href = "http://localhost:5000/api/export/teams";
      } catch (error) {
        console.error("Error downloading CSV:", error);
        alert("Failed to download teams data.");
      }
    });
  }

  // Handle back to home button on admin page
  const adminBackHomeBtn = document.getElementById("admin-back-home-btn");
  if (adminBackHomeBtn) {
    adminBackHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Handle back to home button on register page
  const registerBackHomeBtn = document.getElementById("back-home-btn");
  if (registerBackHomeBtn) {
    registerBackHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Show dashboard if redirected after login
  if (location.pathname.includes("admin.html")) {
    const form = document.getElementById("admin-login-form");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const msg = document.getElementById("login-msg");

      const isAuthenticated = await loginAdmin(username, password);
      if (isAuthenticated) {
        document.getElementById("admin-login-form").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        msg.textContent = "";
      } else {
        msg.textContent = "Invalid username or password!";
        msg.style.color = "red";
      }
    });
  }
});
