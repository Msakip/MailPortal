const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: "📥", count: 2 },
  { id: "starred", label: "Starred", icon: "⭐", count: 1 },
  { id: "sent", label: "Sent", icon: "📤", count: 0 },
  { id: "drafts", label: "Drafts", icon: "📝", count: 0 },
  { id: "trash", label: "Trash", icon: "🗑️", count: 0 },
  { id: "spam", label: "Spam", icon: "🛡️", count: 0 },
];

const ACCOUNTS = [
  { id: "acc-gmail", name: "Gmail", email: "user@gmail.com" },
  { id: "acc-outlook", name: "Outlook", email: "user@outlook.com" },
];

export default function Sidebar({
  activeNav = "inbox",
  onNavChange = () => { },
  activeAccount = "acc-gmail",
  onAccountChange = () => { },
  onCompose = () => { },
  theme = "dark",
  onToggleTheme = () => { }
}) {
  return (
    <aside className="hidden md:flex flex-none w-64 border-r border-gray-200 dark:border-white/10 p-4 flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Top brand */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">MailPortaL</div>
        <button
          onClick={onCompose}
          className="rounded-xl px-2 py-1 text-xs bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 transition shadow-lg shadow-blue-900/20"
        >
          + Compose
        </button>
      </div>

      {/* Part 1: Navigation */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
          Mailboxes
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeNav;

            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={[
                  "w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm border transition",
                  active
                    ? "bg-white shadow-sm border-gray-200 dark:bg-white/10 dark:border-white/20 text-gray-900 dark:text-white"
                    : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                ].join(" ")}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </span>

                {item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Spacer pushes accounts to bottom */}
      <div className="flex-1" />

      {/* Part 2: Accounts */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-white/40 mb-2">
          Your mails
        </div>

        <div className="space-y-1">
          {ACCOUNTS.map((acc) => {
            const active = acc.id === activeAccount;

            return (
              <button
                key={acc.id}
                onClick={() => onAccountChange(acc.id)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-left border transition",
                  active
                    ? "bg-white shadow-sm border-gray-200 dark:bg-white/10 dark:border-white/20 text-gray-900 dark:text-white"
                    : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{acc.name}</span>
                  <span className="text-xs opacity-50">
                    {active ? "Active" : ""}
                  </span>
                </div>
                <div className="text-xs opacity-50 truncate">{acc.email}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 3: Settings */}
      <div className="mt-6">
        <button
          onClick={() => onNavChange('settings')}
          className={[
            "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition",
            activeNav === 'settings'
              ? "bg-white shadow-sm border-gray-200 dark:bg-white/10 dark:border-white/20 text-gray-900 dark:text-white"
              : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
          ].join(" ")}
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition"
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
