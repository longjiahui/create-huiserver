#!/usr/bin/env node

import { program } from "commander"
import { input } from "@inquirer/prompts"
import { $, execa } from "execa"
import fs from "fs-extra"
import path from "node:path"
import { source } from "./source.js"

async function createServer(protocolUrl: string, dir: string) {
  const toDir = path.resolve(dir)
  const defaultName = path.basename(toDir).split(path.sep).pop()
  const projectName = await input({
    message: "Project name",
    default: defaultName,
    required: true,
  })

  if (fs.existsSync(toDir)) {
    throw new Error("Directory already exists!")
  }

  const dbName = await input({
    message: "Database name",
    default: defaultName,
    required: true,
  })

  const project = {
    name: projectName,
    version: "1.0.0",
    type: "commonjs",
    scripts: {
      generate: "prisma generate --schema=./src/protocol/schema.prisma",
      "migrate:dev":
        "dotenv -e .env.development -- prisma migrate dev --schema=./src/protocol/schema.prisma",
      "migrate:reset":
        "dotenv -e .env.development -- prisma migrate reset --schema=./src/protocol/schema.prisma",
      "migrate:deploy":
        "dotenv -e .env.development -- prisma migrate deploy --schema=./src/protocol/schema.prisma",
      dev: 'cross-env NODE_ENV=development DEBUG=koa-router,server:* tsc-watch --onSuccess "node dist/src/index.js"',
      build: "tsc",
      lint: "tsc --noEmit",
      "test:watch:debug":
        'cross-env NODE_ENV=development DEBUG=server:* tsc-watch --onSuccess "jest"',
      "test:watch":
        'cross-env NODE_ENV=development DEBUG=server:*,-server:debug tsc-watch --onSuccess "jest"',
      test: "tsc && cross-env NODE_ENV=development DEBUG=server:*,-server:debug,-server:log jest",
    },
    keywords: [],
    author: [],
    license: "ISC",
    description: "",
    dependencies: {},
    devDependencies: {},
  }

  await $`mkdir -p ${toDir}`
  await $`cd ${toDir}`

  fs.writeFileSync(
    path.join(toDir, "package.json"),
    JSON.stringify(project, null, 2)
  )

  // 初始化文件
  await source("./pms/**/*", "./pms").copyTo(toDir, {
    ".env": {
      dbName,
    },
  })

  // 进入toDIR cwd
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`pnpm i @anfo/huiserver prisma cross-env`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`pnpm i lodash koa-passport passport-github passport-local qs redis jsonwebtoken`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`pnpm i -D jest supertest dotenv-cli`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`pnpm i -D prisma-json-types-generator @types/jest @types/jsonwebtoken @types/lodash @types/koa @types/koa-passport @types/passport-github @types/passport-local @types/koa-bodyparser @types/qs @types/supertest tsc-watch typescript`
  await execa({ stdout: "inherit", cwd: toDir })`pnpm prisma generate`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git init .`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git submodule add ${protocolUrl} src/protocol`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git submodule update --recursive --init`
}
const defaultProtocolCoreUrl = "git@github.com:longjiahui/huiprotocol-core.git"
async function createProtocol(
  dir: string,
  protocolCoreUrl = defaultProtocolCoreUrl
) {
  const toDir = path.resolve(dir)
  const finalProtocolCoreUrl = protocolCoreUrl || defaultProtocolCoreUrl
  // 初始化文件
  await source("./protocol/**/*", "./protocol").copyTo(toDir)
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git init .`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git submodule add ${finalProtocolCoreUrl} huiprotocol-core`
  await execa({
    stdout: "inherit",
    cwd: toDir,
  })`git submodule update --recursive --init`
}
program.addCommand(
  program
    .createCommand("server")
    //   .option("-p --protocol-url <repo>", "protocol git submodule url")
    .argument("<protocolUrl>", "protocol git submodule url")
    .argument("<dir>")
    .action(async (protocolUrl: string, dir: string) =>
      createServer(protocolUrl, dir)
    )
)
program.addCommand(
  program
    .createCommand("protocol")
    .option(
      "-p --protocol-core-url <protocolCoreUrl>",
      "protocol core git submodule url"
    )
    .argument("<dir>")
    .action(async (dir: string, options: { protocolCoreUrl?: string } = {}) => {
      return createProtocol(dir, options.protocolCoreUrl)
    })
)
program.version("0.0.12")
program.parse()
