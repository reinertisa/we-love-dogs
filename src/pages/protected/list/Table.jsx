import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import {useState} from "react";
import {filter} from "lodash";
import './Table.css';
import PropTypes from "prop-types";


const propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        zip_code: PropTypes.string.isRequired,
        breed: PropTypes.string.isRequired,
    })),
    setSelectedDogs: PropTypes.func,
    selectedDogs: PropTypes.arrayOf(PropTypes.string),
};
/**
 * Render the dog list table.
 *
 * @param {object} props - prop container
 * @param {Array} props.data
 * @param {Function} props.setSelectedDogs
 * @param {string} props.selectedDogs
 *
 * @return {JSX.Element}
 */
export default function TablePage({data, setSelectedDogs, selectedDogs}) {
    const [sorting, setSorting] = useState([
        {id: 'name', asc: true},
        {id: 'breed', asc: true},
        {id: 'age', asc: true},
        {id: 'zip_code', asc: true},
    ]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, // 👈 Show 10 rows per page
    });

    const updateCheckbox = (checked, value) => {
        if (checked) {
            setSelectedDogs([...selectedDogs, value]);
        } else {
            setSelectedDogs(filter(selectedDogs, (id) => id !== value))
        }
    };

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Breed',
            accessorKey: 'breed',
        },
        {
            header: 'Age',
            accessorKey: 'age',
        },
        {
            header: 'Zip code',
            accessorKey: 'zip_code',
        },
        {
            header: 'Image',
            accessorKey: 'img',
            cell: ({getValue}) => <img src={getValue()} height={50} width={50} alt="dog image" />,
            enableSorting: false
        },
        {
            header: 'Your favorite?',
            accessorKey: 'id',
            cell: ({getValue}) => {
                return (
                    <input
                        type="checkbox"
                        checked={selectedDogs.includes(getValue())}
                        onChange={e => updateCheckbox(e.target.checked, getValue())}
                    />
                )
            },
            enableSorting: false
        },
    ];


    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    return (
        <div className="tablePage">
            <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            const isSortable = header.column.getCanSort();
                            return (
                                <th
                                    key={header.id}
                                    style={{ cursor: isSortable ? 'pointer' : 'default' }}
                                    onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === 'asc' && ' 🔼'}
                                    {header.column.getIsSorted() === 'desc' && ' 🔽'}
                                </th>
                            );
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ marginTop: 10 }}>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    ⬅️ Prev
                </button>
                <span style={{ margin: '0 10px' }}>
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </span>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next ➡️
                </button>
            </div>
        </div>
    );
}
TablePage.propTypes = propTypes;
