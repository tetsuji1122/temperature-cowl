// 47都道府県の県庁所在地データ（緯度・経度）
const CITIES = [
    { group: "北海道・東北", items: [
        { name: "北海道 (札幌)", val: "43.06,141.35" },
        { name: "青森県 (青森)", val: "40.82,140.74" },
        { name: "岩手県 (盛岡)", val: "39.70,141.15" },
        { name: "宮城県 (仙台)", val: "38.27,140.87" },
        { name: "秋田県 (秋田)", val: "39.72,140.10" },
        { name: "山形県 (山形)", val: "38.26,140.34" },
        { name: "福島県 (福島)", val: "37.76,140.47" }
    ]},
    { group: "関東", items: [
        { name: "茨城県 (水戸)", val: "36.34,140.45" },
        { name: "栃木県 (宇都宮)", val: "36.57,139.88" },
        { name: "群馬県 (前橋)", val: "36.39,139.06" },
        { name: "埼玉県 (さいたま)", val: "35.86,139.65" },
        { name: "千葉県 (千葉)", val: "35.60,140.12" },
        { name: "東京都 (新宿)", val: "35.69,139.69" },
        { name: "神奈川県 (横浜)", val: "35.45,139.64" }
    ]},
    { group: "中部", items: [
        { name: "新潟県 (新潟)", val: "37.90,139.02" },
        { name: "富山県 (富山)", val: "36.70,137.21" },
        { name: "石川県 (金沢)", val: "36.56,136.66" },
        { name: "福井県 (福井)", val: "36.07,136.22" },
        { name: "山梨県 (甲府)", val: "35.66,138.57" },
        { name: "長野県 (長野)", val: "36.65,138.18" },
        { name: "岐阜県 (岐阜)", val: "35.39,136.72" },
        { name: "静岡県 (静岡)", val: "34.98,138.38" },
        { name: "愛知県 (名古屋)", val: "35.18,136.91" }
    ]},
    { group: "近畿", items: [
        { name: "三重県 (津)", val: "34.73,136.51" },
        { name: "滋賀県 (大津)", val: "35.00,135.87" },
        { name: "京都府 (京都)", val: "35.02,135.76" },
        { name: "大阪府 (大阪)", val: "34.69,135.50" },
        { name: "兵庫県 (神戸)", val: "34.69,135.18" },
        { name: "奈良県 (奈良)", val: "34.69,135.83" },
        { name: "和歌山県 (和歌山)", val: "34.23,135.17" }
    ]},
    { group: "中国・四国", items: [
        { name: "鳥取県 (鳥取)", val: "35.50,134.24" },
        { name: "島根県 (松江)", val: "35.47,133.05" },
        { name: "岡山県 (岡山)", val: "34.66,133.92" },
        { name: "広島県 (広島)", val: "34.39,132.46" },
        { name: "山口県 (山口)", val: "34.18,131.47" },
        { name: "徳島県 (徳島)", val: "34.07,134.56" },
        { name: "香川県 (高松)", val: "34.34,134.04" },
        { name: "愛媛県 (松山)", val: "33.84,132.77" },
        { name: "高知県 (高知)", val: "33.56,133.53" }
    ]},
    { group: "九州・沖縄", items: [
        { name: "福岡県 (福岡)", val: "33.59,130.40" },
        { name: "佐賀県 (佐賀)", val: "33.25,130.30" },
        { name: "長崎県 (長崎)", val: "32.75,129.87", selected: true },
        { name: "熊本県 (熊本)", val: "32.79,130.74" },
        { name: "大分県 (大分)", val: "33.24,131.61" },
        { name: "宮崎県 (宮崎)", val: "31.91,131.42" },
        { name: "鹿児島県 (鹿児島)", val: "31.56,130.56" },
        { name: "沖縄県 (那覇)", val: "26.21,127.68" }
    ]}
];

// デフォルトの気候カラーチャート（DARUMA風クラフト8色）
const DEFAULT_CHART = [
    { min: -99, max: 5, color: "#6c5ce7", label: "Purple (Night Blue)" },
    { min: 5, max: 10, color: "#4a90e2", label: "Royal Blue" },
    { min: 10, max: 15, color: "#81ecec", label: "Light Blue" },
    { min: 15, max: 20, color: "#1abc9c", label: "Green (Turquoise)" },
    { min: 20, max: 25, color: "#badc58", label: "Apple Green" },
    { min: 25, max: 30, color: "#f1c40f", label: "Mustard (Yellow)" },
    { min: 30, max: 35, color: "#e67e22", label: "Orange" },
    { min: 35, max: 99, color: "#d63031", label: "Deep Red (Vermilion)" }
];

