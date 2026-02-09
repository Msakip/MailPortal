import { useState, useEffect } from "react";
import { useMailSystem } from "../hooks/useMailSystem";

export default function SettingsPage() {
    const { settings, saveSettings } = useMailSystem();
    const [name, setName] = useState("");
    const [signature, setSignature] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setName(settings.name || "");
            setSignature(settings.signature || "");
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveSettings({ name, signature });
        setIsSaving(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Profile</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                                Display Name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Signature</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">
                            Email Signature
                        </label>
                        <textarea
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
                            placeholder="Enter your signature..."
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-white/40">
                            This will be automatically appended to new emails.
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 active:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
