#!/usr/bin/env node
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

const { exec } = require('child_process');
const readline = require('readline');
const c = {
  reset: "\x1b[0m", 
  bold: "\x1b[1m", 
  dim: "\x1b[2m",
  purple: "\x1b[38;2;168;85;247m", // Vibrant Purple
  cyan: "\x1b[38;2;6;182;212m",    // Vibrant Cyan
  green: "\x1b[38;2;16;185;129m",  // Emerald
  red: "\x1b[38;2;239;68;68m",     // Crimson
  gray: "\x1b[38;2;100;116;139m",  // Slate
  white: "\x1b[38;2;248;250;252m", // Crisp White
  orange: "\x1b[38;2;217;119;87m"  // Claude Orange
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function writeLine(text) {
  if (process.stdout.isTTY) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(text);
  } else {
    process.stdout.write(text + '\r');
  }
}
function clearLine() {
  if (process.stdout.isTTY) {
    readline.clearLine(process.stdout, 0);
  }
}
async function cinematicTitleReveal() {
  console.clear();
  console.log("");
  
  // Fake boot sequence
  writeLine(`    ${c.gray}[ SYSTEM ] Waking up core modules...${c.reset}`);
  await sleep(1000);
  clearLine();
  
  writeLine(`    ${c.gray}[ SYSTEM ] Establishing offline link...${c.reset}`);
  await sleep(1000);
  clearLine();
  if (process.stdout.isTTY) {
    readline.cursorTo(process.stdout, 0);
  } else {
    process.stdout.write('\n');
  }
  
  const logo = [
    `\r${c.purple}    ΓûêΓûêΓòùΓûæΓûæΓûæΓûêΓûêΓòùΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòùΓûêΓûêΓòùΓûæΓûæΓûæΓûêΓûêΓòùΓûêΓûêΓûêΓòùΓûæΓûæΓûæΓûêΓûêΓûêΓòùΓûêΓûêΓòùΓûêΓûêΓûêΓòùΓûæΓûæΓûêΓûêΓòùΓûæΓûêΓûêΓûêΓûêΓûêΓòùΓûæΓûêΓûêΓûêΓûêΓûêΓûêΓòùΓûæΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòù${c.reset}`,
    `${c.purple}    ΓûêΓûêΓòæΓûæΓûæΓûæΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓòÉΓòÉΓò¥ΓòÜΓûêΓûêΓòùΓûæΓûêΓûêΓòöΓò¥ΓûêΓûêΓûêΓûêΓòùΓûæΓûêΓûêΓûêΓûêΓòæΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓòùΓûæΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓòÉΓòÉΓò¥${c.reset}`,
    `${c.purple}    ΓòÜΓûêΓûêΓòùΓûæΓûêΓûêΓòöΓò¥ΓûêΓûêΓûêΓûêΓûêΓòùΓûæΓûæΓûæΓòÜΓûêΓûêΓûêΓûêΓòöΓò¥ΓûæΓûêΓûêΓòöΓûêΓûêΓûêΓûêΓòöΓûêΓûêΓòæΓûêΓûêΓòæΓûêΓûêΓòöΓûêΓûêΓòùΓûêΓûêΓòæΓûêΓûêΓòæΓûæΓûæΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓûêΓûêΓûêΓòùΓûæΓûæ${c.reset}`,
    `${c.cyan}    ΓûæΓòÜΓûêΓûêΓûêΓûêΓòöΓò¥ΓûæΓûêΓûêΓòöΓòÉΓòÉΓò¥ΓûæΓûæΓûæΓûæΓòÜΓûêΓûêΓòöΓò¥ΓûæΓûæΓûêΓûêΓòæΓòÜΓûêΓûêΓòöΓò¥ΓûêΓûêΓòæΓûêΓûêΓòæΓûêΓûêΓòæΓòÜΓûêΓûêΓûêΓûêΓòæΓûêΓûêΓòæΓûæΓûæΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓò¥ΓûæΓûæ${c.reset}`,
    `${c.cyan}    ΓûæΓûæΓòÜΓûêΓûêΓòöΓò¥ΓûæΓûæΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòùΓûæΓûæΓûæΓûêΓûêΓòæΓûæΓûæΓûæΓûêΓûêΓòæΓûæΓòÜΓòÉΓò¥ΓûæΓûêΓûêΓòæΓûêΓûêΓòæΓûêΓûêΓòæΓûæΓòÜΓûêΓûêΓûêΓòæΓòÜΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓòæΓûæΓûæΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòù${c.reset}`,
    `${c.cyan}    ΓûæΓûæΓûæΓòÜΓòÉΓò¥ΓûæΓûæΓûæΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥ΓûæΓûæΓûæΓòÜΓòÉΓò¥ΓûæΓûæΓûæΓòÜΓòÉΓò¥ΓûæΓûæΓûæΓûæΓûæΓòÜΓòÉΓò¥ΓòÜΓòÉΓò¥ΓòÜΓòÉΓò¥ΓûæΓûæΓòÜΓòÉΓòÉΓò¥ΓûæΓòÜΓòÉΓòÉΓòÉΓòÉΓò¥ΓûæΓòÜΓòÉΓò¥ΓûæΓûæΓòÜΓòÉΓò¥ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥${c.reset}`
  ];
  for (const line of logo) {
    console.log(line);
    await sleep(80);
  }
  
  // Draw the line slowly
  process.stdout.write(`    ${c.gray}`);
  for(let i=0; i<30; i++) {
    process.stdout.write(`-`);
    await sleep(10);
  }
  console.log(`${c.reset}\n`);
}
const frames = [
  '[ _ - - ]',
  '[ - _ - ]',
  '[ - - _ ]',
  '[ - _ - ]',
];
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}
async function runAnimatedTask(taskName, command) {
  let i = 0;
  const interval = setInterval(() => {
    writeLine(`    ${c.cyan}${frames[i]}${c.reset}  ${taskName}`);
    i = (i + 1) % frames.length;
  }, 120);
  try {
    const minSleep = sleep(3000); // Guarantee 3 seconds of animation
    let taskPromise;
    if (command) {
      taskPromise = execPromise(command);
    } else {
      taskPromise = Promise.resolve();
    }
    
    await Promise.all([taskPromise, minSleep]);
    clearInterval(interval);
    clearLine();
    writeLine(`    ${c.cyan}[ - - - ]${c.reset}  ${taskName}\n`);
  } catch (err) {
    clearInterval(interval);
    clearLine();
    writeLine(`    ${c.red}[ x x x ]${c.reset}  ${taskName} ${c.gray}(Failed)${c.reset}\n`);
    throw err;
  }
}
async function boot() {
  await cinematicTitleReveal();
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (cmd) {
    const childProcess = require('child_process');
    let spawnCmd = 'npm';
    let spawnArgs = [];
    switch(cmd) {
      case 'dev':
      case 'run':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Routing power to development core...${c.reset}\n`);
        spawnArgs = ['run', 'dev'];
        break;
      case 'build':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Forging production architecture...${c.reset}\n`);
        spawnArgs = ['run', 'build'];
        break;
      case 'android':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Building Android APK...${c.reset}\n`);
        spawnArgs = ['run', 'build:android'];
        break;
      case 'desktop':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Building Desktop EXE...${c.reset}\n`);
        spawnArgs = ['run', 'build:desktop'];
        break;
      case 'test':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Running test suite...${c.reset}\n`);
        spawnArgs = ['run', 'test'];
        break;
      case 'migrate':
        console.log(`\n    ${c.cyan}[ V E Y M I N O R E ]${c.reset} ${c.gray}Migrating database schema...${c.reset}\n`);
        spawnCmd = 'node';
        spawnArgs = ['scripts/migrate-drizzle.js'];
        break;
      case 'status':
        console.log(`\n    ${c.cyan}S Y S T E M   D I A G N O S T I C S${c.reset}`);
        console.log(`    ${c.white}Node Version:${c.reset} ${process.version}`);
        console.log(`    ${c.white}Platform:${c.reset} ${process.platform} ${process.arch}`);
        console.log(`    ${c.white}Database:${c.reset} ${process.env.DATABASE_URL ? 'Connected (Neon Serverless)' : 'Offline (Demo Mode)'}`);
        console.log(`    ${c.white}Memory Usage:${c.reset} ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB\n`);
        process.exit(0);
        break;
      case 'commit':
      case 'save':
        const fsGit = require('fs');
        if (!fsGit.existsSync('.git')) {
          console.log(`\n    ${c.red}[ x x x ] Git repository not initialized.${c.reset}\n`);
          process.exit(1);
        }
        console.log(`\n    ${c.bold}G I T   P R O T O C O L S${c.reset}\n`);
        
        rl.question(`    ${c.cyan}What sector did you modify?${c.reset} (e.g., ui, backend, rbac, docs): `, (sector) => {
          rl.question(`    ${c.cyan}Summarize the upgrade:${c.reset} `, async (message) => {
            console.log(`\n    ${c.gray}Engaging version control...${c.reset}\n`);
            
            try {
              const type = sector.toLowerCase().includes('fix') ? 'fix' : 'feat';
              const commitMsg = `${type}(${sector.trim() || 'core'}): ${message.trim() || 'Architecture upgrade'}`;
              await runAnimatedTask('Staging modifications...', 'git add .');
              await runAnimatedTask('Encrypting commit...', `git commit -m "${commitMsg}"`);
              
              try {
                await runAnimatedTask('Pushing to remote...', 'git push');
              } catch(e) {
                console.log(`    ${c.gray}- Remote push skipped (No upstream detected)${c.reset}`);
              }
              
              console.log(`\n    ${c.green}∩┐╜S  Codebase secured.${c.reset}\n`);
              rl.close();
              process.exit(0);
            } catch (e) {
              console.log(`\n    ${c.red}CRITICAL FAILURE: Git protocol interrupted.${c.reset}\n`);
              rl.close();
              process.exit(1);
            }
          });
        });
        return;
      default:
        console.log(`    ${c.red}Unknown command: ${cmd}${c.reset}\n`);
        process.exit(1);
    }
    
    if (spawnArgs.length > 0) {
      const child = childProcess.spawn(spawnCmd, spawnArgs, { stdio: 'inherit', shell: true });
      child.on('error', () => process.exit(1));
    }
    return;
  }
  // If no args, do the full interactive wizard
  rl.question(`    Initialize HospitalX Core? [Y/n]: `, async (answer) => {
    if (answer.toLowerCase() === 'n') {
      console.log(`\n    ${c.gray}Sequence aborted.${c.reset}\n`);
      process.exit(0);
    }
    console.log(`\n    ${c.bold}E N G A G I N G${c.reset}\n`);
    await sleep(400);
    try {
      await runAnimatedTask('Resolving Dependencies...', 'npm install --silent');
      
      const fs = require('fs');
      let isConfigured = false;
      if (fs.existsSync('.env') && fs.readFileSync('.env', 'utf8').includes('DATABASE_URL=')) {
        isConfigured = true;
      }
      if (!isConfigured) {
        console.log(`\n    ${c.cyan}[ SYSTEM CALIBRATION ]${c.reset}`);
        console.log(`    ${c.gray}Your cloud database coordinates are missing.${c.reset}`);
        await new Promise(resolve => {
          rl.question(`    ${c.white}Paste your Neon DATABASE_URL here (or hit Enter to skip): ${c.reset}`, (dbUrl) => {
            if (dbUrl.trim()) {
              fs.appendFileSync('.env', `\nDATABASE_URL="${dbUrl.trim()}"`);
              console.log(`    ${c.green}∩┐╜S  Database configured.${c.reset}`);
            } else {
              console.log(`    ${c.gray}- Operating in strict offline mode.${c.reset}`);
            }
            resolve();
          });
        });
      }
      await runAnimatedTask('Skipping Cloud Sync', 'npm --version');
      console.log(`\n    ${c.cyan}A L L   S Y S T E M S   N O M I N A L${c.reset}`);
      console.log(`    ${c.gray}-------------------------------------${c.reset}\n`);
      
      function showOSMenu() {
        console.log(`    ${c.bold}V E Y M I N O R E   O S   //   M A I N   M E N U${c.reset}\n`);
        console.log(`    ${c.cyan}[ 1 ]${c.reset} ${c.white}Boot Web Server${c.reset} ${c.gray}(npm run dev)${c.reset}`);
        console.log(`    ${c.cyan}[ 2 ]${c.reset} ${c.white}Compile Web App${c.reset} ${c.gray}(npm run build)${c.reset}`);
        console.log(`    ${c.cyan}[ 3 ]${c.reset} ${c.white}Build Android APK${c.reset} ${c.gray}(Capacitor)${c.reset}`);
        console.log(`    ${c.cyan}[ 4 ]${c.reset} ${c.white}Build Desktop EXE${c.reset} ${c.gray}(Tauri)${c.reset}`);
        console.log(`    ${c.cyan}[ 5 ]${c.reset} ${c.white}Run Test Suite${c.reset} ${c.gray}(Node.js native test)${c.reset}`);
        console.log(`    ${c.cyan}[ 6 ]${c.reset} ${c.white}Migrate Database${c.reset} ${c.gray}(Drizzle ORM)${c.reset}`);
        console.log(`    ${c.cyan}[ 7 ]${c.reset} ${c.white}System Status${c.reset} ${c.gray}(Diagnostics)${c.reset}`);
        console.log(`    ${c.red}[ 0 ]${c.reset} ${c.gray}Shutdown System${c.reset}\n`);
        rl.question(`    ${c.green}vym@hospitalx:~${c.reset}$ `, (bootAnswer) => {
          const spawnTask = (cmd, args) => {
            console.log(`\n    ${c.gray}Executing protocol...${c.reset}\n`);
            rl.close();
            const child = require('child_process').spawn(cmd, args, { stdio: 'inherit', shell: true });
            child.on('error', () => process.exit(1));
          };
          switch(bootAnswer.trim()) {
            case '1':
              spawnTask('npm', ['run', 'dev']);
              break;
            case '2':
              spawnTask('npm', ['run', 'build']);
              break;
            case '3':
              spawnTask('npm', ['run', 'build:android']);
              break;
            case '4':
              spawnTask('npm', ['run', 'build:desktop']);
              break;
            case '5':
              spawnTask('npm', ['run', 'test']);
              break;
            case '6':
              spawnTask('node', ['scripts/migrate-drizzle.js']);
              break;
            case '7':
              console.log(`\n    ${c.cyan}S Y S T E M   D I A G N O S T I C S${c.reset}`);
              console.log(`    ${c.white}Node Version:${c.reset} ${process.version}`);
              console.log(`    ${c.white}Platform:${c.reset} ${process.platform} ${process.arch}`);
              console.log(`    ${c.white}Database:${c.reset} ${process.env.DATABASE_URL ? 'Connected (Neon Serverless)' : 'Offline (Demo Mode)'}`);
              console.log(`    ${c.white}Memory Usage:${c.reset} ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB\n`);
              showOSMenu();
              break;
            case '0':
            case 'exit':
              console.log(`\n    ${c.gray}Powering down...${c.reset}\n`);
              rl.close();
              process.exit(0);
              break;
            default:
              console.log(`    ${c.red}Unknown command. Try again.${c.reset}\n`);
              showOSMenu();
          }
        });
      }
      showOSMenu();
    } catch (e) {
      console.log(`\n    ${c.red}CRITICAL FAILURE: Protocol interrupted.${c.reset}\n`);
      process.exit(1);
    }
  });
}
boot();
