import { useState, useEffect } from 'react';
import { Todo } from '@/lib/types';
import { todoService } from '@/lib/todo-service';
import { TodoItem } from './TodoItem';
import { AddTodoForm } from './AddTodoForm';
import { Notification } from '@/components/ui/Notification';
import { FetchTodoForm } from './FetchTodoForm';


export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  // Initialize the crud library
  useEffect(() => {
    const init = async () => {
      try {
        await todoService.initCrudLibrary();
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message || 'Failed to initialize');
        setIsLoading(false);
      }
    };

    init();
  }, []);


  const handleError = (message: string) => {
    showNotification(message, 'error');
  };

  const handleAdd = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo]);
    showNotification('Todo added successfully!', 'success');
  };

  const handleUpdate = (updatedTodo: Todo) => {
    if (!updatedTodo || !updatedTodo.txHash) return;
    setTodos(prev =>
      prev.map(todo =>
        todo && todo.txHash === updatedTodo.txHash ? updatedTodo : todo
      )
    );
    showNotification('Todo updated successfully!', 'success');
  };

  const handleDelete = (txHash: string) => {
    setTodos(prev => prev.filter(todo => todo.txHash !== txHash));
    showNotification('Todo deleted successfully!', 'success');
  };

  const handleFetch = (fetchedTodo: Todo) => {
    if (!todos.some(todo => todo.txHash === fetchedTodo.txHash)) {
      setTodos(prev => [...prev, fetchedTodo]);
    } else {
      setTodos(prev => prev.map(todo => todo.txHash === fetchedTodo.txHash ? fetchedTodo : todo));
    }
    showNotification('Todo fetched successfully!', 'success');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className=" border border-dashed shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Todo App</h1>
        
        <p className="text-sm text-gray-500 mb-6">
          Powered by Crublibrary • API Credits: Limited to 4 requests
        </p>

        <AddTodoForm 
          onAdd={handleAdd} 
          onError={handleError}
        />

        <div className="mt-6 mb-6 border-t border-gray-200 pt-6">
          <FetchTodoForm
            onFetch={handleFetch}
            onError={handleError}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div>
            {todos.length === 0 && !isLoading ? (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">No todos in this session</p>
                <p className="text-sm text-gray-400 mt-1">Create a new todo or fetch one by ID</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <h2 className="font-medium">Session Todos:</h2>
                {todos.map((todo, idx) => (
                  <TodoItem
                    key={todo.txHash}
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onError={handleError}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Note: Todos are stored in session memory only. Each API operation costs 1 credit.
          </p>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};
