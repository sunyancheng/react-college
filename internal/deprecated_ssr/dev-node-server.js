const path = require('path');
const { spawn } = require('child_process');

module.exports = class {
  constructor(compiler, clientCompiler) {
    const compiledEntryFile = path.resolve(
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`,
    );

    const startServer = () => {
      if (this.server) {
        console.log('重启服务端')
        this.server.kill();
        this.server = null;
      }

      const newServer = spawn('node', [compiledEntryFile, '--color']);
      newServer.stdout.on('data', data => console.log(data.toString().trim()));
      newServer.stderr.on('data', (data) => {
        console.log('Error in server execution, check the console for more info.');
        console.error(data.toString().trim());
      });
      this.server = newServer;
    };

    // We want our node server bundles to only start after a successful client
    // build.  This avoids any issues with node server bundles depending on
    // client bundle assets.
    const waitForClientThenStartServer = () => {
      if (this.serverCompiling) {
        // A new server bundle is building, break this loop.
        return;
      }
      if (this.clientCompiling) {
        setTimeout(waitForClientThenStartServer, 50);
      } else {
        startServer();
      }
    };

    clientCompiler.plugin('compile', () => {
      this.clientCompiling = true;
    });

    clientCompiler.plugin('done', (stats) => {
      
      if (!stats.hasErrors()) {
        this.clientCompiling = false;
      }
    });

    compiler.plugin('compile', () => {
      this.serverCompiling = true;
    });

    compiler.plugin('done', (stats) => {
      this.serverCompiling = false;

      if (this.disposing) {
        return;
      }

      try {
        if (stats.hasErrors()) {
          console.log('Build failed, check the console for more information.');
          console.log(stats.toString());
          return;
        }

        waitForClientThenStartServer();
      } catch (err) {
        console.log('Failed to start, please check the console for more information.');
        console.error(err);
      }
    });

    // Lets start the compiler.
    this.watcher = compiler.watch(null, () => undefined);
  }

  dispose() {
    this.disposing = true;

    const stopWatcher = new Promise((resolve) => {
      this.watcher.close(resolve);
    });

    return stopWatcher.then(() => {
      if (this.server) this.server.kill();
    });
  }
}
