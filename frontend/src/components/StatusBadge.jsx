export const StatusBadge = ({ status }) => {
    const styles = {
        draft: 'bg-gray-100 text-gray-700',
        sent: 'bg-blue-100 text-blue-700',
        proposals_received: 'bg-green-100 text-green-700',
        completed: 'bg-purple-100 text-purple-700'
    };

    const labels = {
        draft: 'Draft',
        sent: 'Sent',
        proposals_received: 'Proposals Received',
        completed: 'Completed'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};