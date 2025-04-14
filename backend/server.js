const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./teams.db"); // or the correct path to your DB

// Import database models
const { sequelize, Team } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Hardcoded student arrays (keep this as is)
const STUDENT_LISTS = {
  "CSE A": [
    "Daksh Sharma", "Tanmay Pravin Tate", "Deven Sharad Kshirsagar", "Aarush Pradeep Kote",
    "Lokhande Sejal Manoj", "Darshan Dhananjay Jagtap", "Rushil Jain", "Deshmukh Ayush Ashish",
    "Kadam Vaishnavi Shailendra", "Pawar Yuvraj Shailesh", "Bhorkar Jay Anand",
    "Hoshmit Rajesh Mahajan", "Vaidehee Susheel Belan", "Bhakti Dinesh Joshi",
    "Atharv Gajanan Chaware", "Kulkarni Avaneesh Yogesh", "Samihan Raj Sandbhor",
    "Riddhesh Yogesh Patil", "Londhe Rohan Rohit", "Sairam Sachin Pardeshi",
    "Om Sachin Pardeshi", "Aryan Madhukar Shinde", "Ishani Amol Badhe",
    "Bhamodkar Samruddhi Sandip", "Shaikh Saad Imran", "Shlok Chaitanya Shah",
    "Jog Arjun Kedar", "Purva Swanand Deshmukh", "Janavi Honrao", "Ranavare Ishan Nitin",
    "Abhiraj Pradeep Borade", "Goluguri Sulieman", "Ayush Chandrashekhar Pasalkar",
    "Aarushi Pankaj Jawale", "Deshpande Aarya Aniruddha", "Ishan Bhushan Dhaneshwar",
    "Jadhav Nikhil Raju", "Shaurya Rohit Shewale", "Telagamreddy Purnasai Saatvik",
    "Anish Chaitanya Rashinkar", "Aditya Singh Chauhan", "Aditya Jaydeep Shevate",
    "Lalit Vijay Patil", "Nimish Bhojraj Lanjewar", "Aditya Anil Patil",
    "Bhargav Athreya Munnaluri", "Pardeshi Samiksha Bipin", "Om Santosh Desai",
    "Aranya Nath Misra", "Armaan Kumar Rana", "Pilmenraj Glen Leslie",
    "Shwetank Prafulla Patil", "Nidhi Umakant Thakare", "Ashkan Altaf Tamboli",
    "Deep Dilip Salunkhe", "Krishnaraj Ravindra Shinde", "Aayush Abhijeet Patil",
    "Shivam Sachin Honrao", "Arnav Tushar Gandre", "Isha Satish Thube",
    "Attar Saniya Sameer", "Simran Ramdayal Ray", "Deokar Durva Dilip",
    "Vaidehi Prashant Mane", "Vedant Sachin Muthiyan", "Kelkar Amogh Amit",
    "Kulkarni Ashutosh Ashish", "Taniska Ashish Dhanlonhe", "Yognandan Narayan Bhere",
    "Avani Pravin Chandsare", "Giridhar Krishna Sunil", "Harshavardhan Kailas Sasar",
    "Samarth Shivaji Kokate", "Raj Deepak Chavan"
  ],
  "CSE B": [
    "Reeya Mandar Keskar", "Radha Prasad Kurhekar", "Deshmukh Aarya Dhananjay",
    "Aryan Swanand Kulkarni", "Khushal Sanjay Diwate", "Ayush Prashant Patil",
    "Apeksha Ishtaling Parashetti", "Amar Nath Dwivedi", "Vaishnav Maruti Kaspate",
    "Kulkarni Sanchita Suhas", "Pawar Rushikesh Pramod", "Aarti Dashrath Raut",
    "Gadiya Niraj Nandlal", "Reet Jeevan Shewale", "Oswal Vidhi Hasmukh",
    "Ananya Rohidas Gawari", "Samarth Sachin Ghenand", "Tanisha Jitesh Gandhi",
    "Giri Unmesh Prakash", "Omkar Surendra Purav", "Siddhant Yogesh Pasalkar",
    "Aniket Abhay Joshi", "Desai Vedang Dipesh", "Kshiteej Abhijeet Toradmal",
    "Priyal Gulab Patil", "Radhika Sanjay Sogam", "Yash Dnyaneshwar Narale",
    "Khushi Rupareliya", "Nair Vinit Biju", "Shifa Murad Khan", "Khushi Manoj Patil",
    "Ibrahim Abdul Jalil Kache", "Pathare Tanishk Santosh", "Tamobli Nakul Atul",
    "Patil Sarthak Vitthal", "Aryan Bajirao Suryawanshi", "Shaikh Zidan Ghudusab",
    "Vyas Tanmay Navaratan", "Takawale Siddhi Sunil Vaishali", "Jaid Vedant Satish",
    "Abhinav Raj", "Bhilare Vedant", "Date Vangmayee Tushar", "Harsh Harihar Kulkarni",
    "Mote Shravani Shantanu", "Ishan Rahul Jabade", "Anirudha Sachin Thite",
    "Ankit Amol Gaware", "Maithili Mahesh Pene", "Motwani Riya Jay",
    "Archit Anil Kadam", "Sparsh Sagar Doshi", "Palak Pankaj Gadhari",
    "Mohammad Rehan Mushahid Ansari", "Pawar Prithviraj Chandrakant",
    "Yadav Samruddhi Anish Padmashree", "Rasane Arnav Manoj", "Swasti Pravin Shinde",
    "Vedant Raju Ilag", "Ganjave Tanaya Prashant", "Mann Singhvi",
    "Durvank Pankaj Borole", "Vaishnavi Prakash Jadhav", "Pratham Nanagiri",
    "Abhilasha Manoj Gandhi", "Rajarshi Ishita Sandeep", "Tejas Sachin Shelar",
    "Saarth Vipin Borole", "Masul Aryan Hilal", "Kanojia Palak Prashant",
    "Pratik Bipinkumar Mishra", "Shinde Atharva Rohidas", "Aditya Prakash Kunjir",
    "Pranav Aravindrao Suryawanshi", "Kushagri Saxena"
  ],
  "AIDS": [
    "Vedant Prakash Parab", "Gujar Yash Nilesh", "Shriya Shirish Sabnis", "Gauri Revaji Auti",
    "Biswas Aaliya Sohail", "Sanika Kiran Deshmukh", "Kshitij Vijay Shinde", "Ansh Dnyaneshwar Thakare",
    "Rutav Ritesh Mehta", "Tejas Deepak Maskar", "Shaurya Ajay Panhale", "Shaikh Mehran Majid",
    "Yash Ganesh Gadiwan", "Sreejit Majumder", "Amrute Aaryan Jitendra", "Vivaan Varun Mathur",
    "Vedika Kapoor", "Soham Sachin Vidhate", "Shravani Kiran Ruikar", "Om Vinayak Honrao",
    "Darshan Vinayak Nayak", "Manish Narayan Shinde", "Patil Vedika Dilip", "Manthan Moondra",
    "Gargi Avinash Yekhande", "Ritvik Yogesh Kamble", "Isha Gajanan Kuchekar", "Prathamesh Nilesh Tupe",
    "Aditya Prashant Bodke", "Lavya Singh Chauhan", "Toshika Mukesh Bansal", "Patil Vaibhavi Satish",
    "Saanvi Jeetendra Dhakane", "Shreyash Shammi Ranjan", "Aadi Vishal Hanumante", "Soham Nigam",
    "Rishabh Shreyans Patani", "Pranshu Singh", "Sarvesh  Rakesh Alai", "Tanish Nstrnfts Bhavsar",
    "Aryan Niranjan More", "Daksh Paul", "Isha Pashant Kale", "Harsh Sunil Gidwani",
    "Pushkar  Rakesh Patil", "Aishi Anurag Srivastava", "Anushka Nitin Ugale", "Vansh Parashar",
    "Gayatri Pravin Swami", "Samarth Mahesh Bolkotgi", "Nakshatra Kakani", "Jain Suneri Amit",
    "Shelke Yash Kishor", "Vrunda Kirtibhai Borisagar", "Zoya Yunus Sayyad", "Anaya Sharma",
    "Nema Essha", "Gaiki Lokesh Abhijit", "Ojas Rajshekhar Lature", "Ghodke Aahan Sachin",
    "Sujay Heramb Rasal", "Ajinkya Dattu Sonawane", "Manmohan Shrinivas Parge", "Shivtej Dipak Gaikwad",
    "Wagh Yashraj Nitin", "Anushka Manoj Wani", "Vidhi Rohan Rathod", "Aryan Amar Jadhav",
    "Raj Umesh Shinde", "Tanishka Rajendra Parkale", "Sakshi Kiran Talegaonkar",
    "Shashwath Chandrashekhar Shinde", "Hardik Dhanraj Chaudhary", "Drishti Rahul Rathod",
    "Nicket Shah", "Reet Kaur Bhasin", "Parth Prashant Tupe", "Vallabh Shahaji Pawar",
    "Aashka Akash Porwal", "Samuel Shadrak Chol"
  ]
};

