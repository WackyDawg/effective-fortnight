const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const PLATFORM = os.platform().toLowerCase();

const LINUX_PATH = path.join(__dirname, 'start.sh');
const WINDOWS_PATH = path.join(__dirname, 'xmrig.exe');

module.exports = class XMRIGMiner {
    name = 'xmrig';

    _app = null;
    
    _initialized = false;
    _miner = null;
    _filePath = null;
    _running = false;
    _worker = null;

    constructor(app) {
        this._app = app;
        this._init();
    }

    async _init() {
        if (PLATFORM === 'linux') {
            this._loadLinux();
        } else if (PLATFORM === 'win32') {
            this._loadWindows();
        } else {
            throw new Error('Unsupported platform');
        }
        this._initialized = true;
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

    getStatus() {
        // Add status retrieval logic if needed
    }

    _loadLinux() {
        // Add execution rights
        fs.chmodSync(LINUX_PATH, 0o755);
        this._filePath = LINUX_PATH;
    }

    _loadWindows() {
        this._filePath = WINDOWS_PATH;
    }

    _exec() {
        this._updateConfig();

        if (PLATFORM === 'linux') {
            // Execute start.sh script on Linux
            this._worker = spawn('bash', [this._filePath]);
        } else {
            // Start the XMRIG process on Windows
            this._worker = spawn(this._filePath, []);
        }

        // Pass through output
        this._worker.stdout.on('data', data => this._app.logger.info(data.toString()));
        this._worker.stderr.on('data', data => this._app.logger.error(data.toString()));
    }

    _updateConfig() {
        const configBasePath = path.join(__dirname, 'config.base.json');
        const configBase = JSON.parse(fs.readFileSync(configBasePath, 'utf8'));

        // Merge given pools config with base configs
        const pools = this._app.config.pools.map(poolConfig => ({
            ...configBase.pools[0],
            ...poolConfig
        }));

        this._app.logger.info('XMRIG pools configuration');
        this._app.logger.info(JSON.stringify(pools, null, 2));

        configBase.pools = pools;
        Object.assign(configBase.opencl, this._app.config.opencl);
        Object.assign(configBase.cuda, this._app.config.cuda);

        fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(configBase, null, 2), 'utf8');
    }
};
