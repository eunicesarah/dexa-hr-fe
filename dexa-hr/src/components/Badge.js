const Badge = ({ status }) => {
    const lower = status.toLowerCase();
    const getStatusStyles = () => {
        switch (lower) {
            case 'on time':
            case 'registered':
                return 'bg-green-100 text-green-800';
            case 'late':
                return 'bg-yellow text-white';
            case 'absent':
            case 'account not registered':
                return 'bg-red text-white';
            default:
                return 'bg-gray text-gray-800';
        }
    };

    return (
        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

export default Badge;