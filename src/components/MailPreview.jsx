export default function MailPreview({ mail, onToggleStar, onToggleUnread, onReply, onDelete }) {
  if (!mail) {
    return (
      <div className="min-w-0 flex-1 flex flex-col items-center justify-center p-6 text-center opacity-50">
        <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-3xl">
          ✉️
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select an email</h3>
        <p className="text-gray-500 dark:text-white/60 mt-2 max-w-sm">Choose an email from the list to preview its content, or start a new conversation.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1 p-6 overflow-y-auto bg-white dark:bg-transparent transition-colors duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold truncate text-gray-900 dark:text-white">{mail.subject}</h2>
          <p className="text-gray-500 dark:text-white/60 mt-1 truncate">
            From: <span className="text-gray-900 dark:text-white/80">{mail.from}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-none">
          <span className="text-sm text-gray-400 dark:text-white/50">{mail.date}</span>

          {mail.folder === 'drafts' ? (
            <button
              onClick={() => onReply(mail)} // onReply here will be passed "openDraft" from parent if we wire it up, or we need a new prop? 
              // Wait, Inbox.jsx passes `onReply={openReply}`. 
              // If I change Inbox to pass `openDraft` when it is a draft, or just pass `openDraft` as a separate prop.
              // Let's assume we will pass `onEdit` prop.
              className="rounded-xl px-3 py-2 text-sm bg-blue-600 text-white border border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition"
            >
              ✐ Edit Draft
            </button>
          ) : (
            <>
              <button
                onClick={() => onReply(mail)}
                className="rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white"
                title="Reply"
              >
                Reply
              </button>
            </>
          )}

          <button
            onClick={() => onDelete(mail.id)}
            className="rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/20 text-gray-700 dark:text-white transition"
            title="Delete"
          >
            Trash
          </button>

          {mail.folder !== 'drafts' && (
            <>
              <button
                onClick={() => onToggleUnread(mail.id)}
                className="rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white"
              >
                {mail.unread ? "Mark read" : "Mark unread"}
              </button>

              <button
                onClick={() => onToggleStar(mail.id)}
                className="rounded-xl px-3 py-2 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white"
                aria-label="Star"
                title={mail.starred ? "Unstar" : "Star"}
              >
                {mail.starred ? "★" : "☆"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-white/80">
        {mail.body}
      </div>
    </div>
  );
}
