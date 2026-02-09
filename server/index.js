const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory database (seeded with initial data)
let mails = [
    {
        id: "1",
        accountId: "acc-gmail",
        folder: "inbox",
        from: "University Administration",
        subject: "Fall Semester Registration Open",
        snippet: "Registration for the upcoming Fall Semester is now open...",
        body: "Dear Student,\n\nRegistration for the upcoming Fall Semester is now open. Please log in to the student portal to select your courses.\n\nDeadlines:\n- Priority Registration: Aug 15\n- Regular Registration: Aug 25\n\nRegards,\nRegistrar Office",
        date: "2023-10-25",
        unread: true,
        starred: false,
    },
    {
        id: "2",
        accountId: "acc-gmail",
        folder: "inbox",
        from: "Netflix",
        subject: "Coming soon: New formatting",
        snippet: "We are updating our terms of service and formatting...",
        body: "Hi there,\n\nWe are making some changes to our viewer experience. Stay tuned for mostly minor updates.\n\nEnjoy watching!",
        date: "2023-10-24",
        unread: false,
        starred: true,
    },
    {
        id: "3",
        accountId: "acc-gmail",
        folder: "inbox",
        from: "Spotify",
        subject: "Your Weekly Discover Weekly",
        snippet: "Check out the new music we found just for you...",
        body: "Your weekly mixtape is ready. Dive in and discover your next favorite track.",
        date: "2023-10-24",
        unread: true,
        starred: false,
    },
    {
        id: "4",
        accountId: "acc-outlook",
        folder: "inbox",
        from: "Boss",
        subject: "Project Deadline",
        snippet: "Just a reminder that the project deadline is approaching...",
        body: "Hey,\n\nDon't forget the Q4 report is due this Friday. Let me know if you need any resources.\n\nThanks,\nBoss",
        date: "2023-10-23",
        unread: false,
        starred: true,
    },
    {
        id: "5",
        accountId: "acc-gmail",
        folder: "sent",
        from: "Me",
        subject: "Re: Project Deadline",
        snippet: "I will have it done by Friday, no worries...",
        body: "Hi Boss,\n\nI'm on track to finish by Friday. Will send a draft tomorrow.\n\nBest,\nMe",
        date: "2023-10-23",
        unread: false,
        starred: false,
    },
];

// GET /api/mails - Fetch all mails
app.get('/api/mails', (req, res) => {
    res.json(mails);
});

// POST /api/mails - Create new mail (send or draft)
app.post('/api/mails', (req, res) => {
    const newMail = {
        id: Date.now().toString(),
        accountId: req.body.accountId || "acc-gmail", // Default or from body
        folder: req.body.folder || "sent",
        from: "Me",
        subject: req.body.subject,
        snippet: req.body.snippet || "",
        body: req.body.body,
        date: new Date().toISOString().split('T')[0],
        unread: false,
        starred: false,
    };

    mails.unshift(newMail);
    res.status(201).json(newMail);
});

// PUT /api/mails/:id - Update mail (mark read, star, move to trash)
app.put('/api/mails/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const index = mails.findIndex(m => m.id === id);
    if (index !== -1) {
        mails[index] = { ...mails[index], ...updates };
        res.json(mails[index]);
    } else {
        res.status(404).json({ error: "Mail not found" });
    }
});

// DELETE /api/mails/:id - Delete mail
app.delete('/api/mails/:id', (req, res) => {
    const { id } = req.params;
    mails = mails.filter(m => m.id !== id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
