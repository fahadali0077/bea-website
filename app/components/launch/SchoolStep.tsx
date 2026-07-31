/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";

import { AMBASSADOR_ROLE_OPTIONS, INVITE_STEP, GRADUATION_YEARS } from "@/lib/launch";
import { fetchAllSchools } from "@/lib/api/fetch-all-schools-search";
import type { School } from "@/lib/api/schools.types";
import { useCompleteAmbassadorOnboardingMutation } from "@/features/api/apiSlice";
import { getApiErrorMessage, persistAccessToken } from "@/lib/api";

const formatSchoolLocation = (city: string | null | undefined, state: string | null | undefined) =>
  city && state ? `${city}, ${state}` : city || state || null;

export function SchoolStep() {
  const router = useRouter();
  const { eyebrow, title, agreement, cta } = INVITE_STEP;

  const [schools, setSchools] = useState<School[]>([]);
  const [schoolId, setSchoolId] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [graduationYear, setGraduationYear] = useState("");
  const [role] = useState(AMBASSADOR_ROLE_OPTIONS[0]);
  const [instagram, setInstagram] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolPickerRef = useRef<HTMLDivElement>(null);

  const [completeOnboarding, { isLoading: submitting }] = useCompleteAmbassadorOnboardingMutation();

  useEffect(() => {
    let active = true;
    fetchAllSchools()
      .then((list) => {
        if (active) setSchools(list);
      })
      .catch(() => {
        if (active) setError("Failed to load schools");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!schoolPickerRef.current?.contains(event.target as Node)) {
        setSchoolDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredSchools = useMemo(() => {
    const term = schoolSearch.trim().toLowerCase();
    if (!term) return schools;
    return schools.filter((s) => s.name.toLowerCase().includes(term));
  }, [schools, schoolSearch]);

  const selectSchool = (school: School) => {
    setSchoolId(school.id);
    setSchoolSearch(school.name);
    setSchoolDropdownOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSchool = schools.find((s) => s.id === schoolId);
    if (!selectedSchool) return setError("Please select your school.");
    if (!graduationYear) return setError("Please select your graduation year.");
    if (!agreed) return setError("Please agree to the program guidelines.");

    const token = sessionStorage.getItem("ambassador_onboarding_token") ?? "";
    const fullName = sessionStorage.getItem("invite_full_name") ?? "";
    if (!token) return setError("Your invite link has expired. Please request a new one.");
    if (!fullName) return setError("Please go back and enter your full name.");

    setError(null);
    try {
      const result = await completeOnboarding({
        token,
        fullName,
        schoolId: selectedSchool.id,
        marketId: selectedSchool.marketId,
        graduationYear: Number(graduationYear),
        instagram: instagram.trim() || undefined,
      }).unwrap();

      persistAccessToken(result.token);

      sessionStorage.setItem("onboarding_school_id", selectedSchool.id);
      sessionStorage.setItem("onboarding_market_id", selectedSchool.marketId);
      sessionStorage.setItem("invite_graduation_year", graduationYear);
      sessionStorage.setItem("invite_role", role);
      if (instagram.trim()) sessionStorage.setItem("invite_instagram", instagram.trim());

      router.push(cta.href);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not complete onboarding. Please try again."));
    }
  };

  return (
    <section className="launch-step launch-step--personalize">
      <div className="launch-step-inner launch-step-inner--personalize">
        <div className="personalize-content">
          <p className="launch-eyebrow personalize-eyebrow">{eyebrow}</p>
          <h1 className="launch-title personalize-title font-canela onboarding-heading">{title}</h1>

          <form onSubmit={handleSubmit} className="launch-form">
            <div>
              <label className="launch-field-label" htmlFor="launch-school">
                School
              </label>
              <div className="launch-select-wrap launch-school-picker" ref={schoolPickerRef}>
                <input
                  id="launch-school"
                  type="text"
                  className="launch-field-input"
                  placeholder="Search your school"
                  value={schoolSearch}
                  autoComplete="off"
                  onChange={(e) => {
                    setSchoolSearch(e.target.value);
                    setSchoolId("");
                    setSchoolDropdownOpen(true);
                    setError(null);
                  }}
                  onFocus={() => setSchoolDropdownOpen(true)}
                />
                <ChevronDown size={16} strokeWidth={2} className="launch-select-chevron" aria-hidden="true" />

                {schoolDropdownOpen && (
                  <div className="launch-school-dropdown" role="listbox" aria-label="School search results">
                    {filteredSchools.length === 0 ? (
                      <p className="launch-school-dropdown-status">
                        {schoolSearch.trim() ? "No schools found." : "No schools available."}
                      </p>
                    ) : (
                      filteredSchools.map((s) => {
                        const location = formatSchoolLocation(s.city, s.state);
                        const selected = schoolId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={`launch-school-dropdown-item${selected ? " is-selected" : ""}`}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectSchool(s)}
                          >
                            <span className="launch-school-dropdown-item-name">{s.name}</span>
                            {location && <span className="launch-school-dropdown-item-meta">{location}</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="launch-field-label" htmlFor="launch-grad-year">
                Graduation year
              </label>
              <div className="launch-select-wrap">
                <select
                  id="launch-grad-year"
                  className="launch-field-input launch-field-select"
                  value={graduationYear}
                  onChange={(e) => {
                    setGraduationYear(e.target.value);
                    setError(null);
                  }}
                >
                  <option value="">Select graduation year</option>
                  {GRADUATION_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={2} className="launch-select-chevron" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label className="launch-field-label" htmlFor="launch-role">
                Your role
              </label>
              <div className="launch-select-wrap">
                <select id="launch-role" className="launch-field-input launch-field-select" value={role} disabled>
                  {AMBASSADOR_ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} strokeWidth={2} className="launch-select-chevron" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label className="launch-field-label" htmlFor="launch-instagram">
                Instagram (optional)
              </label>
              <input
                id="launch-instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="launch-field-input"
                autoComplete="off"
                placeholder="@yourhandle"
              />
            </div>

            <label className="launch-agreement">
              <span className={`launch-agreement-box ${agreed ? "is-checked" : ""}`}>
                {agreed && <Check size={13} strokeWidth={3} />}
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setError(null);
                  }}
                />
              </span>
              <span>{agreement}</span>
            </label>

            {error && <p className="font-lato text-[13px] font-semibold text-[#b0453a]">{error}</p>}

            <button type="submit" disabled={submitting} className="launch-cta cursor-pointer">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{cta.label}</span>}
              {!submitting && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
            </button>
          </form>
        </div>

        <div className="personalize-art">
          <Image
            src="/images/onboarding/dune-palms.png"
            alt=""
            width={1262}
            height={848}
            className="launch-illustration launch-illustration--bleed"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}