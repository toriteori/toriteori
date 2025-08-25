const fs = require("fs");
const content = fs.readFileSync("./src/data/storyData.ts", "utf8");

const nodeIds = [...content.matchAll(/id:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const nextRefs = [...content.matchAll(/next:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const brokenLinks = nextRefs.filter((ref) => !nodeIds.includes(ref));

console.log("📋 최종 게임 검증:");
console.log("✅ 노드:", nodeIds.length);
console.log("🔗 참조:", nextRefs.length);
console.log("❌ 끊어진:", brokenLinks.length ? brokenLinks : "없음");
console.log("🌲 벨로아 경로:", nextRefs.filter((r) => r === "veloir_village_start").length + "개");

if (brokenLinks.length === 0) {
  console.log("\n🎉 아렌델 마을 완벽! 벨로아 숲 마을 개발 시작!");
} else {
  console.log("\n🚨 오류:", brokenLinks);
}
