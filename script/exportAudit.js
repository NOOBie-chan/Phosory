export function exportAuditPDF(logs = [], filters = {}, isAdminFn) {

  if (typeof isAdminFn !== "function" || !isAdminFn()) return;

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const logo = new Image();
  logo.src = "images/icon.webp";

  // ================= SAFE DATE PARSER =================
  const getTime = (l) => {
    const t = l?.timestamp;
    if (!t) return null;
    if (t.toDate) return t.toDate();
    if (t.seconds) return new Date(t.seconds * 1000);
    return new Date(t);
  };

  // ================= FILTER LOGS =================
  let data = [...(logs || [])];

  let startDate = filters.start ? new Date(filters.start) : null;
  let endDate = filters.end ? new Date(filters.end) : null;

  if (endDate) endDate.setHours(23, 59, 59, 999);

  if (startDate) {
    data = data.filter(l => {
      const t = getTime(l);
      return t && t >= startDate;
    });
  }

  if (endDate) {
    data = data.filter(l => {
      const t = getTime(l);
      return t && t <= endDate;
    });
  }

  // ALWAYS SHOW RANGE (FIXED)
  const rangeText =
    startDate && endDate
      ? `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}`
      : `All Logs (${data.length} entries)`;

  data.sort((a, b) => getTime(b) - getTime(a));

  // ================= STYLES HELPERS =================
  const colorMap = (action = "") => {
    const a = action.toLowerCase();

    if (a.includes("approved")) return [0, 255, 170];
    if (a.includes("accepted")) return [0, 255, 170];
    if (a.includes("rejected")) return [255, 60, 100];
    if (a.includes("login")) return [0, 150, 255];
    if (a.includes("logout")) return [255, 140, 0];
    if (a.includes("expired")) return [0, 0, 0];

    return [180, 180, 180];
  };

  // ================= WATERMARK =================
  const drawWatermark = () => {
    try {
      pdf.setTextColor(245);
      pdf.setFontSize(55);
      pdf.text("PHOSORY", 35, 160, { angle: 45 });
      pdf.setTextColor(0);
    } catch {}
  };

  // ================= HEADER (FUTURISTIC) =================
  pdf.setFillColor(8, 10, 25);
  pdf.rect(0, 0, 210, 45, "F");

  pdf.setTextColor(255);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("AUDIT CONTROL PANEL", 10, 20);

  pdf.setFontSize(10);
  pdf.setTextColor(180);

  pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 30);
  pdf.text(`Range: ${rangeText}`, 10, 38);

  pdf.addImage(logo, "WEBP", 175, 8, 20, 20);

  let y = 60;

  drawWatermark();

  // ================= COLUMN HEADER =================
  const drawHeader = () => {
    pdf.setFillColor(20, 22, 40);
    pdf.roundedRect(10, y - 6, 190, 10, 2, 2, "F");

    pdf.setTextColor(255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    pdf.text("ACTION", 12, y);
    pdf.text("TARGET", 70, y);
    pdf.text("ROLE", 135, y);
    pdf.text("TIME", 165, y);

    pdf.setFont("helvetica", "normal");
    y += 14;
  };

  drawHeader();

  // ================= ROWS =================
  data.forEach((log, i) => {

    const time = getTime(log)?.toLocaleString() || "--";

    const action = (log.action || "N/A").slice(0, 25);
    const target = (log.target || "-").slice(0, 25);
    const role = (log.role || "-").toUpperCase();

    const color = colorMap(log.action);

    // row background glow style
    if (i % 2 === 0) {
      pdf.setFillColor(18, 20, 35);
      pdf.rect(10, y - 5, 190, 8, "F");
    }

    pdf.setTextColor(...color);

    pdf.text(action, 12, y);
    pdf.text(target, 70, y);
    pdf.text(role, 135, y);

    pdf.setTextColor(200);
    pdf.text(time, 165, y);

    y += 8;

    // page break
    if (y > 270) {
      pdf.addPage();
      drawWatermark();
      y = 40;
      drawHeader();
    }
  });

  // ================= PAGE NUMBERS =================
  const pages = pdf.internal.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(120);
    pdf.text(`Page ${i} / ${pages}`, 170, 290);
  }

  pdf.save(`Phosory_Audit_Report_${Date.now()}.pdf`);
}