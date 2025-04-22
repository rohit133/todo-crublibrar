
import { useState } from 'react';
import { todoService } from '@/lib/todo-service';
import { Todo } from '@/lib/types';

interface AddTodoFormProps {
  onAdd: (todo: Todo) => void;
  onError: (message: string) => void;
}

export const AddTodoForm = ({ onAdd, onError }: AddTodoFormProps) => {
  const [text, setText] = useState('');
  const [value, setValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') {
      onError('Task text cannot be empty');
      return;
    }

    if (value <= 0) {
      onError('Value must be positive');
      return;
    }

    setIsLoading(true);
    const result = await todoService.create({ txHash: text, value });
    setIsLoading(false);

    if (result.error) {
      onError(result.error);
      return;
    }

    // Add created todo to the list
    if (result.id) {
      const newTodo: Todo = {
        id: result.id,
        txHash: text,
        value
      };
      onAdd(newTodo);
    }

    // Reset form
    setText('');
    setValue(1);
  };

  return (
    <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-4 mb-6">
      <div className="mb-3">
        <label htmlFor="text" className="block text-sm font-medium mb-1">
          TxHash
        </label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter TxHash"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="value" className="block text-sm font-medium mb-1">
          Value
        </label>
        <input
          type="text"
          id="value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter value"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors font-semibold flex justify-center items-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : ''}
        Add Task
      </button>
      <p className="text-xs text-gray-400 mt-2">Note: Creating a todo will use 1 API credit</p>
    </form>
  );
};