const MENTORS = [
  "Jyoti Khurpude (Mante)", "Sanjivani Kulkarni", "Mrunal Fatangare", "Hemlata Ohal",
  "Farahhdeeba Shaikh", "Prerana Patil", "Yogesh Patil", "Vilas Rathod",
  "Pradeep Paygude", "Kajal Chavan", "Megha Dhotey", "Pallavi Nehete",
  "Nita Dongre", "Mrunal Aware", "Shilpa Shitole", "Vaishali Langote",
  "Sulkshana Malwade"
];

// ✅ API: Get available students by department
app.get("/api/students/:department", async (req, res) => {
  const dept = req.params.department;
  console.log("Request for students in department:", dept);
  
  // Remove any extra parameters that might be in the URL (like :1)
  const cleanDept = dept.split(':')[0]; // This will handle cases like "AIDS:1"
  
  const allStudents = STUDENT_LISTS[cleanDept];
  if (!allStudents) {
    console.error("Invalid department requested:", cleanDept);
    return res.status(400).json({ error: "Invalid department" });
  }

  try {
    // Get all teams from database
    const teams = await Team.findAll();
    console.log("Successfully retrieved teams:", teams.length);
    
    const registered = new Set();
    teams.forEach(team => {
      registered.add(team.member1);
      registered.add(team.member2);
      registered.add(team.member3);
      registered.add(team.member4);
    });
    
    const available = allStudents.filter(s => !registered.has(s));
    console.log("Available students count:", available.length);
    res.json(available);
  } catch (err) {
    console.error("Error retrieving team data:", err);
    res.status(500).json({ error: "Error retrieving team data" });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    const teams = await Team.findAll();
    console.log("Successfully loaded teams:", teams.length);
    
    // Format the output to match the old CSV format
    const formattedTeams = teams.map(team => ({
      "Team Name": team.teamName,
      "Department": team.department,
      "Member 1": team.member1,
      "Member 2": team.member2,
      "Member 3": team.member3,
      "Member 4": team.member4,
      "Mentor 1": team.mentor1,
      "Mentor 2": team.mentor2,
      "Mentor 3": team.mentor3,
      "Mentor 4": team.mentor4,
      "Idea 1": team.idea1,
      "Idea 2": team.idea2,
      "Idea 3": team.idea3
    }));
    
    res.json(formattedTeams);
  } catch (err) {
    console.error("Error loading teams:", err);
    res.status(500).json({ error: "Error loading teams" });
  }
});

