"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, MessageSquareText, Heart, MessageCircle, Coins, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { listPointRules, updatePointRule, type PointRule } from "@/lib/admin/points-api";
import { PageHeading } from "@/app/components/admin/PageHeading";

const ACTION_META: Record<string, { label: string; note: string; icon: React.ReactNode }> = {
  invite: { label: "Invite a friend", note: "Per friend who joins the waitlist", icon: <UserPlus className="w-4 h-4" strokeWidth={2.2} /> },
  prompt_response: { label: "Answer daily prompt", note: "Once per day", icon: <MessageSquareText className="w-4 h-4" strokeWidth={2.2} /> },
  like: { label: "Give a like", note: "Once per day", icon: <Heart className="w-4 h-4" strokeWidth={2.2} /> },
  comment: { label: "Write a comment", note: "Once per day", icon: <MessageCircle className="w-4 h-4" strokeWidth={2.2} /> },
};

function actionLabel(action: string) {
  return ACTION_META[action]?.label ?? action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminPointsPage() {
  const [rules, setRules] = useState<PointRule[]>([]);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPointRules();
      setRules(data);
      setDraft(Object.fromEntries(data.map((r) => [r.action, r.points])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load point rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = rules.some((r) => draft[r.action] !== r.points);

  const setPoints = (action: string, value: number) => {
    setDraft((current) => ({ ...current, [action]: Math.max(0, value || 0) }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const changed = rules.filter((r) => draft[r.action] !== r.points);
      await Promise.all(changed.map((r) => updatePointRule(r.action, draft[r.action])));
      setRules((current) => current.map((r) => ({ ...r, points: draft[r.action] ?? r.points })));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0">
      <title>Points Management - Bea Admin</title>

      <PageHeading title="Points Management" subtitle="Configure how many points each action awards." />

      {error && (
        <div className="flex items-center gap-2 bg-[#faf0eb] border border-[#e8c9c1] rounded-[10px] px-4 py-3">
          <AlertCircle className="w-4 h-4 text-[#b0453a] shrink-0" strokeWidth={2} />
          <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>
        </div>
      )}

      <section className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)]">
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-4 h-4 text-[#584939]" strokeWidth={2.2} />
          <h2 className="font-lato text-[16px] font-bold text-neutral-800">Action points</h2>
        </div>
        <p className="font-lato text-[13px] font-medium text-neutral-500 mb-4">
          Points earned per action. Daily limits are enforced by the backend.
        </p>

        {loading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-lato text-[13px] font-medium">Loading rules…</span>
          </div>
        ) : rules.length === 0 ? (
          <p className="font-lato text-[13px] font-medium text-neutral-400 py-6">No point rules configured.</p>
        ) : (
          <div className="flex flex-col divide-y divide-neutral-200/40">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#efebe5] flex items-center justify-center text-[#584939] shrink-0">
                    {ACTION_META[rule.action]?.icon ?? <Coins className="w-4 h-4" strokeWidth={2.2} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-lato text-[14px] font-semibold text-neutral-800 truncate">{actionLabel(rule.action)}</p>
                    <p className="font-lato text-[12px] font-medium text-neutral-400 truncate">
                      {ACTION_META[rule.action]?.note ?? rule.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    value={draft[rule.action] ?? rule.points}
                    onChange={(e) => setPoints(rule.action, Number(e.target.value))}
                    className="w-24 font-lato text-[16px] md:text-[14px] font-semibold text-neutral-800 bg-white border border-neutral-200/80 rounded-[8px] px-3 py-2 text-right focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                  <span className="font-lato text-[13px] font-medium text-neutral-400">pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className={`inline-flex items-center justify-center gap-2 font-lato text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors ${
            dirty && !saving ? "bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
          Save changes
        </button>
        {saved && <span className="font-lato text-[13px] font-semibold text-[#3d7a6e]">Saved</span>}
      </div>
    </main>
  );
}
