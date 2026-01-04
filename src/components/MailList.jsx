export default function MailList({
  mails,
  selectedId,
  onSelect,
  search,
  onSearch,
  onToggleStar,
  onToggleUnread,
}) {
  return (
    <div className="flex-none w-96 border-r border-white/10 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Inbox</h3>
        <span className="text-xs text-white/50">{mails.length}</span>
      </div>

      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search mail..."
        className="mb-4 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder-white/40
                   focus:outline-none focus:border-white/30 focus:bg-white/10"
      />

      <div className="space-y-2 overflow-y-auto pr-1">
        {mails.map((mail) => {
          const active = mail.id === selectedId;

          return (
            <div
              key={mail.id}
              className={[
                "group rounded-2xl border transition",
                active
                  ? "bg-white/10 border-white/20"
                  : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20",
              ].join(" ")}
            >
              <button
                onClick={() => onSelect(mail.id)}
                className="w-full text-left p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {/* unread dot */}
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          mail.unread ? "bg-white" : "bg-transparent",
                        ].join(" ")}
                        title={mail.unread ? "Unread" : "Read"}
                      />
                      <span
                        className={[
                          "truncate",
                          mail.unread ? "font-semibold" : "text-white/80",
                        ].join(" ")}
                      >
                        {mail.from}
                      </span>
                    </div>

                    <div
                      className={[
                        "mt-1 truncate",
                        mail.unread ? "font-semibold" : "text-white/90",
                      ].join(" ")}
                    >
                      {mail.subject}
                    </div>

                    <div className="mt-1 text-sm text-white/60 truncate">
                      {mail.snippet}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-white/50">{mail.date}</span>

                    {/* action buttons (polish: appear on hover) */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                      {/* Toggle unread/read */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleUnread(mail.id);
                        }}
                        className="rounded-lg px-2 py-1 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
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
                        className="rounded-lg px-2 py-1 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
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
          <div className="text-white/50 text-sm text-center mt-6">
            No emails found
          </div>
        )}
      </div>
    </div>
  );
}
