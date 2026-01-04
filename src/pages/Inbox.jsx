import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MailList from "../components/MailList";
import MailPreview from "../components/MailPreview";
import { mails as initialMails } from "../data/mockMails";


export default function Inbox() {
  const [mails, setMails] = useState(initialMails);
  const [selectedId, setSelectedId] = useState(initialMails[0]?.id ?? null);
  const [search, setSearch] = useState("");

  const [activeAccount, setActiveAccount] = useState("acc-gmail");
  const gmailCount = mails.filter(m => m.accountId === "acc-gmail").length;
  const outlookCount = mails.filter(m => m.accountId === "acc-outlook").length;

  // NEW: mobile view mode
  const [mobileView, setMobileView] = useState("list"); // "list" | "preview"

  const filteredMails = useMemo(() => {
  const q = search.trim().toLowerCase();

  return mails
    .filter((mail) => mail.accountId === activeAccount)
    .filter((mail) => {
      if (!q) return true;
      return [mail.from, mail.subject, mail.snippet]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
}, [mails, search, activeAccount]);

useEffect(() => {
  if (!filteredMails.some((m) => m.id === selectedId)) {
    setSelectedId(filteredMails[0]?.id ?? null);
  }
}, [filteredMails, selectedId]);


  const selectedMail =
    filteredMails.find((m) => m.id === selectedId) || filteredMails[0] || null;

  const toggleStar = (id) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const toggleUnread = (id) => {
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: !m.unread } : m))
    );
  };

  // When selecting on mobile: open preview
  const selectMail = (id) => {
    setSelectedId(id);
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
    );
    setMobileView("preview");
  };

  const goBackToList = () => setMobileView("list");

  return (
    <div className="h-screen bg-gray-950 text-white">
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
        <Sidebar 
  activeAccount={activeAccount}
  gmailCount={gmailCount}
  outlookCount={outlookCount}
  onAccountChange={(id) => {
    setActiveAccount(id);
    
    setSearch("");
    
    setMobileView("list");

    const firstMailOfAccount = mails.find((m) => m.accountId === id);
    setSelectedId(firstMailOfAccount?.id ?? null);
  }}
/>

        <MailList
          mails={filteredMails}
          selectedId={selectedMail?.id}
          onSelect={(id) => {
            setSelectedId(id);
            setMails((prev) =>
              prev.map((m) => (m.id === id ? { ...m, unread: false } : m))
            );
          }}
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

      {/* Mobile layout */}
      <div className="md:hidden h-full">
        {mobileView === "list" ? (
          <div className="h-full">
            {/* Optional small mobile header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-lg font-semibold">MailPortal</div>
              <div className="text-xs text-white/50">Inbox</div>
            </div>

            <MailList
              mails={filteredMails}
              selectedId={selectedMail?.id}
              onSelect={selectMail}
              search={search}
              onSearch={setSearch}
              onToggleStar={toggleStar}
              onToggleUnread={toggleUnread}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Mobile preview top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <button
                onClick={goBackToList}
                className="rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 hover:bg-white/10"
              >
                ← Back
              </button>

              <div className="text-sm text-white/60 truncate max-w-[60%]">
                {selectedMail?.from ?? "Preview"}
              </div>

              <div className="w-[72px]" />
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-y-auto">
              <MailPreview
                mail={selectedMail}
                onToggleStar={toggleStar}
                onToggleUnread={toggleUnread}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
