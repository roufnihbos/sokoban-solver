// Push-optimal Sokoban solver for hallway+rooms levels. Rooms are solved independently (BFS over pushes), then stitched together.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const DR = [-1, 1, 0, 0], DC = [0, 0, -1, 1], DL = 'udlr';

/** Push-optimal sequence for one room: list of [cellIndex, dir]. */
const solveRoom = (cells: number[], W: number, door: number, boxes: number[], goals: number[]): [number, number][] => {
  const n = cells.length;
  const idx = new Map<number, number>();
  cells.forEach((c, i) => idx.set(c, i));
  idx.set(door, n); // player-only cell
  const nb: number[][] = []; // nb[i][d] = index or -1
  for (let i = 0; i <= n; i++) {
    const c = i < n ? cells[i] : door;
    nb.push([-W, W, -1, 1].map((o) => idx.get(c + o) ?? -1));
  }
  const bit = (i: number) => 2 ** i;
  const has = (m: number, i: number) => Math.floor(m / bit(i)) % 2 === 1;
  const mk = (l: number[]) => l.reduce((a, i) => a + bit(idx.get(i)!), 0);
  const goalMask = mk(goals);
  const start = mk(boxes);
  const region = (m: number, p: number): number[] => {
    const seen = new Uint8Array(n + 1); const st = [p]; seen[p] = 1; let mn = p;
    while (st.length) {
      const c = st.pop()!;
      if (c < mn) mn = c;
      for (let d = 0; d < 4; d++) { const q = nb[c][d]; if (q >= 0 && !seen[q] && !(q < n && has(m, q))) { seen[q] = 1; st.push(q); } }
    }
    return [mn, ...seen] as number[];
  };
  const mM: number[] = [], mP: number[] = [], par: number[] = [], pmv: number[] = [];
  const seenK = new Map<number, number>();
  const p0 = region(start, n)[0];
  mM.push(start); mP.push(p0); par.push(-1); pmv.push(0);
  seenK.set(start * 64 + p0, 0);
  for (let h = 0; h < mM.length; h++) {
    const m = mM[h];
    if (m === goalMask) {
      const out: [number, number][] = [];
      for (let s = h; par[s] >= 0; s = par[s]) out.push([pmv[s] >> 2, pmv[s] & 3]);
      return out.reverse().map(([i, d]) => [cells[i], d]);
    }
    const r = region(m, mP[h]);
    for (let b = 0; b < n; b++) {
      if (!has(m, b)) continue;
      for (let d = 0; d < 4; d++) {
        const bc = nb[b][d], pc = nb[b][d ^ 1];
        if (bc < 0 || bc >= n || pc < 0 || has(m, bc) || !r[1 + pc]) continue;
        const nm = m - bit(b) + bit(bc);
        const np = region(nm, b)[0];
        const k = nm * 64 + np;
        if (seenK.has(k)) continue;
        seenK.set(k, mM.length);
        mM.push(nm); mP.push(np); par.push(h); pmv.push((b << 2) | d);
      }
    }
  }
  throw new Error('room unsolvable');
};

const solve = (text: string): string => {
  const g = text.split('\n').map((l) => l.replace(/\r$/, '').split('')).filter((l) => l.length);
  const H = g.length, W = Math.max(...g.map((l) => l.length));
  for (const l of g) while (l.length < W) l.push('#');
  let pr = 0, pc = 0;
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) if (g[r][c] === '@' || g[r][c] === '+') { pr = r; pc = c; }
  const hall = pr;
  const wall = (r: number, c: number) => r < 0 || c < 0 || r >= H || c >= W || g[r][c] === '#';
  const boxes = new Set<number>();
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) if (g[r][c] === '$' || g[r][c] === '*') boxes.add(r * W + c);
  const isGoal = (r: number, c: number) => '.*+'.includes(g[r][c]);
  // rooms
  const comp = new Set<number>();
  const pushes: [number, number][] = [];
  for (let r0 = 0; r0 < H; r0++) for (let c0 = 0; c0 < W; c0++) {
    if (r0 === hall || wall(r0, c0) || comp.has(r0 * W + c0)) continue;
    const cells: number[] = []; const st = [r0 * W + c0]; comp.add(st[0]);
    while (st.length) {
      const c = st.pop()!; cells.push(c);
      const r = Math.floor(c / W), cc = c % W;
      for (let d = 0; d < 4; d++) {
        const nr = r + DR[d], nc = cc + DC[d];
        if (nr === hall || wall(nr, nc) || comp.has(nr * W + nc)) continue;
        comp.add(nr * W + nc); st.push(nr * W + nc);
      }
    }
    cells.sort((a, b) => a - b);
    let door = -1;
    for (const c of cells) for (const o of [-W, W]) {
      if (Math.floor((c + o) / W) === hall && !wall(hall, (c + o) % W)) door = c + o;
    }
    if (door < 0) continue;
    const rb = cells.filter((c) => boxes.has(c));
    const rg = cells.filter((c) => isGoal(Math.floor(c / W), c % W));
    if (!rb.length) continue;
    for (const p of solveRoom(cells, W, door, rb, rg)) pushes.push(p);
  }
  // stitch
  let p = pr * W + pc; let out = '';
  for (const [bc, d] of pushes) {
    const need = bc - [-W, W, -1, 1][d];
    const prev = new Map<number, number>([[p, -1]]); const mv = new Map<number, number>();
    const q = [p];
    for (let h = 0; h < q.length && !prev.has(need); h++) {
      const c = q[h];
      for (let e = 0; e < 4; e++) {
        const nr = Math.floor(c / W) + DR[e], nc = (c % W) + DC[e];
        const t = nr * W + nc;
        if (wall(nr, nc) || boxes.has(t) || prev.has(t)) continue;
        prev.set(t, c); mv.set(t, e); q.push(t);
      }
    }
    if (!prev.has(need)) throw new Error('no path');
    let s = ''; for (let c = need; c !== p; c = prev.get(c)!) s = DL[mv.get(c)!] + s;
    out += s + DL[d].toUpperCase();
    boxes.delete(bc); boxes.add(bc + [-W, W, -1, 1][d]); p = bc;
  }
  return out;
};
for (const id of readdirSync(I).sort()) {
  const moves = solve(readFileSync(join(I, id, 'level.txt'), 'utf8'));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'solution.txt'), `${moves}\n`);
}
