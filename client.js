const fs = require('fs');

process.on ('SIGINT',() => {
    
    process.exit(1);
});

(function loop() {
    setTimeout(() => {
        // Your logic here
        
        loop();
    }, delay);
})();