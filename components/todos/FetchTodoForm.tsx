
import { useState } from 'react';
import { todoService } from '@/lib/todo-service';
import { Todo } from '@/lib/types';

interface FetchTodoFormProps {
    onFetch: (todo: Todo) => void;
    onError: (message: string) => void;
}

export const FetchTodoForm = ({ onFetch, onError }: FetchTodoFormProps) => {
    const [txhash, setTxhash] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (txhash.trim() === '') {
            onError('Todo Txhash cannot be empty');
            return;
        }

        setIsLoading(true);

        try {
            const result = await todoService.get(txhash);
            setIsLoading(false);

            if ('error' in result) {
                onError(result.error || 'Failed to fetch todo');
                return;
            }

            onFetch(result as Todo);
            setTxhash(''); // Reset the form
        } catch (error) {
            setIsLoading(false);
            onError('Failed to fetch todo. Please check the ID and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-lg mb-4">
            <div className="mb-3">
                <label htmlFor="todoId" className="block text-sm font-medium mb-3">
                    Fetch Todo by TxHash
                </label>
                <div className="flex">
                    <input
                        type="text"
                        id="todoId"
                        value={txhash}
                        onChange={(e) => setTxhash(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter TxHash"
                    />
                    <button
                        type="submit"
                        className="py-2 px-4 border border-dashed rounded-r-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : ''}
                        Fetch
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Note: Fetching a todo will use 1 API credit</p>
            </div>
        </form>
    );
};