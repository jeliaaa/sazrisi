export const NavCard = ({
    title,
    href,
    color,
}: {
    title: string;
    href: string;
    color: string;
}) => {
    return (
        <a
            href={href}
            className="block bg-white hover:bg-gray-50 transition rounded-xl shadow p-5 border-x-4"
            style={{ borderColor: color }}
        >
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">დეტალების ნახვა</p>
        </a>
    );
};
