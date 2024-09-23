const loadingPage = document.getElementById("loading-page");
const progressBar = loadingPage.getElementsByClassName("progressBar")[0];
const loadingNum = loadingPage.getElementsByClassName("loading-num")[0];
const totalNum = loadingPage.getElementsByClassName("total-num")[0];
console.log("start loading");
let loadedBytes = 0;
let totalBytes = 84520077;
//let totalBytes = 0;
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  for (const entry of entries) {
    // 获取资源的总大小和已加载大小
    //totalBytes += entry.transferSize;
    loadedBytes += entry.encodedBodySize || entry.decodedBodySize;
  }
  const progress = (loadedBytes / totalBytes) * 100;
  progressBar.setAttribute("value", progress.toFixed(2));
  loadingNum.innerHTML = (loadedBytes / 1024 / 1024).toFixed(2);
  totalNum.innerHTML = (totalBytes / 1024 / 1024).toFixed(2);
  console.log("加载", progress, loadedBytes);
  if (progress >= 98) {
    loadingPage.style.visibility = "hidden";
  }
});

// 开始监听资源条目
observer.observe({ entryTypes: ["resource"] });

// // 获取页面加载过的资源
// const resources = window.performance.getEntriesByType("resource");

// let totalBytes = 0;
// let loadedBytes = 0;

// // 遍历资源条目
// for (const resource of resources) {
//   // 获取资源的总大小和已加载大小
//   totalBytes += resource.transferSize;
//   loadedBytes += resource.encodedBodySize || resource.decodedBodySize;
// }

// // 计算加载进度
// const progress = (loadedBytes / totalBytes) * 100;

// progressBar.setAttribute("value", progress.toFixed(2));
// loadingNum.innerHTML = (loadedBytes / 1024 / 1024).toFixed(2);
// totalNum.innerHTML = (totalBytes / 1024 / 1024).toFixed(2);
