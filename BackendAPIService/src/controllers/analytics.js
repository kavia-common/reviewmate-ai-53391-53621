const prisma = require('../lib/prisma');
const PDFDocument = require('pdfkit');

// PUBLIC_INTERFACE
async function getLocationStats(req, res, next) {
  try {
    const { locationId } = req.params;
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { locationId },
      orderBy: { date: 'asc' },
    });
    res.json({ snapshots });
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function generateReport(req, res, next) {
  try {
    const { locationId } = req.params;
    const location = await prisma.location.findUnique({ where: { id: locationId }, include: { org: true } });
    if (!location) return res.status(404).json({ message: 'Location not found' });
    const snapshots = await prisma.analyticsSnapshot.findMany({
      where: { locationId },
      orderBy: { date: 'asc' },
    });
    // Simple PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${location.name}.pdf"`);
    doc.pipe(res);
    doc.fontSize(20).text(location.org?.name || 'ReviewMate AI', { underline: true });
    doc.moveDown().fontSize(16).text(`Location: ${location.name}`);
    doc.moveDown().fontSize(12).text('Analytics:');
    snapshots.forEach((s) => {
      doc.text(`${new Date(s.date).toDateString()}  Avg: ${s.avgRating.toFixed(2)}  Reviews: ${s.reviewCount}  (+${s.positive}/~${s.neutral}/-${s.negative})`);
    });
    doc.end();
  } catch (e) { next(e); }
}

module.exports = { getLocationStats, generateReport };
