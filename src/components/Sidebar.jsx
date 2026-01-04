const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: "📥", count:  2},
  { id: "starred", label: "Starred", icon: "⭐", count: 1 },
  { id: "spam", label: "Spam", icon: "🛡️", count: 0 },
  { id: "sent", label: "Sent", icon: "📤", count: 0 },
];

const ACCOUNTS = [
  { id: "acc-gmail", name: "Gmail", email: "user@gmail.com" },
  { id: "acc-outlook", name: "Outlook", email: "user@outlook.com" },
];

export default function Sidebar({
  activeNav = "inbox",
  onNavChange = () => {},
  activeAccount = "acc-gmail",
  onAccountChange = () => {},
}) {
  return (
    <aside className="hidden md:flex flex-none w-64 border-r border-white/10 p-4 flex-col">
      {/* Top brand */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">MailPortaL</div>
        <button className="rounded-xl px-2 py-1 text-xs bg-white/5 border border-white/10 hover:bg-white/10">
          +
        </button>
      </div>

      {/* Part 1: Navigation */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
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
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20",
                ].join(" ")}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </span>

                {item.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
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
        <div className="text-xs uppercase tracking-wider text-white/40 mb-2">
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
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{acc.name}</span>
                  <span className="text-xs text-white/50">
                    {active ? "Active" : ""}
                  </span>
                </div>
                <div className="text-xs text-white/50 truncate">{acc.email}</div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
