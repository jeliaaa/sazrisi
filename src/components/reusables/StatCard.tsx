export const StatCard = ({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border-l-4" style={{ borderColor: color }}>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};