let chart = JSON.parse(localStorage.getItem("temp-cowl-chart")) || [...DEFAULT_CHART];
let lastFetchedKey = "";
let currentProjectName = "";

// ---------------------------------------------------------------------
// ユーティリティ
// ---------------------------------------------------------------------

function saveChart() {
    localStorage.setItem("temp-cowl-chart", JSON.stringify(chart));
}

function getProjectName(fallback = "TEMPERATURE COWL") {
    if (currentProjectName) return currentProjectName;
    const citySelect = document.getElementById("city-select");
    const cityName = citySelect && citySelect.selectedIndex >= 0 ? citySelect.options[citySelect.selectedIndex].text : "";
    const yearEl = document.getElementById("year-input");
    const year = yearEl ? yearEl.value : "";
    if (cityName && year) return `${cityName} ${year}`;
    return fallback;
}

function formatDate(year, dayIndex) {
    const d = new Date(year, 0, 1 + dayIndex);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function isResultVisible() {
    const content = document.getElementById("result-content");
    return content && !content.classList.contains("hidden");
}

function initCities() {
    const select = document.getElementById("city-select");
    if (!select) return;
    select.innerHTML = "";
    CITIES.forEach(group => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group.group;
        group.items.forEach(city => {
            const opt = document.createElement("option");
            opt.value = city.val;
            opt.textContent = city.name;
            if (city.selected) opt.selected = true;
            optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
    });
}

// ---------------------------------------------------------------------
// カラーパレット設定 UI
// ---------------------------------------------------------------------

function renderSettings() {
    const container = document.getElementById("color-settings");
    if (!container) return;
    container.innerHTML = "";
    chart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "flex items-center gap-2 bg-stone-50/80 p-2 rounded border border-stone-200/70";
        div.innerHTML = `
            <div class="w-7 h-7 shrink-0 overflow-hidden rounded border border-stone-300/80 bg-white shadow-2xs">
                <input type="color" value="${item.color}" onchange="updateChart(${index}, 'color', this.value)" class="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0 block">
            </div>
            <input type="number" step="0.1" value="${item.max}" onchange="updateChart(${index}, 'max', this.value)" class="w-12 p-1 text-[11px] border border-stone-200 rounded text-right bg-white text-stone-700 font-mono">
            <span class="text-[10px] text-stone-400">°C</span>
            <input type="text" value="${item.label}" onchange="updateChart(${index}, 'label', this.value)" class="flex-1 min-w-0 p-1 text-[11px] border border-stone-200 rounded bg-white text-stone-700" placeholder="Label">
            <button type="button" onclick="removeRange(${index})" class="material-icons text-stone-300 hover:text-stone-600 text-sm" title="削除">close</button>
        `;
        container.appendChild(div);
    });
}

window.updateChart = (index, field, value) => {
    if (field === "max") chart[index].max = parseFloat(value);
    else chart[index][field] = value;
    if (field === "max" && chart[index + 1]) chart[index + 1].min = chart[index].max;
    saveChart();
    if (isResultVisible()) buildPattern();
};

window.removeRange = (index) => {
    chart.splice(index, 1);
    saveChart();
    renderSettings();
    if (isResultVisible()) buildPattern();
};

document.getElementById("add-range").onclick = () => {
    const lastMax = chart.length > 0 ? chart[chart.length - 1].max : 10;
    chart.push({ min: lastMax, max: lastMax + 5, color: "#cccccc", label: "New Color" });
    saveChart();
    renderSettings();
    if (isResultVisible()) buildPattern();
};

document.getElementById("reset-chart").onclick = () => {
    if (confirm("カラー設定を初期値に戻しますか？")) {
        chart = JSON.parse(JSON.stringify(DEFAULT_CHART));
        saveChart();
        renderSettings();
        if (isResultVisible()) buildPattern();
    }
};

