import type { ReferralTreeNode } from "@/lib/admin/data";
import { RoleBadge } from "@/app/components/admin/Badge";

function TreeNode({ node }: { node: ReferralTreeNode }) {
  return (
    <li className="relative pl-5">
      <span className="absolute left-0 top-3 w-3 h-px bg-neutral-300" />
      <div className="flex items-center justify-between gap-3 py-2 border-b border-neutral-200/40">
        <div className="min-w-0">
          <p className="font-lato text-[13px] font-semibold text-neutral-800 truncate">{node.user.full_name}</p>
          <p className="font-lato text-[11px] font-medium text-neutral-400 truncate">{node.user.email}</p>
        </div>
        <RoleBadge role={node.user.role} />
      </div>
      {node.children.length > 0 && (
        <ul className="ml-2 border-l border-neutral-200/60">
          {node.children.map((child) => (
            <TreeNode key={child.user.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ReferralTree({ nodes }: { nodes: ReferralTreeNode[] }) {
  if (nodes.length === 0) {
    return (
      <p className="font-lato text-[13px] font-medium text-neutral-400 py-2">
        No referrals yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {nodes.map((node) => (
        <TreeNode key={node.user.id} node={node} />
      ))}
    </ul>
  );
}
