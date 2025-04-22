import { CreateTodoPayload, Todo, UpdateTodoPayload, ApiResponse } from "./types";

let crudLibrary: any;

// This will be initialized on the client side only
export const initCrudLibrary = async () => {
  if (typeof window !== "undefined") {
    try {
      const { createCrudLibrary } = await import("rohit-formpilot-crud");
      
      // In a real application, these would come from environment variables
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiKey || !apiUrl) {
        console.error("API Key or URL not found");
        throw new Error("API Key or URL not found");
      }
      
      crudLibrary = createCrudLibrary(apiKey, apiUrl);
    } catch (error) {
      console.error("Failed to initialize CRUD library:", error);
    }
  }
};

export const todoService = {
  initCrudLibrary,
  create: async (todo: CreateTodoPayload): Promise<ApiResponse> => {
    try {
      if (!crudLibrary) await initCrudLibrary();
      return await crudLibrary.create(todo);
    } catch (error: any) {
      console.error("Create todo error:", error);
      return { error: error.message || "Failed to create todo" };
    }
  },
  
  get: async (txHash: string): Promise<Todo | ApiResponse> => {
    try {
      if (!crudLibrary) await initCrudLibrary();
      return await crudLibrary.get(txHash);
    } catch (error: any) {
      console.error("Get todo error:", error);
      return { error: error.message || "Failed to get todo" };
    }
  },
  
  update: async (txHash: string, todo: UpdateTodoPayload): Promise<ApiResponse> => {
    try {
      console.log("Updating todo with txHash:", txHash);
      console.log("Todo data:", todo);
      if (!crudLibrary) await initCrudLibrary();
      return await crudLibrary.update(txHash, todo);
    } catch (error: any) {
      console.error("Update todo error:", error);
      return { error: error.message || "Failed to update todo" };
    }
  },
  
  delete: async (txHash: string): Promise<ApiResponse> => {
    try {
      if (!crudLibrary) await initCrudLibrary();
      return await crudLibrary.delete(txHash);
    } catch (error: any) {
      console.error("Delete todo error:", error);
      return { error: error.message || "Failed to delete todo" };
    }
  }
};
