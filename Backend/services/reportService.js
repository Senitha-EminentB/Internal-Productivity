const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PDFDocument = require('pdfkit');

const generateCsv = (res, data) => {
    const csvWriter = createCsvWriter({
        path: 'report.csv', // In a real app, use a temporary path or stream directly
        header: [
            { id: 'type', title: 'Type' },
            { id: 'id', title: 'ID' },
            { id: 'title', title: 'Title/Message' },
            { id: 'user', title: 'User' },
            { id: 'status', title: 'Status' },
            { id: 'date', title: 'Date' },
        ]
    });

    const records = [];
    data.tasks.forEach(t => records.push({ type: 'Task', id: t.id, title: t.title, user: t.userId, status: t.completed ? 'Completed' : 'Open', date: t.createdAt }));
    data.commits.forEach(c => records.push({ type: 'Commit', id: c.id, title: c.message, user: c.userName, date: c.date }));
    data.bugs.forEach(b => records.push({ type: 'Bug', id: b.id, title: b.title, user: b.assignedToName, status: b.status, date: b.createdAt }));

    csvWriter.writeRecords(records)
        .then(() => {
            res.download('report.csv');
        });
};

const generatePdf = (res, data) => {
    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text('Productivity Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Tasks');
    data.tasks.slice(0, 5).forEach(t => doc.fontSize(10).text(`- [${t.completed ? 'x' : ' '}] ${t.title}`));
    doc.moveDown();

    doc.fontSize(16).text('Commits');
    data.commits.slice(0, 5).forEach(c => doc.fontSize(10).text(`- ${c.userName}: ${c.message}`));
    doc.moveDown();

    doc.fontSize(16).text('Bugs');
    data.bugs.slice(0, 5).forEach(b => doc.fontSize(10).text(`- [${b.status}] ${b.title} (assigned to ${b.assignedToName})`));

    doc.end();
};

module.exports = {
    generateCsv,
    generatePdf,
}; 