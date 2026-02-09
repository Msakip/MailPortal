import Sidebar from "../components/Sidebar";
import MailList from "../components/MailList";
import MailPreview from "../components/MailPreview";
import ComposeModal from "../components/ComposeModal";
import SettingsPage from "../pages/SettingsPage";
import { useMailSystem } from "../hooks/useMailSystem";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Inbox() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    theme,
    toggleTheme,
    // Bulk
    markAllRead,
    markAllUnread,
    starAll,
    unstarAll,
    deleteSelected,
    openDraft,
    openCompose // Added
  } = useMailSystem();


  const goBackToList = () => setMobileView("list");

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200 relative">
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">
        <Sidebar
          activeAccount={activeAccount}
          activeNav={activeNav}
          gmailCount={gmailCount}
          outlookCount={outlookCount}
          onAccountChange={handleAccountChange}
          onNavChange={handleNavChange}
          onCompose={openCompose} // Use openCompose
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />

        {activeNav === 'settings' ? (
          <div className="flex-1 overflow-y-auto">
            <SettingsPage />
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden relative">
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
              onReply={selectedMail?.folder === 'drafts' ? openDraft : openReply}
              onDelete={deleteMail}
            />

            {/* Multi-select Toolbar - Desktop (Floating over preview/list or just bottom center) */}
            {selectedIds.size > 0 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl px-4 py-2 animate-in slide-in-from-bottom-4 duration-200">
                <span className="text-sm font-medium text-gray-900 dark:text-white mr-2 border-r border-gray-200 dark:border-white/10 pr-3">
                  {selectedIds.size} selected
                </span>

                <button onClick={markAllRead} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300" title="Mark read">
                  📩
                </button>
                <button onClick={markAllUnread} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300" title="Mark unread">
                  ✉️
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1"></div>
                <button onClick={starAll} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-yellow-500" title="Star">
                  ★
                </button>
                <button onClick={unstarAll} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400" title="Unstar">
                  ☆
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1"></div>
                <button onClick={deleteSelected} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400" title="Delete">
                  🗑️
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden h-full relative">
        {activeNav === 'settings' ? (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <button onClick={() => handleNavChange('inbox')} className="text-xl">←</button>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">Settings</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SettingsPage />
            </div>
          </div>
        ) : (
          <>
            {mobileView === "list" ? (
              <div className="h-full relative">
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">MailPortal</div>
                    <div className="text-xs text-gray-500 dark:text-white/50">Inbox</div>
                  </div>
                  <button onClick={() => handleNavChange('settings')} className="text-xl">⚙️</button>
                </div>

                <MailList
                  mails={filteredMails}
                  selectedId={selectedMail?.id}
                  onSelect={selectMail}
                  search={search}
                  onSearch={setSearch}
                  onToggleStar={toggleStar}
                  onToggleUnread={toggleUnread}
                  selectedIds={selectedIds}
                  onToggleSelection={toggleSelection}
                />

                {selectedIds.size > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 z-50 flex items-center justify-between bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl px-4 py-3 animate-in slide-in-from-bottom-4 duration-200">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedIds.size}
                    </span>

                    <div className="flex gap-1">
                      <button onClick={markAllRead} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" title="Read">📩</button>
                      <button onClick={starAll} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" title="Star">★</button>
                      <button onClick={deleteSelected} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500" title="Delete">🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <button
                    onClick={goBackToList}
                    className="rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                  >
                    ← Back
                  </button>

                  <div className="text-sm text-gray-500 dark:text-white/60 truncate max-w-[60%]">
                    {selectedMail?.from ?? "Preview"}
                  </div>
                  <div className="w-[72px]" />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <MailPreview
                    mail={selectedMail}
                    onToggleStar={toggleStar}
                    onToggleUnread={toggleUnread}
                    onReply={selectedMail?.folder === 'drafts' ? openDraft : openReply}
                    onDelete={deleteMail}
                  />
                </div>
              </div>
            )}
          </>
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
