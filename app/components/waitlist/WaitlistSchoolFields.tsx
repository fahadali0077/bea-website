"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import {
  fetchAllSchools,
  fetchAllSchoolsBySearch,
} from "@/lib/api/fetch-all-schools-search";
import { useLazyListSchoolsQuery } from "@/features/api/apiSlice";
import type { School } from "@/lib/api/schools.types";
import { formatMarketLocation } from "@/lib/waitlist-market";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistFieldError } from "./WaitlistFieldError";

const LIST_LIMIT = 10;
const DROPDOWN_PAGE_SIZE = 10;

type Props = {
  variant: "mobile" | "desktop";
  error?: string | null;
};

function formatSchoolLocation(school: School) {
  return formatMarketLocation(school.city, school.state);
}

export function WaitlistSchoolFields({ variant, error }: Props) {
  const dispatch = useAppDispatch();
  const form = useAppSelector(selectWaitlistForm);
  const isDesktop = variant === "desktop";
  const [triggerListSchools] = useLazyListSchoolsQuery();

  const [listSchools, setListSchools] = useState<School[]>([]);
  const [dropdownSchools, setDropdownSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownPage, setDropdownPage] = useState(1);
  const [listLoading, setListLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [dropdownError, setDropdownError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchWrapRef = useRef<HTMLDivElement>(null);
  const dropdownLoadedRef = useRef(false);
  const listLoadedRef = useRef(false);
  const prevMarketIdRef = useRef(form.marketId);

  useEffect(() => {
    if (form.schoolName && !form.notInSchool) {
      setSearch(form.schoolName);
    } else if (form.notInSchool) {
      setSearch("");
    }
  }, [form.notInSchool, form.schoolName]);

  useEffect(() => {
    if (prevMarketIdRef.current === form.marketId) {
      return;
    }

    prevMarketIdRef.current = form.marketId;
    listLoadedRef.current = false;
    dropdownLoadedRef.current = false;
    setListSchools([]);
    setDropdownSchools([]);
    setSearch("");
    setDropdownPage(1);
    setDropdownOpen(false);
    dispatch(
      updateWaitlistForm({
        schoolId: null,
        schoolName: null,
        notInSchool: false,
      }),
    );
  }, [dispatch, form.marketId]);

  useEffect(() => {
    if (!form.marketId || listLoadedRef.current) {
      return;
    }

    let cancelled = false;

    async function loadListSchools() {
      setListLoading(true);
      setListError(null);

      try {
        const data = await triggerListSchools({
          marketId: form.marketId!,
          page: 1,
          limit: LIST_LIMIT,
        }).unwrap();

        if (cancelled) {
          return;
        }

        listLoadedRef.current = true;
        setListSchools(data.items);
      } catch {
        if (!cancelled) {
          setListError("Unable to load schools. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    }

    void loadListSchools();

    return () => {
      cancelled = true;
    };
  }, [form.marketId, triggerListSchools]);

  const loadDropdownSchools = useCallback(async () => {
    if (dropdownLoadedRef.current || !form.marketId) {
      return;
    }

    setDropdownLoading(true);
    setDropdownError(null);

    try {
      const schools = await fetchAllSchools(form.marketId);
      dropdownLoadedRef.current = true;
      setDropdownSchools(schools);
    } catch {
      setDropdownError("Unable to load schools. Please try again.");
    } finally {
      setDropdownLoading(false);
    }
  }, [form.marketId]);

  useEffect(() => {
    const term = search.trim();

    if (!term) {
      setDropdownPage(1);
      return;
    }

    const timeout = window.setTimeout(() => {
      void (async () => {
        setDropdownLoading(true);
        setDropdownError(null);
        setDropdownPage(1);

        try {
          const schools = await fetchAllSchoolsBySearch(term, form.marketId ?? undefined);
          setDropdownSchools(schools);
        } catch {
          setDropdownSchools([]);
          setDropdownError("Search failed. Please try again.");
        } finally {
          setDropdownLoading(false);
        }
      })();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [form.marketId, search]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!searchWrapRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const activeDropdownList = useMemo(() => {
    return search.trim() ? dropdownSchools : dropdownSchools;
  }, [dropdownSchools, search]);

  const dropdownTotalPages = Math.max(
    1,
    Math.ceil(activeDropdownList.length / DROPDOWN_PAGE_SIZE),
  );

  const paginatedDropdownResults = useMemo(() => {
    const start = (dropdownPage - 1) * DROPDOWN_PAGE_SIZE;
    return activeDropdownList.slice(start, start + DROPDOWN_PAGE_SIZE);
  }, [activeDropdownList, dropdownPage]);

  const selectSchool = useCallback(
    (school: School) => {
      dispatch(
        updateWaitlistForm({
          schoolId: school.id,
          schoolName: school.name,
          notInSchool: false,
        }),
      );
      setSearch(school.name);
      setDropdownPage(1);
      setDropdownOpen(false);
    },
    [dispatch],
  );

  const selectNotInSchool = () => {
    dispatch(
      updateWaitlistForm({
        schoolId: null,
        schoolName: null,
        notInSchool: true,
      }),
    );
    setSearch("");
    setDropdownOpen(false);
  };

  const handleSearchFocus = () => {
    setDropdownOpen(true);
    void loadDropdownSchools();
  };

  const renderSchoolCard = (school: School, classPrefix: string) => {
    const selected = !form.notInSchool && form.schoolId === school.id;
    const location = formatSchoolLocation(school);

    if (isDesktop) {
      return (
        <button
          key={school.id}
          type="button"
          className={`${classPrefix}-school-card ${selected ? `${classPrefix}-school-card--selected` : ""}`}
          onClick={() => selectSchool(school)}
        >
          <div className={`${classPrefix}-school-card-info`}>
            <div className={`${classPrefix}-school-card-name`}>{school.name}</div>
            {location ? (
              <div className={`${classPrefix}-school-card-city`}>{location}</div>
            ) : null}
          </div>
          <span className={`${classPrefix}-school-card-dot`} aria-hidden />
        </button>
      );
    }

    return (
      <button
        key={school.id}
        type="button"
        className={
          "waitlist-school-card" + (selected ? " waitlist-school-card--selected" : "")
        }
        onClick={() => selectSchool(school)}
      >
        <div>
          <div className="waitlist-school-card-name">{school.name}</div>
          {location ? <div className="waitlist-school-card-city">{location}</div> : null}
        </div>
        <span className="waitlist-school-card-dot" aria-hidden />
      </button>
    );
  };

  if (!form.marketId) {
    return (
      <p className="waitlist-field-error">
        Select a market first on the previous step.
      </p>
    );
  }

  return (
    <>
      <div
        ref={searchWrapRef}
        className={
          isDesktop
            ? "wld-step5-search-wrapper waitlist-market-search"
            : "waitlist-search-block waitlist-search-block--tight waitlist-market-search"
        }
      >
        <label
          className={
            isDesktop ? "wld-step5-search-label" : "waitlist-field-label"
          }
          htmlFor="school-search"
        >
          Search your school
        </label>
        <input
          id="school-search"
          type="search"
          className={isDesktop ? "wld-step5-search-input" : "waitlist-box-input"}
          placeholder="Search universities"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setDropdownOpen(true);
            setDropdownPage(1);
            if (form.notInSchool) {
              dispatch(updateWaitlistForm({ notInSchool: false }));
            }
          }}
          onFocus={handleSearchFocus}
          onClick={handleSearchFocus}
          autoComplete="off"
        />

        {dropdownOpen ? (
          <div
            className={
              isDesktop
                ? "waitlist-market-dropdown waitlist-market-dropdown--desktop"
                : "waitlist-market-dropdown"
            }
            role="listbox"
            aria-label="School search results"
          >
            {dropdownLoading ? (
              <p className="waitlist-market-dropdown-status">Loading schools…</p>
            ) : dropdownError ? (
              <p className="waitlist-market-dropdown-status waitlist-market-error">
                {dropdownError}
              </p>
            ) : paginatedDropdownResults.length === 0 ? (
              <p className="waitlist-market-dropdown-status">
                {search.trim() ? "No schools found." : "No schools available."}
              </p>
            ) : (
              <>
                {paginatedDropdownResults.map((school) => {
                  const selected = !form.notInSchool && form.schoolId === school.id;
                  const location = formatSchoolLocation(school);

                  return (
                    <button
                      key={school.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={
                        "waitlist-market-dropdown-item" +
                        (selected ? " waitlist-market-dropdown-item--selected" : "")
                      }
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectSchool(school)}
                    >
                      <span className="waitlist-market-dropdown-item-name">
                        {school.name}
                      </span>
                      {location ? (
                        <span className="waitlist-market-dropdown-item-meta">
                          {location}
                        </span>
                      ) : null}
                    </button>
                  );
                })}

                {activeDropdownList.length > DROPDOWN_PAGE_SIZE ? (
                  <div className="waitlist-market-dropdown-pagination">
                    <button
                      type="button"
                      className="waitlist-market-dropdown-page-btn"
                      disabled={dropdownPage <= 1}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setDropdownPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>
                    <span className="waitlist-market-dropdown-page-label">
                      Page {dropdownPage} of {dropdownTotalPages}
                    </span>
                    <button
                      type="button"
                      className="waitlist-market-dropdown-page-btn"
                      disabled={dropdownPage >= dropdownTotalPages}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        setDropdownPage((page) =>
                          Math.min(dropdownTotalPages, page + 1),
                        )
                      }
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      {listLoading ? (
        <p className="waitlist-market-loading">Loading schools…</p>
      ) : listError ? (
        <p className="waitlist-market-error">{listError}</p>
      ) : (
        <div className={isDesktop ? "wld-step5-school-list" : "waitlist-school-list"}>
          {listSchools.map((school) =>
            renderSchoolCard(school, isDesktop ? "wld-step5" : "waitlist"),
          )}
        </div>
      )}

      <div className={isDesktop ? "wld-step5-or-divider" : "waitlist-or-divider"}>
        {isDesktop ? "OR" : "or"}
      </div>

      <button
        type="button"
        className={
          isDesktop
            ? `wld-step5-not-school-btn ${form.notInSchool ? "wld-step5-not-school-btn--selected" : ""}`
            : `waitlist-btn-secondary ${form.notInSchool ? "waitlist-btn-secondary--selected" : ""}`
        }
        onClick={selectNotInSchool}
      >
        I&apos;m not currently in school
      </button>

      <WaitlistFieldError message={error} />
    </>
  );
}