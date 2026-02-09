import { useState, useMemo, useEffect, useCallback } from "react";
import { mails as initialMails } from "../data/mockMails";

export function useMailSystem() {
    // State
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "http://localhost:3001/api/mails";

    // Fetch mails from API
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setMails(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch mails:", err);
                setError(err);
                setLoading(false);
            });
    }, []);

    // Theme state
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("mailportal_theme") || "dark";
        } catch {
            return "dark";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("mailportal_theme", theme);
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } catch (e) {
            console.error("Failed to save theme", e);
        }
    }, [theme]);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set()); // Multi-select
    const [search, setSearch] = useState("");

    const [activeAccount, setActiveAccount] = useState("acc-gmail");
    const [activeNav, setActiveNav] = useState("inbox"); // "inbox" | "starred" | "spam" | "sent" | "trash" | "drafts"
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeInitData, setComposeInitData] = useState(null); // { to, subject, body }
    const [mobileView, setMobileView] = useState("list"); // "list" | "preview"

    // Computed Counts
    const gmailCount = mails.filter(m => m.accountId === "acc-gmail" && m.folder === "inbox" && m.unread).length;
    const outlookCount = mails.filter(m => m.accountId === "acc-outlook" && m.folder === "inbox" && m.unread).length;

    // Filter Logic
    const filteredMails = useMemo(() => {
        const q = search.trim().toLowerCase();

        return mails
            .filter((mail) => mail.accountId === activeAccount)
            .filter((mail) => {
                if (activeNav === "starred") return mail.starred;
                return mail.folder === activeNav;
            })
            .filter((mail) => {
                if (!q) return true;
                return [mail.from, mail.subject, mail.snippet]
                    .join(" ")
                    .toLowerCase()
                    .includes(q);
            });
    }, [mails, search, activeAccount, activeNav]);

    // Auto-select first email if selection invalid
    useEffect(() => {
        if (!filteredMails.some((m) => m.id === selectedId)) {
            setSelectedId(filteredMails[0]?.id ?? null);
        }
    }, [filteredMails, selectedId]);

    const selectedMail = filteredMails.find((m) => m.id === selectedId) || filteredMails[0] || null;

    // Actions
    const toggleSelection = useCallback((id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }, []);

    const toggleStar = useCallback((id) => {
        // Optimistic
        setMails((prev) =>
            prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
        );
        // API call
        const mail = mails.find(m => m.id === id);
        if (mail) {
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ starred: !mail.starred })
            }).catch(e => console.error("Failed to toggle star", e));
        }
    }, [mails]);

    const toggleUnread = useCallback((id) => {
        // Optimistic
        setMails((prev) =>
            prev.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m))
        );
        // API call
        const mail = mails.find(m => m.id === id);
        if (mail) {
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unread: !mail.unread })
            }).catch(e => console.error("Failed to toggle unread", e));
        }
    }, [mails]);

    const selectMail = useCallback((id) => {
        setSelectedId(id);
        setMails((prev) =>
            prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
        );
        setMobileView("preview");
        // Optional: Clear multi-select when selecting a single email?
        // setSelectedIds(new Set()); 
        // No, keep it independent for now.
    }, []);

    const deleteMail = useCallback((id) => {
        // Optimistic update
        // Logic: if id is provided, use it. Else if selectedId use it. Else if selectedIds use them.
        let idsToDelete = new Set();
        if (id) {
            idsToDelete.add(id);
        } else {
            if (selectedIds.size > 0) {
                idsToDelete = new Set(selectedIds);
            } else if (selectedId) {
                idsToDelete.add(selectedId);
            }
        }

        if (idsToDelete.size === 0) return;

        // Update UI
        setMails(prev => {
            return prev.filter(m => !idsToDelete.has(m.id));
        });

        setSelectedIds(new Set());
        if (id && selectedId === id) setSelectedId(null);
        if (idsToDelete.has(selectedId)) setSelectedId(null);

        // API Calls
        idsToDelete.forEach(mailId => {
            const mail = mails.find(m => m.id === mailId);
            if (!mail) return;

            if (mail.folder === "trash") {
                fetch(`${API_URL}/${mailId}`, { method: 'DELETE' })
                    .catch(e => console.error("Failed to delete", e));
            } else {
                fetch(`${API_URL}/${mailId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folder: "trash" })
                }).catch(e => console.error("Failed to move to trash", e));
            }
        });

    }, [mails, selectedIds, selectedId, API_URL]);

    const openReply = useCallback((mail) => {
        setComposeInitData({
            to: mail.from,
            subject: mail.subject.startsWith("Re:") ? mail.subject : "Re: " + mail.subject,
            body: "\n\n\n> " + mail.body.replace(/\n/g, "\n> "),
        });
        setIsComposeOpen(true);
    }, []);

    // Settings
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/settings")
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(e => console.error("Failed to load settings", e));
    }, []);

    const saveSettings = useCallback(async (newSettings) => {
        try {
            const res = await fetch("http://localhost:3001/api/settings", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            const data = await res.json();
            setSettings(data);
        } catch (e) {
            console.error("Failed to save settings", e);
        }
    }, []);

    const sendMail = useCallback((data) => {
        let bodyToSend = data.body;

        // Append signature if it's a new mail (not a reply to a specific thread, or maybe always? usually always for new/reply)
        // Simple logic: if settings.signature exists and it's not a draft update (check data.isDraft logic if needed)

        // Actually, let's append signature ONLY when Opening Compose? 
        // Or when sending? Standard is usually when opening compose so user can edit it.
        // But the plan said "automatically appended". 
        // Let's stick to appending when sending for now IF the user hasn't typed it? 
        // No, standard is to put it in the box when you open it.
        // Let's change strategy: Update `openCompose` to include signature.

        const newMailData = {
            ...data,
            accountId: activeAccount,
            folder: data.isDraft ? "drafts" : "sent"
        };
        // ... (rest of sendMail)

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMailData)
        })
            .then(res => res.json())
            .then(savedMail => {
                setMails(prev => [savedMail, ...prev]);
            })
            .catch(err => console.error("Failed to send mail:", err));

        setIsComposeOpen(false);
        setComposeInitData(null);
    }, [activeAccount, settings]); // Added settings dep

    // Enhanced openCompose to include signature
    const openCompose = useCallback(() => {
        let str = "";
        if (settings?.signature) {
            str = settings.signature;
        }
        setComposeInitData({ body: str });
        setIsComposeOpen(true);
    }, [settings]);


    return {
        // ... OLD returns
        // State
        mails,
        search,
        activeAccount,
        activeNav,
        isComposeOpen,
        composeInitData,
        mobileView,
        selectedIds,
        theme,
        settings, // New
        // Computed
        gmailCount,
        outlookCount,
        filteredMails,
        selectedMail,
        selectedId,
        // Actions
        setSearch,
        setIsComposeOpen, // Note: We might want to use openCompose instead of setting true directly in UI
        setComposeInitData,
        setMobileView,
        toggleStar,
        toggleUnread,
        selectMail,
        deleteMail,
        openReply,
        openDraft,
        sendMail,
        handleAccountChange,
        handleNavChange,
        toggleSelection,
        toggleTheme,
        saveSettings, // New
        openCompose, // New
        // Bulk
        markAllRead,
        markAllUnread,
        starAll,
        unstarAll,
        deleteSelected,
    };

    const handleAccountChange = useCallback((id) => {
        setActiveAccount(id);
        setActiveNav("inbox");
        setSearch("");
        setMobileView("list");
        setSelectedId(null);
        setSelectedIds(new Set());
    }, []);

    const handleNavChange = useCallback((navId) => {
        setActiveNav(navId);
        setSearch("");
        setMobileView("list");
        setSelectedId(null);
        setSelectedIds(new Set());
    }, []);


    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.matches("input, textarea")) return;

            switch (e.key) {
                case "j":
                case "ArrowDown": {
                    e.preventDefault();
                    if (!selectedId && filteredMails.length > 0) {
                        setSelectedId(filteredMails[0].id);
                        return;
                    }
                    const index = filteredMails.findIndex(m => m.id === selectedId);
                    if (index < filteredMails.length - 1) {
                        const nextId = filteredMails[index + 1].id;
                        setSelectedId(nextId);
                        setMails(prev => prev.map(m => m.id === nextId ? { ...m, unread: false } : m));
                    }
                    break;
                }
                case "k":
                case "ArrowUp": {
                    e.preventDefault();
                    if (!selectedId && filteredMails.length > 0) {
                        setSelectedId(filteredMails[0].id);
                        return;
                    }
                    const index = filteredMails.findIndex(m => m.id === selectedId);
                    if (index > 0) {
                        const prevId = filteredMails[index - 1].id;
                        setSelectedId(prevId);
                        setMails(prev => prev.map(m => m.id === prevId ? { ...m, unread: false } : m));
                    }
                    break;
                }
                case "Delete":
                case "Backspace": {
                    // Call deleteMail without ID to trigger smart delete (selection or current)
                    e.preventDefault();
                    deleteMail();
                    break;
                }
                case "c": {
                    e.preventDefault();
                    setIsComposeOpen(true);
                    break;
                }
                case "r": {
                    const currentMail = filteredMails.find(m => m.id === selectedId);
                    if (currentMail) {
                        e.preventDefault();
                        openReply(currentMail);
                    }
                    break;
                }
                case "/": {
                    e.preventDefault();
                    const searchInput = document.querySelector('input[placeholder="Search mail..."]');
                    if (searchInput) searchInput.focus();
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredMails, selectedId, deleteMail, openReply]);


    const openDraft = useCallback((mail) => {
        setComposeInitData({
            id: mail.id, // Track that we are editing an existing draft
            to: mail.to || "", // Drafts might not have all fields
            subject: mail.subject,
            body: mail.body,
            isDraft: true
        });
        setIsComposeOpen(true);
    }, []);

    // Bulk Actions
    const markAllRead = useCallback(() => {
        selectedIds.forEach(id => {
            // Optimistic
            setMails(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
            // API
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unread: false })
            }).catch(e => console.error("Failed to mark read", e));
        });
        setSelectedIds(new Set());
    }, [selectedIds, mails]);

    const markAllUnread = useCallback(() => {
        selectedIds.forEach(id => {
            setMails(prev => prev.map(m => m.id === id ? { ...m, unread: true } : m));
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unread: true })
            }).catch(e => console.error("Failed to mark unread", e));
        });
        setSelectedIds(new Set());
    }, [selectedIds, mails]);

    const starAll = useCallback(() => {
        selectedIds.forEach(id => {
            const mail = mails.find(m => m.id === id);
            if (!mail) return;
            const newStarred = !mail.starred; // Toggle or set true? Usually tools set to specific state. Let's make this "Star" (true). 
            // Actually usually it's "Star" or "Unstar". Let's assume "Star".
            setMails(prev => prev.map(m => m.id === id ? { ...m, starred: true } : m));
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ starred: true })
            }).catch(e => console.error("Failed to star", e));
        });
        setSelectedIds(new Set());
    }, [selectedIds, mails]);

    const unstarAll = useCallback(() => {
        selectedIds.forEach(id => {
            setMails(prev => prev.map(m => m.id === id ? { ...m, starred: false } : m));
            fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ starred: false })
            }).catch(e => console.error("Failed to unstar", e));
        });
        setSelectedIds(new Set());
    }, [selectedIds, mails]);

    // Multi-delete
    const deleteSelected = useCallback(() => {
        deleteMail(); // deleteMail already handles selectedIds
    }, [deleteMail]);


    return {
        // State
        mails,
        search,
        activeAccount,
        activeNav,
        isComposeOpen,
        composeInitData,
        mobileView,
        selectedIds,
        theme,
        // Computed
        gmailCount,
        outlookCount,
        filteredMails,
        selectedMail,
        selectedId,
        // Actions
        setSearch,
        setIsComposeOpen,
        setComposeInitData,
        setMobileView,
        toggleStar,
        toggleUnread,
        selectMail,
        deleteMail,
        openReply,
        openDraft, // New
        sendMail,
        handleAccountChange,
        handleNavChange,
        toggleSelection,
        toggleTheme,
        // Bulk
        markAllRead,
        markAllUnread,
        starAll,
        unstarAll,
        deleteSelected
    };
}
