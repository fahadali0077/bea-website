"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import {
  fetchAllActiveMarkets,
  fetchAllMarketsBySearch,
} from "@/lib/api/fetch-all-markets-search";
import { useLazyListAllMarketsQuery } from "@/features/api/apiSlice";
import {
  formatMarketLocation,
  marketToCityOption,
  type WaitlistCityOption,
} from "@/lib/waitlist-market";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistCityCarousel } from "./WaitlistCityCarousel";

const CAROUSEL_LIMIT = 4;
const DROPDOWN_PAGE_SIZE = 10;

type Props = {
  variant: "mobile" | "desktop";
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
};

export type WaitlistMarketFieldsHandle = {
  focusSearchInvalid: () => void;
};

export const WaitlistMarketFields = forwardRef<WaitlistMarketFieldsHandle, Props>(
  function WaitlistMarketFields({ variant, selectedId, onSelectId }, ref) {
    const dispatch = useAppDispatch();
    const form = useAppSelector(selectWaitlistForm);
    const isDesktop = variant === "desktop";
    const [triggerListAllMarkets] = useLazyListAllMarketsQuery();

    const [carouselMarkets, setCarouselMarkets] = useState<WaitlistCityOption[]>([]);
    const [dropdownMarkets, setDropdownMarkets] = useState<WaitlistCityOption[]>([]);
    const [searchResults, setSearchResults] = useState<WaitlistCityOption[]>([]);
    const [search, setSearch] = useState("");
    const [dropdownPage, setDropdownPage] = useState(1);
    const [carouselLoading, setCarouselLoading] = useState(true);
    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [carouselError, setCarouselError] = useState<string | null>(null);
    const [dropdownError, setDropdownError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchInvalid, setSearchInvalid] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchWrapRef = useRef<HTMLDivElement>(null);
    const dropdownLoadedRef = useRef(false);
    const carouselLoadedRef = useRef(false);

    useEffect(() => {
      if (form.marketId && form.marketId !== selectedId) {
        onSelectId(form.marketId);
      }
    }, [form.marketId, onSelectId, selectedId]);

    useEffect(() => {
      if (carouselLoadedRef.current) {
        return;
      }

      let cancelled = false;

      async function loadCarouselMarkets() {
        setCarouselLoading(true);
        setCarouselError(null);

        try {
          const data = await triggerListAllMarkets().unwrap();
          if (cancelled) {
            return;
          }

          carouselLoadedRef.current = true;
          setCarouselMarkets(data.slice(0, CAROUSEL_LIMIT).map(marketToCityOption));
        } catch {
          if (!cancelled) {
            setCarouselError("Unable to load markets. Please try again.");
          }
        } finally {
          if (!cancelled) {
            setCarouselLoading(false);
          }
        }
      }

      void loadCarouselMarkets();

      return () => {
        cancelled = true;
      };
    }, [triggerListAllMarkets]);

    const loadDropdownMarkets = useCallback(async () => {
      if (dropdownLoadedRef.current) {
        return;
      }

      setDropdownLoading(true);
      setDropdownError(null);

      try {
        const markets = await fetchAllActiveMarkets();
        dropdownLoadedRef.current = true;
        setDropdownMarkets(markets.map(marketToCityOption));
      } catch {
        setDropdownError("Unable to load markets. Please try again.");
      } finally {
        setDropdownLoading(false);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        focusSearchInvalid() {
          setSearchInvalid(true);
          setDropdownOpen(true);
          void loadDropdownMarkets();

          window.requestAnimationFrame(() => {
            searchInputRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            searchInputRef.current?.focus({ preventScroll: true });
          });
        },
      }),
      [loadDropdownMarkets],
    );

    useEffect(() => {
      const term = search.trim();

      if (!term) {
        setSearchResults([]);
        setDropdownPage(1);
        return;
      }

      const timeout = window.setTimeout(() => {
        void (async () => {
          setDropdownLoading(true);
          setDropdownError(null);
          setDropdownPage(1);

          try {
            const markets = await fetchAllMarketsBySearch(term);
            setSearchResults(markets.map(marketToCityOption));
          } catch {
            setSearchResults([]);
            setDropdownError("Search failed. Please try again.");
          } finally {
            setDropdownLoading(false);
          }
        })();
      }, 300);

      return () => window.clearTimeout(timeout);
    }, [search]);

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
      return search.trim() ? searchResults : dropdownMarkets;
    }, [dropdownMarkets, search, searchResults]);

    const dropdownTotalPages = Math.max(
      1,
      Math.ceil(activeDropdownList.length / DROPDOWN_PAGE_SIZE),
    );

    const paginatedDropdownResults = useMemo(() => {
      const start = (dropdownPage - 1) * DROPDOWN_PAGE_SIZE;
      return activeDropdownList.slice(start, start + DROPDOWN_PAGE_SIZE);
    }, [activeDropdownList, dropdownPage]);

    const selectMarket = useCallback(
      (market: WaitlistCityOption) => {
        setSearchInvalid(false);
        onSelectId(market.id);
        dispatch(
          updateWaitlistForm({
            marketId: market.id,
            marketName: market.name,
            ...(form.marketId && form.marketId !== market.id
              ? { schoolId: null, schoolName: null, notInSchool: false }
              : {}),
          }),
        );
        setSearch(market.name);
        setSearchResults([]);
        setDropdownPage(1);
        setDropdownOpen(false);
      },
      [dispatch, form.marketId, onSelectId],
    );

    const handleSearchFocus = () => {
      setDropdownOpen(true);
      void loadDropdownMarkets();
    };

    const searchInputId = isDesktop ? "city-search-desktop" : "city-search-mobile";
    const searchInputClassName = isDesktop
      ? "wld-step3-search-input"
      : "waitlist-box-input";

    const showDropdown = dropdownOpen;

    return (
      <>
        <div className={isDesktop ? "wld-step3-cities-wrapper" : undefined}>
          {carouselLoading ? (
            <div
              className={
                "waitlist-city-carousel" + (isDesktop ? " wld-step3-carousel" : "")
              }
              aria-hidden
            >
              {Array.from({ length: CAROUSEL_LIMIT }, (_, index) => (
                <div key={index} className="waitlist-city-card-skeleton" />
              ))}
            </div>
          ) : carouselError ? (
            <p className="waitlist-market-error">{carouselError}</p>
          ) : (
            <WaitlistCityCarousel
              className={isDesktop ? "wld-step3-carousel" : undefined}
              cities={carouselMarkets}
              selectedId={selectedId}
              onSelect={(city) => selectMarket(city)}
            />
          )}
        </div>

        <div
          ref={searchWrapRef}
          className={
            (isDesktop
              ? "wld-step3-search-wrapper waitlist-market-search"
              : "waitlist-search-block waitlist-market-search") +
            (searchInvalid ? " waitlist-market-search--invalid" : "")
          }
        >
          <label
            className={
              isDesktop
                ? "wld-step3-search-label"
                : "waitlist-field-label waitlist-field-label--caps"
            }
            htmlFor={searchInputId}
          >
            Search any city
          </label>
          <input
            ref={searchInputRef}
            id={searchInputId}
            type="search"
            className={
              searchInputClassName + (searchInvalid ? " waitlist-field--highlight" : "")
            }
            placeholder="Search"
            value={search}
            onChange={(event) => {
              setSearchInvalid(false);
              setSearch(event.target.value);
              setDropdownOpen(true);
              setDropdownPage(1);
            }}
            onFocus={handleSearchFocus}
            onClick={handleSearchFocus}
            autoComplete="off"
            aria-invalid={searchInvalid}
          />

          {showDropdown ? (
            <div
              className={
                isDesktop
                  ? "waitlist-market-dropdown waitlist-market-dropdown--desktop"
                  : "waitlist-market-dropdown"
              }
              role="listbox"
              aria-label="Market search results"
            >
              {dropdownLoading ? (
                <p className="waitlist-market-dropdown-status">Loading markets…</p>
              ) : dropdownError ? (
                <p className="waitlist-market-dropdown-status waitlist-market-error">
                  {dropdownError}
                </p>
              ) : paginatedDropdownResults.length === 0 ? (
                <p className="waitlist-market-dropdown-status">
                  {search.trim() ? "No markets found." : "No markets available."}
                </p>
              ) : (
                <>
                  {paginatedDropdownResults.map((market) => {
                    const selected = selectedId === market.id;
                    const location = formatMarketLocation(market.city, market.state);

                    return (
                      <button
                        key={market.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={
                          "waitlist-market-dropdown-item" +
                          (selected ? " waitlist-market-dropdown-item--selected" : "")
                        }
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectMarket(market)}
                      >
                        <span className="waitlist-market-dropdown-item-name">
                          {market.name}
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

          {searchInvalid ? (
            <p className="waitlist-market-search-hint" role="status">
              Select a city from the list to continue.
            </p>
          ) : null}
        </div>
      </>
    );
  },
);
