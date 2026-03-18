import { useState, useMemo } from "react";

export function useTableControls(data, searchKeys) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const statuses = useMemo(() => {
    const s = [...new Set(data.map((d) => d.status).filter(Boolean))];
    return ["All", ...s];
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      result = result.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((row) => row.status === statusFilter);
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return result;
  }, [data, search, statusFilter, sortKey, sortDir, searchKeys]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleFilter = (v) => { setStatusFilter(v); setPage(1); };

  return { search, handleSearch, statusFilter, handleFilter, statuses, toggleSort, sortKey, sortDir, paginated, filtered, page, setPage, totalPages };
}

export function useKPITrend(current, previous) {
  if (!previous || previous === 0) return { pct: null, dir: null };
  const pct = (((current - previous) / previous) * 100).toFixed(1);
  return { pct: Math.abs(pct), dir: pct >= 0 ? "up" : "down" };
}