app.get("/api/mentors", (req, res) => {
  res.json(MENTORS);
});

app.post("/api/register", async (req, res) => {
  const { teamName, department, students, mentors, ideas } = req.body;
  
  if (!students || !mentors || !ideas) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  if (students.length !== 4 || mentors.length !== 4 || ideas.length !== 3) {
    return res.status(400).json({ error: "Incomplete team submission" });
  }
  
  try {
    // Create a new team in the database
    await Team.create({
      teamName: teamName,
      department: department,
      member1: students[0],
      member2: students[1],
      member3: students[2],
      member4: students[3],
      mentor1: mentors[0],
      mentor2: mentors[1],
      mentor3: mentors[2],
      mentor4: mentors[3],
      idea1: ideas[0],
      idea2: ideas[1],
      idea3: ideas[2]
    });
    
    res.status(200).json({ message: "Team registered successfully" });
  } catch (err) {
    console.error("Failed to register team:", err);
    res.status(500).json({ error: "Failed to register team" });
  }
});

// New API: Get remaining students for a department
app.get("/api/remaining/:department", async (req, res) => {
  const dept = req.params.department.split(':')[0];
  const allStudents = STUDENT_LISTS[dept];
  if (!allStudents) return res.status(400).json({ error: "Invalid department" });

  try {
    const teams = await Team.findAll();
    const registered = new Set();
    teams.forEach(team => {
      registered.add(team.member1);
      registered.add(team.member2);
      registered.add(team.member3);
      registered.add(team.member4);
    });
    
    const available = allStudents.filter(s => !registered.has(s));
    res.json(available);
  } catch (err) {
    console.error("Error loading remaining students:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add this new endpoint to your server.js
app.get("/api/export/teams", async (req, res) => {
  try {
    const teams = await Team.findAll();
    
    // Format the data as CSV
    let csv = "Team Name,Department,Member 1,Member 2,Member 3,Member 4,Mentor 1,Mentor 2,Mentor 3,Mentor 4,Idea 1,Idea 2,Idea 3\n";
    
    teams.forEach(team => {
      csv += `"${team.teamName}","${team.department}","${team.member1}","${team.member2}","${team.member3}","${team.member4}","${team.mentor1}","${team.mentor2}","${team.mentor3}","${team.mentor4}","${team.idea1}","${team.idea2}","${team.idea3}"\n`;
    });
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=teams.csv');
    
    res.send(csv);
  } catch (err) {
    console.error("Error exporting teams:", err);
    res.status(500).json({ error: "Failed to export teams" });
  }
});
app.delete("/api/teams/:teamName", (req, res) => {
  const teamName = req.params.teamName;

  const query = `DELETE FROM teams WHERE "Team Name" = ?`;
  db.run(query, [teamName], function (err) {
    if (err) {
      console.error("Error deleting team:", err);
      res.status(500).json({ message: "Failed to delete team" });
    } else {
      res.json({ message: "Team deleted successfully" });
    }
  });
});
// Initialize database and start server
async function startServer() {
  try {
    // Sync database (create tables if they don't exist)
    await sequelize.sync();
    console.log("Database synchronized");

    // Import existing data if needed
    if (fs.existsSync(path.join(__dirname, "data/teams.csv"))) {
      await importExistingData();
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Function to import existing data from CSV to database
async function importExistingData() {
  try {
    const csv = require('fast-csv');
    const fs = require('fs');
    const TEAM_FILE = path.join(__dirname, "data/teams.csv");
    
    // Check if we already have teams in the database
    const existingCount = await Team.count();
    if (existingCount > 0) {
      console.log("Database already has teams, skipping import");
      return;
    }
    
    return new Promise((resolve, reject) => {
      const teams = [];
      fs.createReadStream(TEAM_FILE)
        .pipe(csv.parse({ headers: true }))
        .on('data', (data) => {
          teams.push({
            teamName: data["Team Name"],
            department: data["Department"],
            member1: data["Member 1"],
            member2: data["Member 2"],
            member3: data["Member 3"],
            member4: data["Member 4"],
            mentor1: data["Mentor 1"],
            mentor2: data["Mentor 2"],
            mentor3: data["Mentor 3"],
            mentor4: data["Mentor 4"],
            idea1: data["Idea 1"],
            idea2: data["Idea 2"],
            idea3: data["Idea 3"]
          });
        })
        .on('end', async () => {
          try {
            if (teams.length > 0) {
              await Team.bulkCreate(teams);
              console.log(`Successfully imported ${teams.length} teams from CSV`);
            }
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (error) => reject(error));
    });
  } catch (error) {
    console.error("Error importing existing data:", error);
  }
}

// Start the server
startServer();