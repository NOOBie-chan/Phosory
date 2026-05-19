document.getElementById("exportAudit").onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logs = window.allLogs || [];

  let y = 10;

  doc.setFontSize(12);
  doc.text("AUDIT LOG REPORT", 10, y);
  y += 10;

  logs.forEach((log, i) => {
    const text = `${log.action} | ${log.target || ""} | ${log.role || ""}`;

    doc.text(text, 10, y);
    y += 8;

    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("audit_logs.pdf");
};