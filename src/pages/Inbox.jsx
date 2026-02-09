import Sidebar from "../components/Sidebar";
import MailList from "../components/MailList";
import MailPreview from "../components/MailPreview";
import ComposeModal from "../components/ComposeModal";
import { useMailSystem } from "../hooks/useMailSystem";

export default function Inbox() {
  const {
    // State
    search,
    activeAccount,
    activeNav,
    isComposeOpen,
    composeInitData,
    mobileView,
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
    sendMail,
    handleAccountChange,
    handleNavChange,
    toggleSelection,
    selectedIds,
    theme, // New
    toggleTheme // New
  } = useMailSystem();


  const goBackToList = () => setMobileView("list");

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
        <Sidebar
          activeAccount={activeAccount}
          activeNav={activeNav}
          gmailCount={gmailCount}
          outlookCount={outlookCount}
          onAccountChange={handleAccountChange}
          onNavChange={handleNavChange}
          onCompose={() => setIsComposeOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <MailList
          mails={filteredMails}
          selectedId={selectedMail?.id}
          onSelect={selectMail}
          search={search}
          onSearch={setSearch}
          onToggleStar={toggleStar}
          onToggleUnread={toggleUnread}
          selectedIds={selectedIds} // New
          onToggleSelection={toggleSelection} // New
        />
        <MailPreview
          mail={selectedMail}
          onToggleStar={toggleStar}
          onToggleUnread={toggleUnread}
          onReply={openReply}
          onDelete={deleteMail}
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
              selectedIds={selectedIds} // New
              onToggleSelection={toggleSelection} // New
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
                onReply={openReply}
                onDelete={deleteMail}
              />
            </div>
          </div>
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        initialData={composeInitData}
        onClose={() => {
          setIsComposeOpen(false);
          setComposeInitData(null);
        }}
        fromEmail={activeAccount === "acc-gmail" ? "user@gmail.com" : "user@outlook.com"}
        onSend={sendMail}
      />
    </div>
  );
}
