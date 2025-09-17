const Table = ({ columns, data }) => {
  let tableData = [];
  
  if (Array.isArray(data)) {
    tableData = data;
  } else if (data && data.data && Array.isArray(data.data)) {
    tableData = data.data;
  } else {
    tableData = [];
  }
  
  
  return (
    <div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="py-2 px-4 border-b border-gray-200 text-center text-sm font-semibold text-gray-700"
              >
                {typeof col === 'object' ? col.title : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr key={row.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {columns.map((col, colIndex) => {
                  const dataKey = typeof col === 'object' ? col.dataIndex : col;
                  const cellValue = row[dataKey];

                  return (
                    <td 
                      key={colIndex} 
                      className="py-2 px-4 border-b border-gray-200 text-sm text-gray-600"
                    >
                      {typeof col === 'object' && col.render 
                        ? col.render(cellValue, row) 
                        : (cellValue !== undefined && cellValue !== null ? String(cellValue) : '')
                      }
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="py-8 px-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;