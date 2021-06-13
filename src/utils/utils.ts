const exec = require("child_process").exec;
import random from 'crypto-random-string';

export function execute(command: string) {
  return new Promise((resolve) => {
    exec(command, async (err: any, stdout: any, stderr: any) => {
      if (err != null) {
        resolve([err, null]);
      } else if (typeof stderr != "string") {
        resolve([stderr, null]);
      } else {
        resolve([null, stdout]);
      }
    });
  });
}

export function uid(){
  var initial = Date.now().toString(16);
  return `${initial}${random({ length: 16 - initial.length })}`
}

export function sleep(ms: number | undefined) {
return new Promise(resolve => setTimeout(resolve, ms));
}