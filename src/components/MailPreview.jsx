export default function MailPreview({ mail, onToggleStar, onToggleUnread }) {
  if (!mail) {
    return (
      <div className="min-w-0 flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-semibold">Select an email</h3>
        <p className="text-white/60 mt-2">Email preview will appear here.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1 p-6 overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold truncate">{mail.subject}</h2>
          <p className="text-white/60 mt-1 truncate">
            From: <span className="text-white/80">{mail.from}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-none">
          <span className="text-sm text-white/50">{mail.date}</span>

          <button
            onClick={() => onToggleUnread(mail.id)}
            className="rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 hover:bg-white/10"
          >
            {mail.unread ? "Mark read" : "Mark unread"}
          </button>

          <button
            onClick={() => onToggleStar(mail.id)}
            className="rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 hover:bg-white/10"
            aria-label="Star"
            title={mail.starred ? "Unstar" : "Star"}
          >
            {mail.starred ? "★" : "☆"}
          </button>
        </div>
      </div>

      <div className="mt-6 whitespace-pre-wrap text-white/80 leading-relaxed">
        {mail.body}
      </div>
    </div>
  );
}
