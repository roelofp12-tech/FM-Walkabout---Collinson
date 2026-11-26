window.fmt = function (iso) {
  return new Date(iso).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Johannesburg' });
};
window.makePdf = function (r) {
  var J = window.jspdf.jsPDF, d = new J({ unit: 'mm', format: 'a4' }), y;
  var PINK = [216, 32, 96], PURPLE = [152, 0, 96];
  d.setFillColor(PINK[0], PINK[1], PINK[2]); d.rect(0, 0, 210, 34, 'F');
  d.setFillColor(PURPLE[0], PURPLE[1], PURPLE[2]); d.rect(0, 34, 210, 2.5, 'F');
  d.setTextColor(0, 0, 0);
  d.setFont('helvetica', 'bold'); d.setFontSize(16);
  d.text('COLLINSON FM \u2014 ' + String(r.formLabel).toUpperCase(), 15, 15);
  d.setFont('helvetica', 'normal'); d.setFontSize(10);
  d.text('Facilities Manager Sign-Off', 15, 23);
  d.text('Reference: ' + r.id + '   Created: ' + fmt(r.createdAt) + ' by ' + r.createdBy, 15, 29);
  y = 48;
  d.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]); d.setLineWidth(0.7);
  d.line(15, y - 6, 195, y - 6);
  d.setFontSize(11);
  (r.fields || []).forEach(function (f) {
    d.setFont('helvetica', 'bold'); d.text(String(f[0]), 15, y);
    d.setFont('helvetica', 'normal');
    var lines = d.splitTextToSize(String(f[1] || '-'), 120);
    d.text(lines, 70, y); y += Math.max(7, lines.length * 5.5);
    if (y > 250) { d.addPage(); y = 20; }
  });
  y += 4; d.line(15, y, 195, y); y += 8;
  if (r.signed) {
    d.setFont('helvetica', 'bold'); d.text('Signed off by', 15, y);
    d.setFont('helvetica', 'normal'); d.text(r.signed.name, 70, y); y += 7;
    d.setFont('helvetica', 'bold'); d.text('Date and time', 15, y);
    d.setFont('helvetica', 'normal'); d.text(fmt(r.signed.at), 70, y); y += 7;
    d.setFont('helvetica', 'bold'); d.text('Signature', 15, y); y += 3;
    try { d.addImage(r.signed.signature, 'PNG', 15, y, 70, 28); } catch (e) {}
    d.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]); d.rect(15, y, 70, 28);
  } else {
    d.text('Not yet signed.', 15, y);
  }
  d.setFontSize(8); d.setTextColor(120, 120, 120);
  d.text('DNC Contracting (Pty) Ltd t/a De Nobrega Group', 15, 287);
  return d;
};
window.savePdf = function (r, linkEl) {
  var d = makePdf(r), name = 'Collinson_' + r.formLabel.replace(/\s+/g, '') + '_SignOff_' + r.id + '.pdf';
  try { d.save(name); } catch (e) {}
  var url = URL.createObjectURL(d.output('blob'));
  if (linkEl) { linkEl.href = url; linkEl.textContent = 'Open PDF'; linkEl.hidden = false; }
};
