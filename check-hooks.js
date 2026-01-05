// check-hooks.js
import fs from "fs";
import path from "path";

const hooks = [
  "useState",
  "useReducer",
  "useEffect",
  "useContext",
  "useRef",
  "useMemo",
  "useCallback"
];

const rootDir = "./components"; // scan your Next.js app directory

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // skip files without react imports
  if (!content.includes("react")) return;

  // check if file uses hooks
  const foundHooks = hooks.filter(hook => content.includes(hook));
  const hasHook = foundHooks.length > 0;

  // check if file declares "use client"
  const hasUseClient =
    content.startsWith('"use client"') || content.startsWith("'use client'");

  if (hasHook && !hasUseClient) {
    console.log(`⚠️  ${filePath} is missing "use client". Hooks found: ${foundHooks.join(", ")}`);
  }
}

function walk(dirPath) {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(tsx|ts|jsx|js)$/.test(fullPath)) {
      checkFile(fullPath);
    }
  });
}

walk(rootDir);
