const child_process = require("child_process")
const spawnArgs = require("spawn-args")

/**
 * External process utilities
 * 
 * @class Process
 */
class Process {
  /**
   * Spawn a new process
   *
   * @param {String} cmd Command to execute
   * @param {String} arg Command arguments
   * @param {Buffer or String} stdin Optional std input
   * @param {Object} options Optional process options (check node docs)
   */
  spawn(cmd, arg, stdin, options) {
    return new Promise((resolve, reject) => {
      // Capture process outputs
      const output = {
        stdout: [],
        stderr: []
      }

      arg = spawnArgs(arg)

      // Spawn new process
      const process = child_process.spawn(cmd, arg, options)

      // Pipe something to the process stdin if needed
      if (stdin) {
        process.stdin.write(stdin)
        process.stdin.end()
      }

      process.stdout.on("data", data => {
        output.stdout.push(data)
      })

      process.stderr.on("data", data => {
        output.stderr.push(data)
      })

      // On process termination
      process.on("close", code => {
        if (code !== 0) {
          reject(output.stderr.toString())
        } else {
          resolve(output.stdout[0])
        }
      })
    })
  }

  /**
   * Wrapper around openssl command
   *
   * @param {String} arg Arguments
   * @param {Buffer or String} stdin STD input (optional)
   * @param {Object} options Optional process options (check node docs)
   */
  openssl(arg, stdin, options) {
    return this.spawn("openssl", arg, stdin, options)
  }

  /**
   * Wrapper around ssh-keygen command
   *
   * @param {String} arg Arguments
   * @param {Buffer or String} stdin STD input (optional)
   * @param {Object} options Optional process options (check node docs)
   */
  sshKeygen(arg, stdin, options) {
    return this.spawn("ssh-keygen", arg, stdin, options)
  }
}

module.exports = new Process()
