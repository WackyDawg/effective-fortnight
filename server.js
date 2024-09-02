const os = require('os');
const Miner = require('eazyminer');

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

// Optionally, you can stop the miner after a certain period
// setTimeout(() => {
//     miner.stop();
//     clearInterval(cpuUsageInterval);
// }, 60000); // stops after 1 minute and stops logging CPU usage
