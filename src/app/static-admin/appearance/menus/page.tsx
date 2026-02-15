import Link from 'next/link';
import { getMenus, getMenuItems } from '@/lib/cms';
import { Plus, Menu, GripVertical } from 'lucide-react';

function readLocalized(value: unknown): string {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  const localized = value as Record<string, unknown>;
  const english = localized.en;
  if (typeof english === 'string') return english;

  const firstValue = Object.values(localized).find((entry) => typeof entry === 'string');
  return typeof firstValue === 'string' ? firstValue : '';
}

export default async function MenusListPage() {
  // Get all menus
  const menus = await getMenus();

  // Get items for each menu
  const menusWithItems = await Promise.all(
    menus.map(async (menu) => {
      const items = await getMenuItems(menu.id);
      return { ...menu, items };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menus</h1>
          <p className="text-muted-foreground mt-1">
            Manage navigation menus for your site
          </p>
        </div>
        <Link
          href="/admin/menus/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add New Menu
        </Link>
      </div>

      {menusWithItems.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <Menu className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No menus yet.</p>
          <Link
            href="/admin/menus/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Create your first menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {menusWithItems.map((menu) => (
            <div
              key={menu.id}
              className="bg-secondary/30 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{menu.displayName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Slug: {menu.name} • Location: {menu.location ?? 'Not set'} •{' '}
                    {menu.items.length} items
                  </p>
                </div>
                <Link
                  href={`/admin/menus/${menu.id}`}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Edit Menu
                </Link>
              </div>

              {menu.items.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Menu Items:</p>
                  <ul className="space-y-2">
                    {menu.items
                      .filter((item) => !item.parentId)
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        const label = readLocalized(item.label);

                        return (
                          <li
                            key={item.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span>{label}</span>
                            {item.url && (
                              <span className="text-muted-foreground font-mono text-xs">
                                → {item.url}
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
