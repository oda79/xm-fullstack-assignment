import { app } from "./app.js";
import { config } from "./config.js";
import { preloadSymbols } from "./services/symbols.js";
preloadSymbols(); 

app.listen(config.port, () => {
  console.log(`Started API on ${config.publicUrl}`);
});
