import React, { useState } from 'react'

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    ColumnDef,
} from '@tanstack/react-table';
import Input from '../form/input/InputField';

type DataTableProps<T extends object> = {
    data: T[];
    columns: ColumnDef<T>[];
    loading?: boolean; // ✅ ajout du props loading
};

const DataTable = <T extends object>({ data, columns, loading = false }: DataTableProps<T>) => {
    
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="p-4">
            <div className="mb-4 md:w-1/3 w-full">
                <Input
                    type="text"
                    placeholder="🔍 Filtrer..."
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className="mb-4 px-2 py-1 border rounded w-full"
                />
            </div>

            {/* ✅ Si loading on affiche un état visuel */}
            {loading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                    Chargement des données...
                </div>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="px-4 py-2 border cursor-pointer font-normal bg-gray-100"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: ' ↑',
                                            desc: ' ↓',
                                        }[header.column.getIsSorted() as string] ?? ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2 border">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            {/* {!loading && (
                <div className="flex items-center justify-between mt-4 gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ← Précédent
                    </button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} sur{' '}
                        {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Suivant →
                    </button>
                </div>
            )} */}
        </div>
    )
}

export default DataTable;
