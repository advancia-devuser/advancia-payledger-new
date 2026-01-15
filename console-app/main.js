const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\n=== Console Application ===');
  console.log('1. Enter a message');
  console.log('2. Display current time');
  console.log('3. Exit');
  console.log('========================\n');
}

function handleUserInput() {
  displayMenu();
  
  rl.question('Select an option (1-3): ', (answer) => {
    switch(answer) {
      case '1':
        rl.question('Enter your message: ', (message) => {
          console.log(`You entered: ${message}`);
          handleUserInput();
        });
        break;
      case '2':
        console.log('Current time:', new Date().toLocaleTimeString());
        handleUserInput();
        break;
      case '3':
        console.log('Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        handleUserInput();
    }
  });
}

console.log('Welcome to the Console Application!');
handleUserInput();
