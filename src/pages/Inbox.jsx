import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MailList from "../components/MailList";
import MailPreview from "../components/MailPreview";
import { mails as initialMails } from "../data/mockMails";

export default function Inbox() {
  const [mails, setMails] = useState(initialMails);
  const [selectedId, setSelectedId] = useState(initialMails[0]?.id ?? null);
  const [search, setSearch] = useState("");

  const filteredMails = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mails;

    return mails.filter((mail) =>
      [mail.from, mail.subject, mail.snippet].join(" ").toLowerCase().includes(q)
    );
  }, [mails, search]);

  const selectedMail =
    filteredMails.find((m) => m.id === selectedId) || filteredMails[0] || null;

  // Toggle starred
  const toggleStar = (id) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  // Toggle unread/read
  const toggleUnread = (id) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m))
    );
  };

  // (Polish) when you open an email, mark it as read automatically
  const selectMail = (id) => {
    setSelectedId(id);
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
    );
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />

      <MailList
        mails={filteredMails}
        selectedId={selectedMail?.id}
        onSelect={selectMail}
        search={search}
        onSearch={setSearch}
        onToggleStar={toggleStar}
        onToggleUnread={toggleUnread}
      />

      <MailPreview
        mail={selectedMail}
        onToggleStar={toggleStar}
        onToggleUnread={toggleUnread}
      />
    </div>
  );
}
