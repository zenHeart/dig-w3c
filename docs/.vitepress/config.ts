import { defineConfig } from 'vitepress';
import fs from 'fs';
import path from 'path';

function buildRecursiveSidebar(relativeDir: string) {
  const baseDir = path.resolve(__dirname, '..', relativeDir);
  if (!fs.existsSync(baseDir)) return [] as any[];

  const allowFile = (name: string) => name.endsWith('.md');
  const isIndexMd = (name: string) => name.toLowerCase() === 'readme.md' || name.toLowerCase() === 'index.md';
  const shouldSkipDir = (name: string) => ['node_modules', 'dist', 'build', '.git'].includes(name);

  const hasMdRecursively = (dirAbs: string): boolean => {
    const dirents = fs.readdirSync(dirAbs, { withFileTypes: true });
    for (const e of dirents) {
      if (e.isFile() && allowFile(e.name)) return true;
    }
    for (const e of dirents) {
      if (e.isDirectory() && !shouldSkipDir(e.name)) {
        if (hasMdRecursively(path.join(dirAbs, e.name))) return true;
      }
    }
    return false;
  };

  const walk = (dirAbs: string, routePrefix: string) => {
    const dirents = fs.readdirSync(dirAbs, { withFileTypes: true });
    const dirs = dirents.filter((d) => d.isDirectory() && !shouldSkipDir(d.name)).sort((a, b) => a.name.localeCompare(b.name));
    const files = dirents.filter((d) => d.isFile() && allowFile(d.name)).sort((a, b) => a.name.localeCompare(b.name));

    const children: any[] = [];

    // Files in current directory
    for (const f of files) {
      const fileName = f.name;
      if (isIndexMd(fileName)) continue; // 目录索引交给父级 link
      const text = fileName.replace(/\.(md)$/i, '');
      const link = routePrefix + text; // md 去掉后缀
      children.push({ text, link });
    }

    // Sub-directories
    for (const d of dirs) {
      const subAbs = path.join(dirAbs, d.name);
      const subRoute = routePrefix + d.name + '/';
      const hasIndex = fs.existsSync(path.join(subAbs, 'README.md')) || fs.existsSync(path.join(subAbs, 'index.md'));

      // 仅包含 index.md（按 .md 统计；子目录如无 .md 视为无效）时，直接将目录作为链接项
      const onlyIndex = (() => {
        const subDirents = fs.readdirSync(subAbs, { withFileTypes: true });
        const subDirs = subDirents.filter((e) => e.isDirectory() && !shouldSkipDir(e.name));
        const subMdFiles = subDirents.filter((e) => e.isFile() && allowFile(e.name));
        const hasIdx = subMdFiles.some((f) => isIndexMd(f.name));
        const otherMdCount = subMdFiles.filter((f) => !isIndexMd(f.name)).length;
        const subDirHasMd = subDirs.some((e) => hasMdRecursively(path.join(subAbs, e.name)));
        return hasIdx && otherMdCount === 0 && !subDirHasMd;
      })();

      if (onlyIndex) {
        children.push({ text: d.name, link: subRoute });
        continue;
      }

      const items = walk(subAbs, subRoute);
      // 若无任何 md 内容（递归）且无 index.md，则忽略该目录
      if (!hasIndex && items.length === 0) {
        continue;
      }

      const node: any = { text: d.name, items };
      if (hasIndex) {
        node.items = [{ text: '概览', link: subRoute }, ...items];
      }
      children.push(node);
    }

    return children;
  };

  return walk(baseDir, `/${relativeDir}/`);
}
// @ts-ignore
const isDev = process.env.npm_lifecycle_script.includes("dev");
export default defineConfig({
  title: 'W3C Notes',
  description: '深挖 W3C 与 Web 平台能力的学习笔记',
  lang: 'zh-CN',
  lastUpdated: true,
  base: isDev ? "/" : "/dig-w3c/",
  themeConfig: {
    nav: [
      { text: 'HTML', link: '/html/' },
      { text: 'ECMAScript', link: '/js/' }
    ],
    sidebar: {
      '/html/': [
        { text: 'HTML 索引', link: '/html/' },
        { text: '全部内容', items: buildRecursiveSidebar('html') as any }
      ],
      '/js/': [
        { text: 'JavaScript 索引', link: '/js/' },
        { text: '全部内容', items: buildRecursiveSidebar('js') as any }
      ],
    }
  },
  vite: {
    server: { fs: { strict: false } }
  }
});







