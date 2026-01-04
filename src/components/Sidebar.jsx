import Logo from "./Logo";

export default function Sidebar() {
  return (
    <div className="flex-none w-64 border-r border-white/10 p-4">
      <Logo />

      <ul className="mt-6 space-y-2 text-white/70">
        <li>Inbox</li>
        <li>Starred</li>
        <li>Sent</li>
      </ul>
    </div>
  );
}