document.getElementById("toggle-settings").onclick = () => {
    const content = document.getElementById("settings-content");
    const icon = document.getElementById("toggle-icon");
    if (!content) return;
    const isHidden = content.classList.contains("hidden");
    content.classList.toggle("hidden");
    if (icon) icon.innerText = isHidden ? "expand_less" : "expand_more";
};

// ---------------------------------------------------------------------
// パターン生成処理（データ取得＆編み図ビルド）
// ---------------------------------------------------------------------

document.getElementById("generate-btn").onclick = async () => {
    const citySelect = document.getElementById("city-select");
    const cityName = citySelect.options[citySelect.selectedIndex].text;
    const coords = citySelect.value.split(",");
    const year = document.getElementById("year-input").value;
    const tempTypeSelect = document.getElementById("temp-type-select");
    const type = tempTypeSelect.value;
    const typeLabel = tempTypeSelect.options[tempTypeSelect.selectedIndex].text;
    const currentKey = `${coords.join(",")}-${year}-${type}`;

    const btn = document.getElementById("generate-btn");
    const originalHTML = btn.innerHTML;
    const rawData = document.getElementById("temp-data").value.trim();

    if (currentKey !== lastFetchedKey || !rawData) {
        btn.disabled = true;
        btn.innerHTML = `<span class="material-icons animate-spin text-sm">sync</span> 取得中...`;

        try {
            const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coords[0]}&longitude=${coords[1]}&start_date=${year}-01-01&end_date=${year}-12-31&daily=${type}&timezone=Asia%2FTokyo`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.daily && data.daily[type]) {
                const valid = data.daily[type].filter(t => t !== null && !isNaN(t));
                if (valid.length === 0) throw new Error("有効な気温データが見つかりませんでした。");
                document.getElementById("temp-data").value = valid.join("\n");
                currentProjectName = `${cityName} ${year} (${typeLabel})`;
                lastFetchedKey = currentKey;
            } else {
                throw new Error("気象データの取得に失敗しました。");
            }
        } catch (e) {
            alert(`気温データの取得に失敗しました: ${e.message}\n直接テキストエリアにデータを入力して生成することも可能です。`);
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            return;
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }

    buildPattern();
};

function buildPattern() {
    const raw = document.getElementById("temp-data").value.trim();
    if (!raw) return alert("気温データがありません。");
    const temps = raw.split("\n").map(l => parseFloat(l.trim())).filter(n => !isNaN(n));
    if (temps.length === 0) return alert("有効な気温データがありません。");

    const placeholder = document.getElementById("result-placeholder");
    const content = document.getElementById("result-content");
    if (placeholder) placeholder.classList.add("hidden");
    if (content) content.classList.remove("hidden");

    const preview = document.getElementById("cowl-preview");
    const summary = document.getElementById("yarn-summary");
    const display = document.getElementById("english-pattern-display");
    const tableBody = document.getElementById("pattern-table");

    preview.innerHTML = "";
    summary.innerHTML = "";
    tableBody.innerHTML = "";

    const previewFragment = document.createDocumentFragment();
    const tableFragment = document.createDocumentFragment();
    const stats = {};

    const projName = getProjectName("TEMPERATURE COWL");
    const castOn = document.getElementById("cast-on-count").value || 30;
    const year = parseInt(document.getElementById("year-input").value) || new Date().getFullYear();

    let patternText = `${projName.toUpperCase()}\n${"=".repeat(42)}\n\n`;
    patternText += "ABBREVIATIONS\nCO: cast on\nk: knit\nBO: bind off\nst(s): stitch(es)\n\n";
    patternText += `INSTRUCTIONS\nCO ${castOn} sts.\nWork in Garter Stitch (knit every row) as follows:\n\n`;

    let currentGroup = null;

    temps.forEach((temp, i) => {
        const config = chart.find(c => temp <= c.max) || chart[chart.length - 1];
        const color = config.color;
        stats[color] = (stats[color] || 0) + 1;
        const dateStr = formatDate(year, i);

        // ビジュアルプレビュー
        const row = document.createElement("div");
        row.className = "cowl-row";
        row.style.backgroundColor = color;
        row.title = `Day ${i + 1} (${dateStr}): ${temp}°C (${config.label})`;
        previewFragment.appendChild(row);

        // 日別一覧テーブル
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="p-2 text-stone-400 font-mono text-[11px]">${i + 1}</td>
            <td class="p-2 text-stone-600 font-mono text-[11px] whitespace-nowrap">${dateStr}</td>
            <td class="p-2 text-center font-medium text-stone-800 text-[11px]">${temp}°C</td>
            <td class="p-2 flex items-center justify-center gap-1.5">
                <div class="w-3 h-3 rounded-full border border-stone-200" style="background-color:${color}"></div>
                <span class="text-[10px] font-mono text-stone-400">${color}</span>
            </td>
        `;
        tableFragment.appendChild(tr);

        // 英文パターンの同色日集約
        if (!currentGroup || currentGroup.label !== config.label) {
            if (currentGroup) {
                const count = i - currentGroup.start + 1;
                const rangeStr = currentGroup.start === i ? `Row ${currentGroup.start}` : `Rows ${currentGroup.start}-${i}`;
                patternText += `${rangeStr}: With ${currentGroup.label}, k all sts. (${count} ${count === 1 ? "row" : "rows"})\n`;
            }
            currentGroup = { start: i + 1, label: config.label };
        }
    });

    if (currentGroup) {
        const count = temps.length - currentGroup.start + 1;
        const rangeStr = currentGroup.start === temps.length ? `Row ${currentGroup.start}` : `Rows ${currentGroup.start}-${temps.length}`;
        patternText += `${rangeStr}: With ${currentGroup.label}, k all sts. (${count} ${count === 1 ? "row" : "rows"})\n`;
    }

    patternText += "\nBO all sts.\nWeave in all ends.";
    display.innerText = patternText;

    preview.appendChild(previewFragment);
    tableBody.appendChild(tableFragment);

    // 必要段数サマリー（DARUMA調の落ち着いたスウォッチ表示）
    const summaryFragment = document.createDocumentFragment();
    chart.forEach(c => {
        if (stats[c.color]) {
            const div = document.createElement("div");
            div.className = "flex items-center gap-2.5 p-2 bg-stone-50/80 rounded border border-stone-200/70 text-xs";
            div.innerHTML = `
                <div class="w-3.5 h-3.5 rounded-full border border-stone-300/60 shrink-0" style="background-color:${c.color}"></div>
                <div class="flex-1 font-medium text-stone-700 truncate tracking-wide">${c.label}</div>
                <div class="text-stone-900 font-serif font-medium shrink-0">${stats[c.color]} <span class="text-[10px] font-normal text-stone-400">段</span></div>
            `;
            summaryFragment.appendChild(div);
        }
    });
    summary.appendChild(summaryFragment);

    document.getElementById("result-section").scrollIntoView({ behavior: "smooth" });
}

