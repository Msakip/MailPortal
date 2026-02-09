import { useState, useEffect } from "react";

export default function ComposeModal({ isOpen, onClose, onSend, fromEmail, initialData }) {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    // Populate form when opening or when initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTo(initialData.to || "");
                setSubject(initialData.subject || "");
                setBody(initialData.body || "");
            } else {
                // Reset if opening fresh
                setTo("");
                setSubject("");
                setBody("");
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSend = () => {
        if (!to) return; // Basic validation
        onSend({ to, subject, body });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col h-[600px] animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col">
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <span className="text-sm text-gray-400 dark:text-white/40 w-12">From:</span>
                        <span className="text-sm text-gray-900 dark:text-white/80">{fromEmail}</span>
                    </div>

                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <span className="text-sm text-gray-400 dark:text-white/40 w-12">To:</span>
                        <input
                            autoFocus
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20"
                            placeholder="Recipient"
                        />
                    </div>

                    <div className="px-6 py-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <span className="text-sm text-gray-400 dark:text-white/40 w-12">Subject:</span>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20"
                            placeholder="Subject"
                        />
                    </div>

                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="flex-1 p-6 bg-transparent border-none outline-none resize-none text-gray-800 dark:text-white/90 leading-relaxed placeholder-gray-400 dark:placeholder-white/20"
                        placeholder="Write your message..."
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                    <button
                        onClick={() => {
                            // Simple draft save
                            onSend({ to, subject, body, isDraft: true });
                            onClose();
                        }}
                        className="text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        Save as Draft
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/10 transition"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!to} // Only 'to' is required for sending
                            className="px-6 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-500/20"
                        >
                            Send Message
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
