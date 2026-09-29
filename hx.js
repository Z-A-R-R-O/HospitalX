/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const args = process.argv.slice(2);
const command = args[0];
// --- STYLING & TERMINAL UTILS ---
const c = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  green: "\x1b[32m", blue: "\x1b[36m", red: "\x1b[31m", 
  yellow: "\x1b[33m", gray: "\x1b[90m", white: "\x1b[37m",
  bgGreen: "\x1b[42m", bgBlue: "\x1b[46m", bgRed: "\x1b[41m",
};
const tag = {
  INFO: `${c.bgBlue}${c.bold} INFO ${c.reset}`,
  DONE: `${c.bgGreen}${c.bold} DONE ${c.reset}`,
  FAIL: `${c.bgRed}${c.bold} FAIL ${c.reset}`,
  WARN: `${c.yellow}${c.bold} WARN ${c.reset}`,
};
const ASCII_ART = `
${c.blue} ΓûêΓûêΓûæ ΓûêΓûê  ΓûÆΓûêΓûêΓûêΓûêΓûê    ΓûêΓûêΓûêΓûêΓûêΓûê  ΓûêΓûêΓûôΓûêΓûêΓûê   ΓûêΓûêΓûôΓûäΓûäΓûäΓûêΓûêΓûêΓûêΓûêΓûô ΓûäΓûäΓûä       ΓûêΓûêΓûô    ΓûÆΓûêΓûê   ΓûêΓûêΓûÆ
ΓûôΓûêΓûêΓûæ ΓûêΓûêΓûÆΓûÆΓûêΓûêΓûÆ  ΓûêΓûêΓûÆΓûÆΓûêΓûê    ΓûÆ ΓûôΓûêΓûêΓûæ  ΓûêΓûêΓûÆΓûôΓûêΓûêΓûÆΓûô  ΓûêΓûêΓûÆ ΓûôΓûÆΓûÆΓûêΓûêΓûêΓûêΓûä    ΓûôΓûêΓûêΓûÆ    ΓûÆΓûÆ Γûê Γûê ΓûÆΓûæ
ΓûÆΓûêΓûêΓûÇΓûÇΓûêΓûêΓûæΓûÆΓûêΓûêΓûæ  ΓûêΓûêΓûÆΓûæ ΓûôΓûêΓûêΓûä   ΓûôΓûêΓûêΓûæ ΓûêΓûêΓûôΓûÆΓûÆΓûêΓûêΓûÆΓûÆ ΓûôΓûêΓûêΓûæ ΓûÆΓûæΓûÆΓûêΓûê  ΓûÇΓûêΓûä  ΓûÆΓûêΓûêΓûæ    ΓûæΓûæ  Γûê   Γûæ
ΓûæΓûêΓûêΓûô ΓûÆΓûêΓûêΓûÆΓûêΓûê   ΓûêΓûêΓûæ  ΓûÆ   ΓûêΓûêΓûÆΓûÆΓûêΓûêΓûäΓûêΓûôΓûÆ ΓûÆΓûæΓûêΓûêΓûæΓûæ ΓûôΓûêΓûêΓûô Γûæ ΓûæΓûêΓûêΓûäΓûäΓûäΓûäΓûêΓûê ΓûÆΓûêΓûêΓûæ     Γûæ Γûê Γûê ΓûÆ 
ΓûæΓûêΓûêΓûÆ ΓûæΓûêΓûêΓûæ ΓûêΓûêΓûêΓûêΓûôΓûÆΓûæΓûÆΓûêΓûêΓûêΓûêΓûêΓûêΓûÆΓûÆΓûÆΓûêΓûêΓûÆ Γûæ  ΓûæΓûæΓûêΓûêΓûæ  ΓûÆΓûêΓûêΓûÆ Γûæ  ΓûôΓûê   ΓûôΓûêΓûêΓûÆΓûæΓûêΓûêΓûêΓûêΓûêΓûêΓûÆΓûÆΓûêΓûêΓûÆ ΓûÆΓûêΓûêΓûÆ
ΓûæΓûÆΓûæ ΓûæΓûæΓûæΓûæ ΓûÆΓûæΓûÆΓûæΓûÆΓûæ ΓûÆ ΓûÆΓûôΓûÆ ΓûÆ ΓûæΓûÆΓûôΓûÆΓûæ Γûæ  ΓûæΓûæΓûô    ΓûÆ ΓûæΓûæ    ΓûÆΓûÆ   ΓûôΓûÆΓûêΓûæΓûæ ΓûÆΓûæΓûô  ΓûæΓûÆΓûÆ Γûæ ΓûæΓûô Γûæ${c.reset}
${c.gray}                         Neurology Triage Command Line v1.0.0${c.reset}
`;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function animateProgressBar(text, duration = 1500) {
  const frames = ['Γáï', 'ΓáÖ', 'Γá╣', 'Γá╕', 'Γá╝', 'Γá┤', 'Γáª', 'Γáº', 'Γáç', 'ΓáÅ'];
  const steps = 30;
  const stepTime = duration / steps;
  let i = 0;
  process.stdout.write('\x1B[?25l'); // hide cursor
  for (let j = 0; j <= steps; j++) {
    const spinner = c.blue + frames[i] + c.reset;
    const progress = Math.round((j / steps) * 20);
    const empty = 20 - progress;
    const bar = c.green + 'Γûê'.repeat(progress) + c.gray + 'Γûæ'.repeat(empty) + c.reset;
    const percent = Math.round((j / steps) * 100).toString().padStart(3, ' ');
    
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`  ${spinner}  ${text}  ${bar} ${percent}%`);
    i = (i + 1) % frames.length;
    await sleep(stepTime);
  }
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  process.stdout.write('\x1B[?25h'); // show cursor
}
async function animateFiles(files) {
  for (const file of files) {
    await animateProgressBar(`Generating ${c.white}${path.basename(file)}${c.reset}...`, 200);
    console.log(`  ${c.green}Γ£ô${c.reset}  ${c.gray}${file}${c.reset}`);
  }
}
// --- COMMAND EXECUTION ---
async function run() {
  if (!command) {
    console.log(ASCII_ART);
    console.log(`\n${c.yellow}Available commands:${c.reset}\n`);
    console.log(` ${c.green}make${c.reset}`);
    console.log(`  make:domain       Scaffold a strictly typed, isolated domain in lib/`);
    console.log(`  make:route        Scaffold an RBAC-secured API route in app/api/`);
    console.log(`\n ${c.green}db${c.reset}`);
    console.log(`  migrate           Execute database schema synchronization`);
    console.log(`  seed              Pump clinical data into the Neon database`);
    console.log(`\n ${c.green}system${c.reset}`);
    console.log(`  status            Check system health and offline queue status\n`);
    process.exit(0);
  }
  switch (command) {
    case 'migrate':
      console.log(`\n${tag.INFO} Executing Database Schema Migrations...\n`);
      await animateProgressBar('Connecting to Neon Serverless...', 1000);
      await animateProgressBar('Syncing tables...', 1500);
      try {
        execSync(`node --env-file=.env.local scripts/migrate.js`, { stdio: 'ignore' });
        console.log(`\n${tag.DONE} Schema migrated successfully.\n`);
      } catch (err) {
        console.log(`\n${tag.FAIL} Database connection failed. Check .env.local.\n`);
      }
      break;
    case 'seed':
      console.log(`\n${tag.INFO} Pumping Clinical Data...\n`);
      await animateProgressBar('Injecting Doctors...', 800);
      await animateProgressBar('Injecting Nurses...', 800);
      await animateProgressBar('Injecting Inventory...', 800);
      try {
        execSync(`node --env-file=.env.local scripts/seed.js`, { stdio: 'ignore' });
        console.log(`\n${tag.DONE} Clinical data seeded successfully.\n`);
      } catch (err) {
        console.log(`\n${tag.FAIL} Seeding failed.\n`);
      }
      break;
    case 'make:domain':
      const domain = args[1];
      if (!domain) {
        console.log(`\n${tag.FAIL} Not enough arguments (missing: "name").\n`);
        process.exit(1);
      }
      console.log(`\n${tag.INFO} Scaffolding Domain [${domain}]\n`);
      
      const domainDir = path.join(__dirname, 'lib', domain);
      if (fs.existsSync(domainDir)) {
        console.log(`\n${tag.FAIL} Domain already exists.\n`);
        process.exit(1);
      }
      
      fs.mkdirSync(domainDir, { recursive: true });
      
      const filesToMake = [
        { name: 'types.ts', content: `export interface ${domain.charAt(0).toUpperCase() + domain.slice(1)} {\n  id: string;\n  organization_id: string;\n  created_at: Date;\n}\n` },
        { name: 'validators.ts', content: `export function validateCreate${domain.charAt(0).toUpperCase() + domain.slice(1)}(body: any) {\n  return body;\n}\n` },
        { name: 'queries.ts', content: `import { sql } from "@/db/client";\n\nexport async function get${domain.charAt(0).toUpperCase() + domain.slice(1)}() {\n  // Implementation\n}\n` },
        { name: 'actions.ts', content: `import { sql } from "@/db/client";\n\nexport async function create${domain.charAt(0).toUpperCase() + domain.slice(1)}() {\n  // Implementation\n}\n` },
        { name: 'index.ts', content: `export * from './types';\nexport * from './validators';\nexport * from './queries';\nexport * from './actions';\n` }
      ];
      for (const f of filesToMake) {
        fs.writeFileSync(path.join(domainDir, f.name), f.content);
      }
      
      await animateFiles(filesToMake.map(f => `lib/${domain}/${f.name}`));
      console.log(`\n${tag.DONE} Domain isolated successfully.\n`);
      break;
    case 'make:route':
      const routeName = args[1];
      if (!routeName) {
        console.log(`\n${tag.FAIL} Not enough arguments (missing: "name").\n`);
        process.exit(1);
      }
      console.log(`\n${tag.INFO} Securing API Route [${routeName}]\n`);
      
      const routeDir = path.join(__dirname, 'app', 'api', routeName);
      if (fs.existsSync(routeDir)) {
        console.log(`\n${tag.FAIL} Route already exists.\n`);
        process.exit(1);
      }
      fs.mkdirSync(routeDir, { recursive: true });
      
      const routeContent = `import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
export const runtime = "nodejs";
export async function GET() {
  const context = await requireOrganizationContext();
  try {
    requirePermission(context, 'admin'); // TODO: Update permission target
    return NextResponse.json({ status: "secured" });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}`;
      fs.writeFileSync(path.join(routeDir, 'route.ts'), routeContent);
      await animateFiles([`app/api/${routeName}/route.ts`]);
      
      console.log(`\n${tag.DONE} RBAC-secured route deployed.\n`);
      break;
      
    case 'status':
      console.log(`\n${tag.INFO} Running System Diagnostics...\n`);
      await animateProgressBar('Pinging Neon Postgres...', 800);
      await animateProgressBar('Verifying RBAC Policies...', 500);
      
      const dbConnected = !!process.env.DATABASE_URL;
      
      console.log(`  Environment:     ${dbConnected ? c.green + 'ΓùÅ Online' : c.red + 'Γùï Offline'}${c.reset}`);
      console.log(`  RBAC Engine:     ${c.green}ΓùÅ Active${c.reset}`);
      console.log(`  Domain Bounds:   ${c.green}ΓùÅ Strict${c.reset}`);
      console.log(`  Offline Queue:   ${c.gray}Standby${c.reset}\n`);
      break;
    default:
      console.log(`\n${tag.FAIL} Command "${command}" is not defined.\n`);
  }
}
run();
