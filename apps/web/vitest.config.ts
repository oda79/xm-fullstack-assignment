import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {  
    silent: true,  
    globals: true,             
    environment: "jsdom",      
    setupFiles: ["./src/test/setupTests.ts"], 
    css: true,                   
    coverage: {
      provider: "v8",
      reporter: ["text", "html"], 
            exclude: [
        "src/test/*",
        "src/App.tsx",
        "src/main.ts",        
      ],
    },
  },
});