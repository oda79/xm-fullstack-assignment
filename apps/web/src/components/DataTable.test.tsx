import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import DataTable, { Column } from "./DataTable";

type Row = { name: string; value: number };

const columns: Column<Row>[] = [
  {
    header: "Name",
    accessor: (r) => r.name,
    sortKey: (r) => r.name,
  },
  {
    header: "Value",
    accessor: (r) => r.value,
    sortKey: (r) => r.value,
  },
  {
    header: "Static",
    accessor: () => "x", // unsortable column
  },
];

const sampleData: Row[] = [
  { name: "B", value: 2 },
  { name: "A", value: 1 },
];

describe("DataTable", () => {
  test("renders headers and data", () => {
    render(<DataTable data={sampleData} columns={columns} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 rows
  });

  test("renders 'No data' when list empty", () => {
    render(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  test("sorts ascending and descending when clicking sortable header", async () => {
    render(<DataTable data={sampleData} columns={columns} />);

    const nameHeader = screen.getByText("Name");
    const getFirstRowText = () => screen.getAllByRole("row")[1].textContent;

    // Initial: unsorted
    expect(getFirstRowText()).toContain("B");

    // Click 1: ascending (A first)
    await userEvent.click(nameHeader);
    expect(getFirstRowText()).toContain("A");
    expect(screen.getByText("▲")).toBeInTheDocument();

    // Click 2: descending (B first)
    await userEvent.click(nameHeader);
    expect(getFirstRowText()).toContain("B");
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  test("clicking unsortable column does nothing", async () => {
    render(<DataTable data={sampleData} columns={columns} />);
    const staticHeader = screen.getByText("Static");
    await userEvent.click(staticHeader);
    // No sort arrows should appear
    expect(screen.queryByText("▲")).not.toBeInTheDocument();
    expect(screen.queryByText("▼")).not.toBeInTheDocument();
  });

  test("respects initialSort ascending", () => {
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        initialSort={{ index: 1, dir: "asc" }}
      />
    );
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("A");
    expect(screen.getByText("▲")).toBeInTheDocument();
  });

  test("respects initialSort descending", () => {
    render(
      <DataTable
        data={sampleData}
        columns={columns}
        initialSort={{ index: 1, dir: "desc" }}
      />
    );
    const firstRow = screen.getAllByRole("row")[1];
    expect(firstRow).toHaveTextContent("B");
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  test("keeps order when sortKey values are equal", async () => {
  const equalData = [
    { name: "A", value: 1 },
    { name: "B", value: 1 }, // same sortKey
  ];
  render(<DataTable data={equalData} columns={columns} />);

  const valueHeader = screen.getByText("Value");
  await userEvent.click(valueHeader); // trigger sort (asc)

  const rows = screen.getAllByRole("row");
  // Expect the relative order to remain same, since values are equal
  expect(rows[1].textContent).toContain("A");
  expect(rows[2].textContent).toContain("B");
});

});
