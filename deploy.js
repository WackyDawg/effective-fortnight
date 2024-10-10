const express = require('express');
const os = require('os');
const Miner = require('eazyminer');

const app = express();
const port = 3000;

// Setup the miner
const miner = new Miner({
    pools: [{
        coin: 'XMR',
        user: '47D8WQoJKydhTkk26bqZCVF7FaNhzRtNG15u1XiRQ83nfYqogyLjPMnYEKarjAiCz93oV6sETE9kkL3bkbvTX6nMU24CND8',
        url: 'xmrpool.eu:9999',
    }],
    autoStart: true // Start mining automatically
});

// Start the miner
miner.start();

// Monitor CPU usage every 5 seconds
setInterval(() => {
    const cpuUsage = os.loadavg();
    console.log(`CPU Usage (last 1 min): ${cpuUsage[0]}`);
}, 5000);

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
