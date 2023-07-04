# TradeHub Web Application

TradeHub is a web application that allows users to trade items with each other. It provides a platform for authenticated users to make trade offers, add items to their watch list, and manage their trades effectively.

![ezgif com-crop](https://github.com/deepfuriya/trading-web-application/assets/79759607/6778126a-f499-4b43-849b-f7e9dba487ee)

## Features

### Trade Offer Feature

Users can initiate trade offers by indicating which of their own items they are interested in trading. Once an offer is made, both items involved in the offer will show a status reflecting the trade offer (e.g., pending, offer made). The user who initiated the offer can withdraw or cancel their offer at any point before it is accepted or rejected.

When a user receives an offer for one of their items, they have the option to accept or reject the offer. The status of the items involved in the offer will reflect the outcome of the trade (e.g., traded, available).

### Watch List

Users can add items to their watch list. These items are offered by others and are of potential interest to the user. The watch list allows users to keep track of items they might want to trade for in the future.

### User Profile Page

The user profile page provides a comprehensive view of the user's trading activity. It displays the user's trades along with their respective statuses, any trade offers they have made, and the trades they have added to their watch list. This information helps users stay organized and manage their trading effectively.

## Security Measures

TradeHub implements security measures to protect against common web application attacks. The following measures are in place:

### Cross-site Scripting (XSS) Prevention

Input validation and output encoding techniques are applied to prevent XSS attacks. All user inputs, except passwords, are validated and sanitized to ensure they do not contain malicious scripts. Additionally, output encoding is used when displaying user-generated content to prevent script execution in the browser.

### Social Engineering Protection

Passwords are securely stored using hashing and salting techniques. This ensures that even if the database is compromised, the passwords cannot be easily deciphered. Hashing transforms the password into a unique string, while salting adds an additional random value to the password before hashing. These measures enhance the security of user credentials.

### Limiting Authentication Requests

To prevent brute force attacks and protect user accounts, TradeHub limits the number of authentication requests. If an excessive number of login attempts are made within a certain time period, the system will temporarily lock the account or introduce a delay between subsequent authentication attempts. This helps deter automated attacks.

## Database Exports

To maintain a record of user accounts and trades, TradeHub exports the necessary data from the MongoDB database. This includes:

- User accounts: The email addresses and plaintext passwords of the user accounts are saved in a plaintext document named `userCredentials.txt`. This information can be used for administrative purposes or account recovery if necessary.

- Trades: At least two user accounts are created, and each user account has at least three trades. The trades cover at least two categories/topics, with a minimum of three trades per category/topic. The users' trades and associated information are exported as JSON files using MongoDB Compass.

## Installation and Usage

To run TradeHub locally on your machine, follow these steps:

1. Clone the repository: `git clone https://github.com/deepfuriya/tradehub.git`
2. Navigate to the project directory: `cd tradehub`
3. Install the dependencies: `npm install`
4. Set up the MongoDB database and provide the connection details in the application configuration file.
5. Start the application: `npm start`
6. Access TradeHub in your web browser at `http://localhost:3000`

## Technologies Used

TradeHub is built using the following technologies and frameworks:

- Node.js: A JavaScript runtime environment for server-side development.
- Express.js: A web application framework
