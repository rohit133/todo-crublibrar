import { useState } from "react";
import { Todo } from "@/lib/types";
import { todoService } from "@/lib/todo-service";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (txHash: string) => void;
  onError: (message: string) => void;
}

export const TodoItem = ({
  todo,
  onUpdate,
  onDelete,
  onError,
}: TodoItemProps) => {
  if (!todo) {
    return <div className="text-red-500">Todo item is missing</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.txHash || "");
  const [value, setValue] = useState(todo.value);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!todo) {
      onError("Todo item is missing");
      return;
    }
    if (text.trim() === "" || value <= 0) {
      onError("Task text cannot be empty and value must be positive");
      return;
    }
    setIsLoading(true);
    if (!todo.txHash) {
      onError("Todo item is missing txHash");
      return;
    }
    const result = await todoService.update(todo.txHash, { value });
    setIsLoading(false);

    if (result.error) {
      onError(result.error);
      return;
    }

    setIsEditing(false);
    onUpdate({ ...todo, value });
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await todoService.delete(text);
    setIsLoading(false);

    if (result.error) {
      onError(result.error);
      return;
    }

    onDelete(text);
  };

  return (
    <div className="shadow-md rounded-lg p-4 mb-3 border">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">TxHash</label>
            <p className="w-full p-2 border rounded-md bg-gray-700 cursor-not-allowed">{todo.txHash}</p>
          </div>
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Value" min="0.1"step="0.1"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 rounded-md" disabled={isLoading}>
              Cancel
            </button>
            <button onClick={handleUpdate} className="px-3 py-1 rounded-md flex items-center" disabled={isLoading}>
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <p className="text-sm font-semibold text-gray-500">TxHash: {todo.txHash}</p>
            <p className="text-base font-semibold text-gray-400">Value: {todo.value}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-blue transition-colors"disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button onClick={handleDelete} className="p-1 text-red-500 hover:text-destructive transition-colors" disabled={isLoading}>
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25"cx="12"cy="12"r="10"stroke="currentColor"strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
