export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const asciiArt = `
████████╗██╗ ██████╗ ███╗   ██╗██╗  ██╗██╗███╗   ██╗ ██████╗ 
╚══██╔══╝██║██╔═══██╗████╗  ██║╚██╗██╔╝██║████╗  ██║██╔════╝ 
   ██║   ██║████████║██╔██╗ ██║ ╚███╔╝ ██║██╔██╗ ██║██║  ███╗
   ██║   ██║██╔═══██║██║╚██╗██║ ██╔██╗ ██║██║╚██╗██║██║   ██║
   ██║   ██║██║   ██║██║ ╚████║██╔╝ ██╗██║██║ ╚████║╚██████╔╝
   ╚═╝   ╚═╝╚═╝   ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
             Code by tianxingleo
`;
    console.log(
      "%c GitHub %c tianxingleo ",
      "background: #333; color: #fff; border-radius: 3px 0 0 3px; padding: 2px 5px;",
      "background: #007bff; color: #fff; border-radius: 0 3px 3px 0; padding: 2px 5px; font-weight: bold;"
    );
    console.log("Check out my code at: https://github.com/tianxingleo");
    console.log(`%c${asciiArt}`, "color: #26bfa5; font-family: monospace;");
  }
});
