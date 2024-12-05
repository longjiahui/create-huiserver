import { $ } from "execa"
import fs from "fs-extra"
import { globSync } from "glob"
import path from "node:path"

const sourceDir = path.resolve(import.meta.dirname, "../source")

type Variables = "dbName" | "applicationName"

export function source(p: string, relDir: string) {
  relDir = path.resolve(sourceDir, relDir)

  const ps = globSync(p, { cwd: sourceDir, dot: true }).map((p) =>
    path.join(sourceDir, p)
  )
  if (ps.length === 0) {
    throw new Error(`File not found: ${ps.join(", ")}`)
  }
  return {
    /**
     * replacer: filePath( glob / rel / absolute ) => ( varaible => value(必须兼容正则) )
     */
    copyTo: async (
      to: string,
      replacer: Record<string, Partial<Record<Variables, string>>> = {}
    ) => {
      const toDir = path.resolve(to)
      await Promise.all(
        ps.map(async (p) => {
          const isDir = fs.statSync(p).isDirectory()
          if (!isDir) {
            let toP = `${to}/${path.relative(relDir, p)}`
            // 因为npm pack 会忽略.gitignore文件，所以需要将.gitignore-placeholder文件重命名为.gitignore
            if (path.basename(toP) === ".gitignore-placeholder") {
              toP = toP.replace(/(\.gitignore-placeholder)$/, ".gitignore")
            }
            fs.ensureDirSync(path.dirname(toP))
            $`cp ${p} ${toP}`
          }
        })
      )
      await Promise.all(
        Object.entries(replacer).map(async ([filePath, vars]) => {
          const ps = globSync(filePath, {
            cwd: toDir,
            dot: true,
          }).map((p) => {
            return path.join(toDir, p)
          })
          return Promise.all(
            ps.map(async (p) => {
              let content = fs.readFileSync(p).toString()
              Object.entries(vars).map(([variable, value]) => {
                content = content.replace(
                  new RegExp(`\\$${variable}`, "g"),
                  value
                )
              })
              fs.writeFileSync(p, content)
            })
          )
        })
      )
    },
  }
}
