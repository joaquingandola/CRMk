interface Props {
    message?: string
}

export function EmptyState({ message = 'no hay datos para mostrar'}: Props) {
    return (
        <div className="text-center py-16 text-gray-400 text-sm">
            {message}
        </div>
    )
}