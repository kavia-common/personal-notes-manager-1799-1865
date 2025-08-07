import { component$, QRL } from '@builder.io/qwik';

interface SidebarProps {
  onSearch$: QRL<(value: string) => void>;
  searchTerm: string;
}

export const Sidebar = component$((props: SidebarProps) => {
  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">Notes</span>
      </div>
      <input
        class="sidebar-search"
        type="text"
        placeholder="Search notes..."
        value={props.searchTerm}
        onInput$={async (ev) => {
          const target = ev.target as HTMLInputElement | null;
          if (target) {
            await props.onSearch$(target.value);
          }
        }}
        aria-label="Search notes"
      />
    </aside>
  );
});
