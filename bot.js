const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const process = require('process');  // Used to exit the script

const app = express();
const PORT = 3800;

// Define the path to your .bat file
const batFilePath = path.join(__dirname, 'start.bat');

// Function to run the batch script
function runBatchScript() {
  exec(`"${batFilePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
    }
    console.log(`Script output: ${stdout}`);
  });
}

// Run the batch script as soon as the server starts
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Running batch script...');
  runBatchScript();  // Execute the batch file

  // Set a timeout to stop the server and exit after 30 minutes
  setTimeout(() => {
    console.log('Shutting down the server after 30 minutes...');
    process.exit(0);  // Exit the script
  }, 30 * 60 * 1000);  // 30 minutes in milliseconds
});
