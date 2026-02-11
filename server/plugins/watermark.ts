export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (typeof response.body === 'string' && response.body.includes('<!DOCTYPE html>')) {
      const banner = `<!--
████████╗██╗ ██████╗ ███╗   ██╗██╗  ██╗██╗███╗   ██╗ ██████╗ 
╚══██╔══╝██║██╔═══██╗████╗  ██║╚██╗██╔╝██║████╗  ██║██╔════╝ 
   ██║   ██║████████║██╔██╗ ██║ ╚███╔╝ ██║██╔██╗ ██║██║  ███╗
   ██║   ██║██╔═══██║██║╚██╗██║ ██╔██╗ ██║██║╚██╗██║██║   ██║
   ██║   ██║██║   ██║██║ ╚████║██╔╝ ██╗██║██║ ╚████║╚██████╔╝
   ╚═╝   ╚═╝╚═╝   ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                      Code by tianxingleo
-->\n`;
      response.body = banner + response.body;
    }
  });
});
