import React, {useState, useMemo} from "react";
import cn from "../utils/cn";

export type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortKey?: (row: T) => string | number; 
  className?: string;
};

export default function DataTable<T>({
  data,
  columns,
  initialSort,
}: {
  data: T[];
  columns: Column<T>[];
  initialSort?: { index: number; dir: "asc" | "desc" };
}) {
  const [sort, setSort] = useState(initialSort);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const col = columns[sort.index];
    if (!col?.sortKey) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = col.sortKey!(a);
      const vb = col.sortKey!(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, columns, sort]);

  const onHeaderClick = (i: number) => {
    const col = columns[i];
    if (!col.sortKey) return;
    setSort((prev) =>
      !prev || prev.index !== i
        ? { index: i, dir: "asc" }
        : { index: i, dir: prev.dir === "asc" ? "desc" : "asc" }
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-700">
          <tr className="divide-x divide-gray-200">
            {columns.map((c, i) => (
              <th
                key={i}
                className={cn("px-4 py-3 font-medium", c.className)}
                onClick={() => onHeaderClick(i)}
              >
                <div className={cn("flex items-center gap-1", c.sortKey && "cursor-pointer select-none")}>
                  {c.header}
                  {sort?.index === i && (
                    <span aria-hidden className="text-gray-400">{sort.dir === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((row, ri) => (
            <tr key={ri} className="divide-x divide-gray-100 hover:bg-gray-50 transition">
              {columns.map((c, ci) => (
                <td key={ci} className={cn("px-4 py-3 text-gray-800", c.className)}>
                  {c.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500" colSpan={columns.length}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
