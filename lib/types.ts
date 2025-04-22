export interface Todo {
    id?: string;
    value: number;
    txHash?: string;
  }
  
  export interface CreateTodoPayload {
    value: number;
    txHash: string;
  }
  
  export interface UpdateTodoPayload {
    value?: number;
    txHash?: string;
  }
  
  export interface ApiResponse {
    id?: string;
    status?: string;
    error?: string;
    value?: number;
    txHash?: string;
  }
  