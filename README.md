# Mocaverse FE Assignment

This guide will help you set up and run the **Mocaverse FE Assignment** project on your local machine. We'll cover installing dependencies, starting the development server, and testing the web application.

## Prerequisites

- **Node.js**: Version **20.18.0**
- **Yarn**: Ensure Yarn is installed globally on your system.

## Setup Instructions

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/nhd98z/mocaverse-ticket-interface.git
```

```bash
cd mocaverse-ticket-interface
```

### 2. Install Dependencies

Install all required packages using Yarn:

```bash
yarn
```

This command reads the `package.json` file and installs all necessary dependencies.

### 3. Start the Development Server

Run the following command to start the development server:

```bash
yarn dev
```

By default, the application will run on port **9574**. Open your browser and navigate to:

```
http://localhost:9574
```

## Testing the Web Application

With the application running, you can now test its functionality.

### Step 1: Access the Application

Open your web browser and go to:

```
http://localhost:9574
```

You'll see the landing page prompting you to enter an invite code.

### Step 2: Enter an Invite Code

- **Valid Invite Code**: Enter `123456` as the invite code. This is recognized as a valid code in the mock API.
- **Invalid Invite Code**: Enter any other six-character alphanumeric code (e.g., `ABCDEF`) to test the application's error handling for invalid codes.

### Step 3: Click "Claim with Code!"

- If you entered a valid code (`123456`), you'll proceed to the next step.
- If you entered an invalid code, an error message will appear indicating that the code is invalid.

### Step 4: Enter Your Email Address

On the next screen, you'll be prompted to enter your email address.

- **Valid Email**: Use `alice@gmail.com`. The mock API treats this email as unused.
- **Invalid Email**: Use any other email address to simulate an email that's already been used, which should trigger an error message.

### Step 5: Connect Your Wallet

Click on the **"Connect Wallet"** button.

- Ensure you have a compatible wallet extension installed in your browser (e.g., MetaMask).
- Follow the prompts to connect your wallet.

### Step 6: Check Wallet Address

After connecting your wallet, your wallet address will be displayed.

- **Valid Wallet Address**: If your wallet address is `0x32611756C2418eF400959e5C008134302fd389C9`, the application will treat it as unused.
- **Invalid Wallet Address**: Any other wallet address will simulate a wallet that's already been used, resulting in an error message.

### Step 7: Claim Your Moca ID

Click on the **"Claim Moca ID"** button.

- A prompt will appear asking you to sign a message with your wallet.
- Sign the message to proceed.

### Step 8: Success Confirmation

If all the information is valid and the signature is correct, a success message will appear, indicating that you've successfully claimed your Moca ID.

### Error Handling

- **Invalid Invite Code**: An error message will appear if the invite code is invalid.
- **Email Already Used**: If the email address has already been used, an error message will notify you.
- **Wallet Already Used**: If the wallet address is already associated with a claim, an error message will be displayed.
- **Signature Errors**: If you decline to sign the message or an error occurs during signing, the application will handle it gracefully and prompt you accordingly.