// ---------------------------------------------------------------------
// パターン・データのエクスポート / コピー
// ---------------------------------------------------------------------

async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
        document.execCommand("copy") ? resolve() : reject(new Error("コピーに失敗しました"));
        textArea.remove();
    });
}

const copyBtn = document.getElementById("copy-pattern-en");
if (copyBtn) {
    copyBtn.onclick = async () => {
        const text = document.getElementById("english-pattern-display").innerText;
        if (!text) return alert("先にパターンを生成してください。");
        try {
            await copyToClipboard(text);
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `<span class="material-icons text-xs text-emerald-600">check</span> コピー完了`;
            copyBtn.classList.add("border-emerald-600", "text-emerald-700");
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove("border-emerald-600", "text-emerald-700");
            }, 1800);
        } catch (err) {
            alert("クリップボードへのコピーに失敗しました。");
        }
    };
}

document.getElementById("download-pattern").onclick = () => {
    const raw = document.getElementById("temp-data").value.trim();
    if (!raw) return alert("気温データがありません。");
    const year = parseInt(document.getElementById("year-input").value) || new Date().getFullYear();
    const lines = raw.split("\n").map(l => parseFloat(l.trim())).filter(n => !isNaN(n));
    if (lines.length === 0) return alert("有効な気温データがありません。");

    let csv = "Day,Date,Temperature,Color\n";
    lines.forEach((temp, i) => {
        const config = chart.find(c => temp <= c.max) || chart[chart.length - 1];
        const dateStr = formatDate(year, i);
        csv += `${i + 1},${dateStr},${temp},"${config.color} (${config.label})"\n`;
    });
    const projName = getProjectName("cowl-data");
    downloadFile("\uFEFF" + csv, `${projName}.csv`, "text/csv;charset=utf-8");
};

// 初期化実行
initCities();
renderSettings();