export default function MailList({
  mails,
  selectedId,
  onSelect,
  search,
  onSearch,
  onToggleStar,
  onToggleUnread,
  selectedIds,
  onToggleSelection,
}) {
  return (
    <div className="flex-none w-96 border-r border-gray-200 dark:border-white/10 p-4 flex flex-col bg-white dark:bg-transparent transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Inbox</h3>
        <span className="text-xs text-gray-500 dark:text-white/50">{mails.length}</span>
      </div>

      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search mail..."
        className="mb-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2 text-sm placeholder-gray-500 dark:placeholder-white/40
                   focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white transition-colors"
      />

      <div className="space-y-2 overflow-y-auto pr-1">
        {mails.map((mail) => {
          const active = mail.id === selectedId;

          return (
            <div
              key={mail.id}
              className={[
                "group rounded-2xl border transition relative",
                active
                  ? "bg-blue-50 dark:bg-white/10 border-blue-200 dark:border-white/20"
                  : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/20",
              ].join(" ")}
            >
              {/* Checkbox for multi-select - visible on hover or if selected */}
              <div
                className={[
                  "absolute left-4 top-4 z-10 transition-opacity",
                  selectedIds?.has(mail.id) || "group-hover:opacity-100 opacity-0"
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-blue-500 focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  checked={selectedIds?.has(mail.id) || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelection && onToggleSelection(mail.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                onClick={() => onSelect(mail.id)}
                className="w-full text-left p-3 pl-10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {/* unread dot - UPDATED: Blue for better visibility */}
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#0f0f12]", // Ring color matches container bg
                          mail.unread ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-transparent",
                        ].join(" ")}
                        title={mail.unread ? "Unread" : "Read"}
                      />
                      <span
                        className={[
                          "truncate transition-colors",
                          mail.unread
                            ? "font-bold text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-white/70",
                        ].join(" ")}
                      >
                        {mail.from}
                      </span>
                    </div>

                    <div
                      className={[
                        "mt-1 truncate text-sm transition-colors",
                        mail.unread
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-white/80",
                      ].join(" ")}
                    >
                      {mail.subject}
                    </div>

                    <div className="mt-1 text-xs text-gray-400 dark:text-white/50 truncate">
                      {mail.snippet}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={[
                      "text-xs transition-colors",
                      mail.unread ? "text-blue-500 dark:text-blue-400 font-medium" : "text-gray-400 dark:text-white/40"
                    ].join(" ")}>{mail.date}</span>

                    {/* action buttons (polish: appear on hover) */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                      {/* Toggle unread/read */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleUnread(mail.id);
                        }}
                        className="rounded-lg px-2 py-1 text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-white/70"
                        title={mail.unread ? "Mark as read" : "Mark as unread"}
                      >
                        {mail.unread ? "Read" : "Unread"}
                      </button>

                      {/* Star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStar(mail.id);
                        }}
                        className={[
                          "rounded-lg px-2 py-1 text-xs border transition",
                          mail.starred
                            ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                            : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10"
                        ].join(" ")}
                        title={mail.starred ? "Unstar" : "Star"}
                        aria-label="Star"
                      >
                        {mail.starred ? "★" : "☆"}
                      </button>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}

        {mails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">📭</span>
            </div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-1">It's empty here</h3>
            <p className="text-gray-500 dark:text-white/40 text-sm">No emails found in this folder.</p>
          </div>
        )}
      </div>
    </div>
  );
}
