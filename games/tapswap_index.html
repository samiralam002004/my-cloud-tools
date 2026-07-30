<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>TapSwap Refined</title>
    <!-- Telegram WebApp JS -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        /* --- Enhanced "Claude Sonnet 3.7" Aesthetic --- */
        :root {
            /* Fallback Theme Variables (if Telegram vars aren't available) */
            --fallback-bg-color: #f7f8fa; /* Slightly off-white */
            --fallback-text-color: #1c1e21; /* Darker gray */
            --fallback-hint-color: #6c757d; /* Muted gray */
            --fallback-link-color: #007aff; /* iOS-like blue */
            --fallback-button-color: #007aff;
            --fallback-button-text-color: #ffffff;
            --fallback-secondary-bg-color: #ffffff; /* White cards */

            --primary-color: var(--tg-theme-button-color, var(--fallback-button-color));
            --secondary-color: var(--tg-theme-hint-color, var(--fallback-hint-color));
            --background-color: var(--tg-theme-bg-color, var(--fallback-bg-color));
            --text-color: var(--tg-theme-text-color, var(--fallback-text-color));
            --card-bg: var(--tg-theme-secondary-bg-color, var(--fallback-secondary-bg-color));
            --border-color: var(--tg-theme-secondary-bg-color, #eef0f2); /* Subtle border, uses secondary if possible */
            --success-color: #34c759; /* iOS green */
            --warning-color: #ff9500; /* iOS orange */
            --danger-color: #ff3b30; /* iOS red */
            --energy-color: #ffcc00; /* iOS yellow */
            --energy-bg: #e5e5ea; /* Lighter gray for energy bar background */
            --bottom-nav-bg: var(--tg-theme-secondary-bg-color, #ffffff);
            --bottom-nav-border: rgba(60, 60, 67, 0.15); /* Subtle, translucent border */
            --bottom-nav-icon-color: var(--tg-theme-hint-color, #8e8e93); /* Slightly muted icon color */
            --bottom-nav-icon-active-color: var(--tg-theme-button-color, var(--fallback-link-color));

            --shadow-color-light: rgba(0, 0, 0, 0.06);
            --shadow-color-medium: rgba(0, 0, 0, 0.1);
        }

        /* Basic Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent; /* Disable tap highlight */
        }

        html {
            scroll-behavior: smooth;
        }

        html, body {
            height: 100%;
            width: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overscroll-behavior-y: none;
            background-color: var(--background-color);
            color: var(--text-color);
            font-size: 16px; /* Base font size */
            line-height: 1.5;
        }

        body.dark {
             /* Dark Mode Palette */
            --fallback-bg-color: #000000;
            --fallback-text-color: #ffffff;
            --fallback-hint-color: #8e8e93;
            --fallback-link-color: #0a84ff; /* Brighter blue for dark mode */
            --fallback-button-color: #0a84ff;
            --fallback-button-text-color: #ffffff;
            --fallback-secondary-bg-color: #1c1c1e; /* Very dark gray */

            --border-color: rgba(84, 84, 88, 0.4);
            --energy-bg: #3a3a3c;
            --bottom-nav-bg: #1c1c1e;
            --bottom-nav-border: rgba(84, 84, 88, 0.65);
            --bottom-nav-icon-color: #8e8e93;

            --shadow-color-light: rgba(0, 0, 0, 0.3);
            --shadow-color-medium: rgba(0, 0, 0, 0.5);
        }

        #app {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
            overflow: hidden;
        }

        #content {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px; /* Increased padding */
            padding-bottom: 85px; /* Increased space for potentially taller nav */
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        /* Page Styling */
        .page {
            display: none;
            flex-direction: column;
            align-items: center;
            width: 100%;
            animation: fadeIn 0.3s ease-out;
        }

        .page.active {
            display: flex;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Bottom Navigation */
        #bottomNav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px; /* Slightly taller */
            background-color: var(--bottom-nav-bg);
            border-top: 1px solid var(--bottom-nav-border);
            display: flex;
            justify-content: space-around;
            align-items: stretch; /* Align items stretch to fill height */
            padding: 5px 0 10px 0; /* Adjust padding, add more bottom padding for label */
            box-shadow: 0 -2px 10px var(--shadow-color-light);
            z-index: 1000;
        }

        .nav-button {
            background: none;
            border: none;
            color: var(--bottom-nav-icon-color);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 11px; /* Slightly larger text */
            font-weight: 500;
            flex-grow: 1;
            padding: 8px 0; /* Increased padding */
            transition: color 0.2s ease, transform 0.1s ease;
            position: relative; /* For potential active indicator */
        }

        .nav-button svg {
            width: 26px; /* Slightly larger icons */
            height: 26px;
            margin-bottom: 4px;
            fill: currentColor;
            transition: transform 0.2s ease;
        }

        .nav-button.active {
            color: var(--bottom-nav-icon-active-color);
        }

        .nav-button:active {
            transform: scale(0.95); /* Press feedback */
        }

        /* Shared Card Style */
        .card {
            background-color: var(--card-bg);
            border-radius: 18px; /* Softer corners */
            padding: 25px; /* More internal spacing */
            margin-bottom: 20px;
            width: 100%;
            max-width: 550px; /* Slightly wider max */
            box-shadow: 0 5px 15px var(--shadow-color-light);
            border: 1px solid var(--border-color); /* Keep a subtle border */
            overflow: hidden; /* Ensure content respects border-radius */
        }

        .card h2 {
            margin-bottom: 20px;
            font-size: 1.4em; /* Larger heading */
            font-weight: 600; /* Bolder heading */
            color: var(--text-color);
            text-align: center;
        }

        /* Profile Page */
        #profilePage .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0; /* More vertical spacing */
            border-bottom: 1px solid var(--border-color);
            font-size: 1em; /* Standard font size */
        }
        #profilePage .info-item:last-child {
            border-bottom: none;
        }
        #profilePage .info-item span:first-child {
            color: var(--secondary-color);
            margin-right: 15px;
            flex-shrink: 0; /* Prevent label from shrinking */
        }
        #profilePage .info-item span:last-child {
            font-weight: 500;
            text-align: right;
            word-break: break-all;
             color: var(--text-color);
        }
         #profilePage .profile-pic {
            width: 100px; /* Larger profile pic */
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 25px auto; /* More space below pic */
            display: block;
            background-color: var(--border-color);
            border: 3px solid var(--card-bg); /* Inner border */
            box-shadow: 0 2px 5px var(--shadow-color-light);
            object-fit: cover; /* Ensure image covers */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23e0e0e0"/><path d="M50 42c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" fill="%23a0a0a0"/><path d="M76 64c0-11-8.5-20-19.3-21.7 1.1-1.6 1.8-3.5 1.8-5.6 0-5.5-4.5-10-10-10s-10 4.5-10 10c0 2.1.6 4 1.8 5.6C28.5 44 20 53 20 64v6h60v-6z" fill="%23a0a0a0"/></svg>');
            background-size: cover;
            background-position: center;
        }

        /* Tap Page */
        #tapPage {
            justify-content: space-around; /* Better vertical spacing */
            height: 100%;
            text-align: center;
            padding-top: 5vh; /* Push content down slightly */
        }

        .tap-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-grow: 1; /* Take up available space */
            margin-bottom: 20px; /* Space between cat and energy */
        }

        #catButton {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy effect */
            user-select: none;
            -webkit-user-select: none;
            margin-bottom: 30px; /* More space below cat */
        }

        #catImage {
            width: 200px; /* Larger cat */
            height: 200px;
            border-radius: 50%;
            /* Subtle gradient background using warning color */
            background: radial-gradient(circle, var(--warning-color) 60%, color-mix(in srgb, var(--warning-color) 80%, black));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            box-shadow: 0 8px 25px color-mix(in srgb, var(--warning-color) 40%, transparent); /* Colored shadow */
            border: 5px solid var(--background-color); /* Border matching background */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐱</text></svg>');
            background-size: 75%;
            background-repeat: no-repeat;
            background-position: center;
            transition: transform 0.1s ease-out; /* Keep smooth transform on active */
        }

        #catButton:active { /* Use :active pseudo-class */
            transform: scale(0.92); /* Slightly larger scale down */
        }

        .score-display {
            font-size: 3.2em; /* Even larger score */
            font-weight: 700; /* Bolder */
            margin-bottom: 15px; /* Reduced margin */
            color: var(--text-color);
            display: flex; /* Use flex for alignment */
            align-items: center;
            justify-content: center;
            gap: 10px; /* Space between icon and number */
        }

        .score-icon {
             display: inline-block;
             width: 36px; /* Larger icon */
             height: 36px;
             vertical-align: middle;
             background-color: var(--energy-color); /* Consistent color */
             border-radius: 50%;
             background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.99 14.71L10 15.03V9h2v5.03l2.01 1.68-.99 1z"/></svg>'); /* Different Coin Style */
             background-size: 65%;
             background-repeat: no-repeat;
             background-position: center;
             box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }


        .energy-section {
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
            padding: 0 10px; /* Padding to prevent touching edges */
        }

        .energy-label {
            font-size: 1em; /* Slightly larger label */
            color: var(--secondary-color);
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 5px; /* Align text with bar ends */
        }
        .energy-label span:last-child {
            font-weight: 600; /* Bolder energy number */
            color: var(--text-color);
        }

        .energy-bar-container {
            width: 100%;
            height: 16px; /* Thicker bar */
            background-color: var(--energy-bg);
            border-radius: 8px; /* Matched radius */
            overflow: hidden;
            margin-bottom: 15px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); /* Inner shadow */
        }

        #energyBar {
            height: 100%;
            width: 100%;
            /* Updated gradient */
            background: linear-gradient(90deg, color-mix(in srgb, var(--energy-color) 90%, #fff) 0%, var(--energy-color) 100%);
            border-radius: 8px;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother refill animation */
        }

        /* Task Page */
        #taskPage ul {
            list-style: none;
            width: 100%;
            max-width: 550px;
            padding: 0; /* Remove default ul padding */
        }
        #taskPage li {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px; /* Consistent rounding */
            padding: 15px 20px; /* More horizontal padding */
            margin-bottom: 12px; /* Slightly less margin */
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
         #taskPage li:hover {
             /* Subtle lift effect on hover for desktop */
             transform: translateY(-2px);
             box-shadow: 0 4px 10px var(--shadow-color-light);
         }
        #taskPage .task-info {
            flex-grow: 1;
            margin-right: 15px;
        }
        #taskPage .task-title {
            font-weight: 500; /* Medium weight */
            margin-bottom: 4px;
             color: var(--text-color);
        }
        #taskPage .task-reward {
            font-size: 0.9em;
            color: var(--secondary-color);
            display: flex; /* Align icon and text */
            align-items: center;
            gap: 4px;
        }
         #taskPage .task-reward svg {
              width: 16px; height: 16px; fill: var(--warning-color); flex-shrink: 0;
         }
        #taskPage .task-button {
            padding: 9px 18px; /* Larger button */
            font-size: 0.95em;
            font-weight: 500;
            background-color: var(--primary-color);
            color: var(--fallback-button-text-color); /* Use fallback white directly */
            border: none;
            border-radius: 10px; /* Softer button corners */
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            flex-shrink: 0; /* Prevent button shrinking */
        }
        #taskPage .task-button:hover:not(:disabled) {
            /* Slightly darken/lighten based on theme */
            background-color: color-mix(in srgb, var(--primary-color) 90%, black);
        }
        #taskPage .task-button:active:not(:disabled) {
            transform: scale(0.96); /* Press feedback */
        }
        #taskPage .task-button:disabled {
            background-color: color-mix(in srgb, var(--secondary-color) 50%, transparent); /* More muted disabled state */
            color: color-mix(in srgb, var(--text-color) 50%, transparent);
            cursor: not-allowed;
            opacity: 0.7;
        }
        #taskPage .task-button.completed {
            background-color: var(--success-color);
            color: white;
        }
         #taskPage .task-icon {
             width: 36px; height: 36px; margin-right: 15px; flex-shrink: 0;
             color: var(--tg-theme-link-color, var(--primary-color)); /* Color the icon */
         }
          #taskPage .task-icon svg {
              width: 100%; height: 100%; fill: currentColor; /* Let parent color control */
          }
         /* Specific Icon Styling */
         .youtube-icon svg { fill: #FF0000; }


        /* Withdraw Page */
        #withdrawPage .card {
            width: 100%;
            max-width: 550px;
        }

        .form-group {
            margin-bottom: 20px; /* More space between fields */
        }

        .form-group label {
            display: block;
            margin-bottom: 8px; /* More space below label */
            font-size: 0.9em;
            font-weight: 500;
            color: var(--secondary-color);
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 14px 16px; /* Generous padding */
            border: 1px solid var(--border-color);
            border-radius: 10px; /* Softer corners */
            font-size: 1em;
            background-color: var(--background-color); /* Match app background */
            color: var(--text-color);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
         .form-group input:focus, .form-group select:focus {
             outline: none;
             border-color: var(--primary-color);
             box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 25%, transparent); /* Subtle focus ring */
         }
         /* Style select arrow */
         .form-group select {
            appearance: none; -webkit-appearance: none; -moz-appearance: none;
             background-image: url('data:image/svg+xml;utf8,<svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>');
             background-repeat: no-repeat;
             background-position: right 16px center;
             background-size: 1em;
             padding-right: 40px; /* Make space for arrow */
         }

        .withdraw-button {
            width: 100%;
            padding: 16px; /* Large tappable area */
            font-size: 1.1em; /* Larger text */
            font-weight: 600; /* Bold */
            background-color: var(--primary-color);
            color: var(--fallback-button-text-color);
            border: none;
            border-radius: 12px; /* Consistent rounding */
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            margin-top: 10px; /* Space above button */
        }
        .withdraw-button:hover:not(:disabled) {
            background-color: color-mix(in srgb, var(--primary-color) 90%, black);
        }
        .withdraw-button:active:not(:disabled) {
            transform: scale(0.98); /* Press feedback */
        }
         .withdraw-button:disabled {
            background-color: color-mix(in srgb, var(--secondary-color) 50%, transparent);
            color: color-mix(in srgb, var(--text-color) 50%, transparent);
            cursor: not-allowed;
            opacity: 0.7;
         }

        .withdraw-message {
            margin-top: 20px;
            font-size: 0.95em;
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            display: none;
        }
        .withdraw-message.success {
            color: var(--success-color);
            background-color: color-mix(in srgb, var(--success-color) 15%, transparent);
         }
        .withdraw-message.error {
            color: var(--danger-color);
            background-color: color-mix(in srgb, var(--danger-color) 15%, transparent);
        }

         /* Tap Feedback Animation */
        .tap-feedback {
            position: absolute;
            font-size: 1.8em; /* Slightly larger */
            font-weight: bold;
            color: var(--text-color);
            opacity: 1;
            animation: floatUp 0.8s ease-out forwards;
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
            text-shadow: 0 1px 2px var(--shadow-color-light); /* Subtle shadow */
            z-index: 999; /* Ensure it's above tap element */
        }

        @keyframes floatUp {
            from {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            to {
                transform: translateY(-70px) scale(0.7); /* Float higher */
                opacity: 0;
            }
        }

        /* Loading State */
        #loadingOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: color-mix(in srgb, var(--background-color) 85%, transparent); /* Translucent background */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-size: 1.2em;
            color: var(--text-color);
            backdrop-filter: blur(4px); /* Blur background */
            -webkit-backdrop-filter: blur(4px);
        }
         body.dark #loadingOverlay {
            background-color: rgba(0, 0, 0, 0.7); /* Keep dark overlay simple */
         }

          /* Shake animation for energy bar */
         @keyframes shake {
           0%, 100% { transform: translateX(0); }
           25% { transform: translateX(-3px); }
           75% { transform: translateX(3px); }
         }
         .energy-section.shake {
             animation: shake 0.3s ease-in-out;
         }


    </style>
</head>
<body>
    <!-- App structure remains the same -->
    <div id="app">
         <div id="loadingOverlay">Loading...</div>

        <div id="content">
            <!-- Profile Page -->
            <div id="profilePage" class="page">
                <div class="card">
                    <!-- No structural changes needed here -->
                    <h2>Profile</h2>
                    <img id="profilePic" class="profile-pic" alt="Profile Picture">
                    <div class="info-item">
                        <span>Name:</span>
                        <span id="profileName">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span>User ID:</span>
                        <span id="profileUserId">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span>Points:</span>
                        <span id="profilePoints">0</span>
                    </div>
                     <div class="info-item">
                        <span>Joined:</span>
                        <span id="profileJoinDate">Loading...</span>
                    </div>
                    <div class="info-item">
                        <span>Referral Link:</span>
                        <span id="profileReferral">N/A (Demo)</span>
                    </div>
                </div>
            </div>

            <!-- Tap Page -->
            <div id="tapPage" class="page active">
                 <!-- Order changed slightly for visual flow -->
                 <div class="score-display">
                    <span class="score-icon"></span>
                    <span id="pointsDisplay">0</span>
                </div>
                <div class="tap-area">
                    <button id="catButton">
                        <div id="catImage"></div>
                    </button>
                </div>
                <div class="energy-section">
                     <div class="energy-label">
                         <span>⚡ Energy</span>
                         <span id="energyLevel">100 / 100</span>
                    </div>
                    <div class="energy-bar-container">
                        <div id="energyBar"></div>
                    </div>
                </div>
            </div>

            <!-- Task Page -->
            <div id="taskPage" class="page">
                 <!-- Add a container card for consistency if preferred, or list directly -->
                 <div class="card">
                     <h2>Tasks</h2>
                     <p style="text-align: center; color: var(--secondary-color); font-size: 0.95em; margin-top: -10px; margin-bottom: 25px;">Complete tasks to earn more points!</p>
                     <ul id="taskList">
                         <!-- Tasks will be dynamically added here -->
                     </ul>
                 </div>
            </div>

            <!-- Withdraw Page -->
            <div id="withdrawPage" class="page">
                 <div class="card">
                     <h2>Withdraw Points</h2>
                     <p style="text-align: center; color: var(--secondary-color); font-size: 0.95em; margin-bottom: 25px;">Available: <strong id="withdrawPointsAvailable" style="color: var(--text-color); font-weight: 600;">0</strong></p>

                     <div class="form-group">
                        <label for="withdrawAmount">Amount:</label>
                        <input type="number" id="withdrawAmount" placeholder="Enter points to withdraw" min="1">
                     </div>

                     <div class="form-group">
                         <label for="withdrawMethod">Method:</label>
                         <select id="withdrawMethod">
                             <option value="paypal">PayPal</option>
                             <option value="wire">Wire Transfer</option>
                             <option value="crypto">Crypto (USDT)</option>
                             <option value="localhost">Localhost Simulation</option>
                         </select>
                     </div>

                     <!-- Details section remains structurally the same -->
                     <div id="methodDetails">
                          <div class="form-group detail-field paypal-field">
                             <label for="paypalEmail">PayPal Email:</label>
                             <input type="email" id="paypalEmail" placeholder="your.email@example.com">
                          </div>
                          <div class="form-group detail-field wire-field" style="display: none;">
                             <label for="bankAccount">Bank Account Number:</label>
                             <input type="text" id="bankAccount" placeholder="Account Number">
                             <label for="bankRouting" style="margin-top: 10px;">Routing Number:</label> <!-- Added margin -->
                             <input type="text" id="bankRouting" placeholder="Routing Number">
                          </div>
                          <div class="form-group detail-field crypto-field" style="display: none;">
                             <label for="cryptoAddress">USDT Wallet Address (TRC20):</label>
                             <input type="text" id="cryptoAddress" placeholder="T...">
                          </div>
                     </div>

                     <button id="submitWithdrawal" class="withdraw-button">Request Withdrawal</button>
                     <p id="withdrawMessage" class="withdraw-message"></p>
                 </div>
            </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <nav id="bottomNav">
             <!-- Icons slightly adjusted for common usage patterns -->
            <button class="nav-button" data-page="profilePage">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                Profile
            </button>
            <button class="nav-button active" data-page="tapPage">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.92 2.75a.75.75 0 0 1 .58.2l7.5 7.5a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l3.72-3.72-7.44-7.44A.75.75 0 0 1 11.92 2.75zM3.81 9.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 1 1 1.06 1.06L5.4 8.75l7.44 7.44a.75.75 0 0 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1-.47-.77z"/></svg> <!-- Simple Tap/Swipe Icon -->
                Tap
            </button>
            <button class="nav-button" data-page="taskPage">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3h-9C6.12 3 5 4.12 5 5.5v13C5 19.88 6.12 21 7.5 21h9c1.38 0 2.5-1.12 2.5-2.5v-13C19 4.12 17.88 3 16.5 3zM15 18H9v-1.5h6V18zm0-3.5H9V13h6v1.5zm0-3.5H9V8h6v3z"/></svg> <!-- Checklist Icon -->
                Tasks
            </button>
            <button class="nav-button" data-page="withdrawPage">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm0-12H4V6h16v2zm-4 8H8v-2h8v2z"/></svg> <!-- Wallet/Card Icon -->
                Withdraw
            </button>
        </nav>
    </div>

    <script>
        const tg = window.Telegram.WebApp;

        // --- DOM Elements (Define ALL relevant elements upfront) ---
        const loadingOverlay = document.getElementById('loadingOverlay');
        const content = document.getElementById('content');
        const pages = document.querySelectorAll('.page');
        const navButtons = document.querySelectorAll('.nav-button');
        const pointsDisplay = document.getElementById('pointsDisplay');
        const profilePoints = document.getElementById('profilePoints');
        const withdrawPointsAvailable = document.getElementById('withdrawPointsAvailable');
        const catButton = document.getElementById('catButton');
        const catImage = document.getElementById('catImage');
        const energyLevelDisplay = document.getElementById('energyLevel');
        const energyBar = document.getElementById('energyBar');
        const taskList = document.getElementById('taskList');
        const profileName = document.getElementById('profileName');
        const profileUserId = document.getElementById('profileUserId');
        const profileJoinDate = document.getElementById('profileJoinDate');
        const profileReferral = document.getElementById('profileReferral');
        const profilePic = document.getElementById('profilePic');
        // Withdraw page elements
        const withdrawAmountInput = document.getElementById('withdrawAmount');
        const withdrawMethodSelect = document.getElementById('withdrawMethod');
        const submitWithdrawalButton = document.getElementById('submitWithdrawal');
        const withdrawMessage = document.getElementById('withdrawMessage');
        const methodDetailsDiv = document.getElementById('methodDetails');
        const detailFields = methodDetailsDiv.querySelectorAll('.detail-field');
        // **FIX:** Define withdrawal input fields globally
        const paypalEmailInput = document.getElementById('paypalEmail');
        const bankAccountInput = document.getElementById('bankAccount');
        const bankRoutingInput = document.getElementById('bankRouting');
        const cryptoAddressInput = document.getElementById('cryptoAddress');


        // --- Game State & Config ---
        const MAX_ENERGY = 1000; // Example: Max energy
        const ENERGY_REFILL_RATE = 2; // Energy points per second
        const ENERGY_PER_TAP = 1; // Energy cost per tap
        const POINTS_PER_TAP = 1; // Points earned per tap
        const LOCAL_STORAGE_KEY = 'tapSwapCloneData_v2'; // Updated key if needed
        const TASK_REWARD = 1000;

         // Define tasks (using the refined list for variety)
        const TASKS = [
            { id: 0, title: "Watch Intro Video", description: `+${TASK_REWARD} Points`, completed: false, icon: 'youtube' },
            { id: 1, title: "Watch Gameplay Tutorial", description: `+${TASK_REWARD} Points`, completed: false, icon: 'youtube' },
            { id: 2, title: "Follow on X (Twitter)", description: `+${TASK_REWARD} Points`, completed: false, icon: 'generic' },
            { id: 3, title: "Subscribe to Channel", description: `+${TASK_REWARD} Points`, completed: false, icon: 'youtube' },
            { id: 4, title: "Join Telegram Group", description: `+${TASK_REWARD} Points`, completed: false, icon: 'generic' },
        ];

        let userData = {
            points: 0,
            energy: MAX_ENERGY,
            maxEnergy: MAX_ENERGY,
            lastEnergyUpdate: Date.now(),
            joinDate: null,
            tasks: TASKS.map(task => ({ id: task.id, completed: false })),
            telegramUser: null
        };

        // --- Initialization ---
        function initApp() {
            console.log("Initializing App (Refined UI)...");
            tg.ready();

            applyTheme();
            tg.onEvent('themeChanged', applyTheme);

            tg.expand();
             try { // Add try-catch for older Telegram versions
                 tg.disableVerticalSwipes();
             } catch (e) {
                 console.warn("disableVerticalSwipes not supported:", e.message);
             }

            loadData();

            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                userData.telegramUser = tg.initDataUnsafe.user;
                console.log("Telegram User:", userData.telegramUser);
                if (!userData.joinDate) {
                     userData.joinDate = new Date().toISOString();
                     saveData();
                }
                displayProfileInfo();
                generateReferralLink();
            } else {
                console.warn("Telegram user data not available.");
                profileName.textContent = "Guest User";
                profileUserId.textContent = "N/A";
                profileJoinDate.textContent = userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : new Date().toLocaleDateString();
                 generateReferralLink(); // Still call to set default state
            }

            updatePointsDisplay();
            refillEnergy();
            updateEnergyDisplay();
            renderTasks();
            showPage('tapPage');

            setupEventListeners(); // Ensure this is called *after* elements are defined

            setInterval(refillEnergy, 1000);

            // Hide loading overlay smoothly
            setTimeout(() => {
                 loadingOverlay.style.opacity = '0';
                 setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
             }, 100);

             console.log("App Initialized (Refined UI).");
        }

         // --- Theme Application --- (Using the refined version)
         function applyTheme() {
            const themeParams = tg.themeParams || {}; // Use empty object if undefined
            console.log("Applying theme:", themeParams);
            const root = document.documentElement.style;

            const setVar = (varName, tgValue, fallbackValue) => {
                root.setProperty(varName, tgValue || fallbackValue);
            };

            // Use fallback values defined in :root CSS
            setVar('--primary-color', themeParams.button_color, 'var(--fallback-button-color)');
            setVar('--secondary-color', themeParams.hint_color, 'var(--fallback-hint-color)');
            setVar('--background-color', themeParams.bg_color, 'var(--fallback-bg-color)');
            setVar('--text-color', themeParams.text_color, 'var(--fallback-text-color)');
            setVar('--card-bg', themeParams.secondary_bg_color, 'var(--fallback-secondary-bg-color)');
            setVar('--bottom-nav-bg', themeParams.secondary_bg_color, 'var(--fallback-secondary-bg-color)');
            setVar('--fallback-button-text-color', themeParams.button_text_color, '#ffffff'); // Set button text var

             // Update derived variables or specific elements if needed
             setVar('--bottom-nav-icon-active-color', themeParams.button_color, 'var(--fallback-link-color)');
             setVar('--border-color', themeParams.secondary_bg_color ? colorMix(themeParams.secondary_bg_color, themeParams.hint_color || '#888888', 0.1) : 'var(--fallback-border-color, #eef0f2)');


            const isDark = tg.colorScheme === 'dark' || (themeParams.bg_color && isColorDark(themeParams.bg_color));
            document.body.classList.toggle('dark', isDark);
            console.log(`Theme applied. Dark mode: ${isDark}`);
        }

        // Helper to mix colors (basic version for border)
        function colorMix(color1, color2, weight) {
             // Basic placeholder - returns a slightly modified version of color1 or fallback
            try {
                let c1 = color1.replace('#','');
                if (c1.length === 3) c1 = c1.split('').map(c=>c+c).join('');
                let r = parseInt(c1.substring(0,2), 16);
                let g = parseInt(c1.substring(2,4), 16);
                let b = parseInt(c1.substring(4,6), 16);
                let factor = isColorDark(color1) ? 1.15 : 0.9; // Adjust factor for subtle difference
                r = Math.min(255, Math.max(0, Math.round(r * factor)));
                g = Math.min(255, Math.max(0, Math.round(g * factor)));
                b = Math.min(255, Math.max(0, Math.round(b * factor)));
                return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
            } catch {
                return color2 || '#e0e0e0'; // Use hint or a light gray fallback
            }
        }

        function isColorDark(hexColor) {
            if (!hexColor) return false;
             try {
                hexColor = hexColor.replace(/^#/, '');
                if (hexColor.length === 3) hexColor = hexColor.split('').map(char => char + char).join('');
                if (hexColor.length !== 6) return false;
                const r = parseInt(hexColor.substring(0, 2), 16);
                const g = parseInt(hexColor.substring(2, 4), 16);
                const b = parseInt(hexColor.substring(4, 6), 16);
                const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                return luminance < 0.5;
             } catch (e) { return false; }
        }

        // --- Data Persistence --- (Using refined version)
        function saveData() {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
            } catch (e) {
                console.error("Error saving data to localStorage:", e);
                 try { tg.showPopup({ title: 'Storage Error', message: 'Could not save progress.', buttons: [{ type: 'ok' }] }); } catch {}
            }
        }

        function loadData() {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    userData.points = Number(parsedData.points) || 0;
                    userData.maxEnergy = Number(parsedData.maxEnergy) || MAX_ENERGY;
                    userData.energy = Math.min(Number(parsedData.energy) || 0, userData.maxEnergy);
                    userData.lastEnergyUpdate = Number(parsedData.lastEnergyUpdate) || Date.now();
                    userData.joinDate = parsedData.joinDate || null;
                    userData.telegramUser = parsedData.telegramUser || userData.telegramUser;

                    const loadedTasks = parsedData.tasks || [];
                    const currentTaskMap = new Map(loadedTasks.map(t => [t.id, t.completed]));
                    userData.tasks = TASKS.map(taskDef => ({
                        id: taskDef.id,
                        completed: currentTaskMap.get(taskDef.id) || false
                    }));

                    console.log("Data loaded:", userData);
                } catch (e) {
                    console.error("Error parsing saved data:", e);
                     localStorage.removeItem(LOCAL_STORAGE_KEY);
                     if (!userData.joinDate) userData.joinDate = new Date().toISOString();
                }
            } else {
                 console.log("No saved data found, using defaults.");
                 if (!userData.joinDate) userData.joinDate = new Date().toISOString();
                 saveData();
            }
        }

        // --- UI Update Functions --- (Using refined versions)
        function updatePointsDisplay() {
            const formattedPoints = Math.floor(userData.points).toLocaleString('en-US');
            pointsDisplay.textContent = formattedPoints;
            profilePoints.textContent = formattedPoints;
            withdrawPointsAvailable.textContent = formattedPoints;
            if(withdrawAmountInput) withdrawAmountInput.max = Math.floor(userData.points);
            updateWithdrawButtonState();
        }

        function updateEnergyDisplay() {
             const currentEnergy = Math.floor(userData.energy);
             const maxEnergy = userData.maxEnergy;
             energyLevelDisplay.textContent = `${currentEnergy.toLocaleString('en-US')} / ${maxEnergy.toLocaleString('en-US')}`;
             const energyPercentage = maxEnergy > 0 ? (currentEnergy / maxEnergy) * 100 : 0;
             energyBar.style.width = `${energyPercentage}%`;
        }

        function displayProfileInfo() {
            if (userData.telegramUser) {
                profileName.textContent = `${userData.telegramUser.first_name || ''} ${userData.telegramUser.last_name || ''}`.trim() || 'Telegram User';
                profileUserId.textContent = userData.telegramUser.id || 'N/A';
                if (userData.telegramUser.photo_url) {
                    profilePic.src = userData.telegramUser.photo_url;
                    profilePic.style.backgroundImage = 'none';
                    profilePic.onerror = () => { // Fallback if image fails
                         profilePic.src = '';
                         profilePic.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23e0e0e0"/><path d="M50 42c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" fill="%23a0a0a0"/><path d="M76 64c0-11-8.5-20-19.3-21.7 1.1-1.6 1.8-3.5 1.8-5.6 0-5.5-4.5-10-10-10s-10 4.5-10 10c0 2.1.6 4 1.8 5.6C28.5 44 20 53 20 64v6h60v-6z" fill="%23a0a0a0"/></svg>')`;
                    }
                } else {
                    profilePic.src = '';
                    profilePic.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23e0e0e0"/><path d="M50 42c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z" fill="%23a0a0a0"/><path d="M76 64c0-11-8.5-20-19.3-21.7 1.1-1.6 1.8-3.5 1.8-5.6 0-5.5-4.5-10-10-10s-10 4.5-10 10c0 2.1.6 4 1.8 5.6C28.5 44 20 53 20 64v6h60v-6z" fill="%23a0a0a0"/></svg>')`;
                }
            }
             profileJoinDate.textContent = userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : 'N/A';
        }

        function generateReferralLink() {
             const refSpan = profileReferral; // Use the defined element
             if (userData.telegramUser && userData.telegramUser.id) {
                 const botUsername = 'YourTapSwapBot'; // Replace with your bot's username
                 const link = `t.me/${botUsername}?start=${userData.telegramUser.id}`;
                 refSpan.textContent = link;
                 refSpan.onclick = () => {
                    try { tg.openTelegramLink(link); } catch (e) { console.error("Failed to open TG link", e); }
                 };
                 refSpan.style.cursor = 'pointer';
                 refSpan.style.color = 'var(--tg-theme-link-color, var(--fallback-link-color))';
             } else {
                 refSpan.textContent = 'N/A';
                 refSpan.onclick = null;
                 refSpan.style.cursor = 'default';
                 refSpan.style.color = 'var(--tg-theme-text-color, var(--fallback-text-color))'; // Reset color
             }
         }

        // --- Navigation --- (Using refined version)
        function showPage(pageId) {
            let foundPage = false;
            pages.forEach(page => {
                const isActive = page.id === pageId;
                page.classList.toggle('active', isActive);
                if(isActive) foundPage = true;
            });

            if (!foundPage) {
                 console.warn(`Page ID "${pageId}" not found, defaulting to tapPage.`);
                 pageId = 'tapPage';
                 document.getElementById('tapPage').classList.add('active');
            }

            navButtons.forEach(button => {
                button.classList.toggle('active', button.dataset.page === pageId);
            });

            if (content) content.scrollTop = 0; // Scroll to top

            switch(pageId) {
                case 'profilePage': displayProfileInfo(); updatePointsDisplay(); break;
                case 'taskPage': renderTasks(); updatePointsDisplay(); break;
                case 'withdrawPage': updatePointsDisplay(); updateWithdrawMethodDetails(); updateWithdrawButtonState(); break; // Ensure button state is updated on page show
                case 'tapPage': default: updatePointsDisplay(); updateEnergyDisplay(); break;
            }
            console.log("Showing page:", pageId);
        }

        // --- Game Logic --- (Using refined versions)
        function handleTap(event) {
            if (userData.energy >= ENERGY_PER_TAP) {
                 const now = Date.now();
                 if (catButton.dataset.lastTap && (now - parseInt(catButton.dataset.lastTap) < 50)) return;
                 catButton.dataset.lastTap = now.toString();

                userData.points += POINTS_PER_TAP;
                userData.energy = Math.max(0, userData.energy - ENERGY_PER_TAP);
                userData.lastEnergyUpdate = Date.now();

                updatePointsDisplay();
                updateEnergyDisplay();
                saveData();

                const x = event.clientX || (catButton.offsetLeft + catButton.offsetWidth / 2);
                const y = event.clientY || (catButton.offsetTop + catButton.offsetHeight / 2);
                createFloatingText(`+${POINTS_PER_TAP}`, x, y);

                try { tg.HapticFeedback.impactOccurred('light'); } catch(e) {}

            } else {
                 try { tg.HapticFeedback.notificationOccurred('error'); } catch(e) {}
                 const energySection = document.querySelector('.energy-section');
                 if(energySection) {
                    energySection.classList.add('shake');
                    setTimeout(() => energySection.classList.remove('shake'), 300);
                 }
            }
        }

        function createFloatingText(text, x, y) {
            const feedback = document.createElement('div');
            feedback.textContent = text;
            feedback.className = 'tap-feedback';
            feedback.style.left = `${x}px`;
            feedback.style.top = `${y}px`;
            feedback.style.transform = 'translate(-50%, -100%)';

            document.body.appendChild(feedback);

            feedback.addEventListener('animationend', () => {
                if (feedback.parentNode) feedback.remove();
            });
        }

        function refillEnergy() {
            const now = Date.now();
            const timeElapsed = (now - userData.lastEnergyUpdate) / 1000;

            if (userData.energy < userData.maxEnergy && timeElapsed > 0) {
                const energyToRefill = timeElapsed * ENERGY_REFILL_RATE;
                const prevEnergyFloor = Math.floor(userData.energy);
                userData.energy = Math.min(userData.maxEnergy, userData.energy + energyToRefill);
                const currentEnergyFloor = Math.floor(userData.energy);

                // Update display and save only if the floored value changes or max is reached
                if (currentEnergyFloor > prevEnergyFloor || (userData.energy === userData.maxEnergy && prevEnergyFloor < currentEnergyFloor)) {
                    userData.lastEnergyUpdate = now;
                    saveData();
                    updateEnergyDisplay();
                }
            } else if (userData.energy >= userData.maxEnergy) {
                 // Keep timestamp current even when full
                 userData.lastEnergyUpdate = now;
            }
        }


        // --- Task Logic --- (Using refined versions)
        function renderTasks() {
            taskList.innerHTML = '';
            TASKS.forEach((taskInfo) => {
                const userTaskData = userData.tasks.find(t => t.id === taskInfo.id);
                const isCompleted = userTaskData ? userTaskData.completed : false;
                const li = document.createElement('li');
                let iconSvg = getTaskIconSvg(taskInfo.icon);

                li.innerHTML = `
                     <span class="task-icon ${taskInfo.icon}-icon">${iconSvg}</span>
                    <div class="task-info">
                        <div class="task-title">${taskInfo.title}</div>
                        <div class="task-reward">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.99 14.71L10 15.03V9h2v5.03l2.01 1.68-.99 1z"/></svg>
                            ${taskInfo.description}
                        </div>
                    </div>
                    <button class="task-button" data-task-id="${taskInfo.id}" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? 'Claimed' : 'Go'}
                    </button>
                `;

                const button = li.querySelector('.task-button');
                if (isCompleted) {
                    button.classList.add('completed');
                    button.textContent = 'Claimed';
                } else {
                    button.addEventListener('click', () => completeTask(taskInfo.id));
                }
                taskList.appendChild(li);
            });
        }

        function getTaskIconSvg(iconType) {
             switch(iconType) {
                 case 'youtube':
                    return `<svg viewBox="0 0 24 24"><path d="M21.58 7.19c-.23-.86-.9-1.52-1.76-1.76C18.25 5 12 5 12 5s-6.25 0-7.82.43c-.86.24-1.52.9-1.76 1.76C2 8.75 2 12 2 12s0 3.25.43 4.81c.23.86.9 1.52 1.76 1.76C5.75 19 12 19 12 19s6.25 0 7.82-.43c.86-.24 1.52-.9 1.76-1.76C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/></svg>`;
                 case 'generic': default:
                    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`; // Link icon
             }
        }

        function completeTask(taskId) {
            const taskIndex = userData.tasks.findIndex(t => t.id === taskId);
            const taskInfo = TASKS.find(t => t.id === taskId);

            if (taskIndex !== -1 && taskInfo && !userData.tasks[taskIndex].completed) {
                console.log(`Attempting task ${taskId}: ${taskInfo.title}`);
                const button = taskList.querySelector(`.task-button[data-task-id="${taskId}"]`);
                if(button) button.disabled = true;

                // --- Placeholder for actual task action ---
                 // Example: tg.openLink(...) or tg.openTelegramLink(...)
                 // For demo, simulate success after delay
                setTimeout(() => {
                    console.log(`Marking task ${taskId} as complete.`);
                    try { tg.HapticFeedback.notificationOccurred('success'); } catch(e) {}

                    userData.tasks[taskIndex].completed = true;
                    userData.points += TASK_REWARD;

                    updatePointsDisplay();
                    saveData();
                    renderTasks(); // Update UI

                    try {
                        tg.showPopup({
                            title: 'Task Complete!',
                            message: `You earned ${TASK_REWARD.toLocaleString()} points.`,
                            buttons: [{ type: 'ok' }]
                        });
                    } catch (e) { alert(`Task Complete! +${TASK_REWARD} points.`); }

                }, 500);
            }
        }

        // --- Withdraw Logic --- (Using refined versions)
         function updateWithdrawMethodDetails() {
             const selectedMethod = withdrawMethodSelect.value;
             detailFields.forEach(field => {
                 field.style.display = field.classList.contains(`${selectedMethod}-field`) ? 'block' : 'none';
             });
         }

         function updateWithdrawButtonState() {
             // Ensure elements exist before trying to access properties
             if (!withdrawAmountInput || !submitWithdrawalButton) return;

             const amount = parseFloat(withdrawAmountInput.value) || 0;
             const currentPoints = Math.floor(userData.points);
             const minWithdrawal = 1;

             let requiredDetailsFilled = true;
             const selectedMethod = withdrawMethodSelect.value;
             if (selectedMethod === 'paypal' && (!paypalEmailInput || !paypalEmailInput.value)) requiredDetailsFilled = false;
             else if (selectedMethod === 'wire' && (!bankAccountInput || !bankAccountInput.value || !bankRoutingInput || !bankRoutingInput.value)) requiredDetailsFilled = false;
             else if (selectedMethod === 'crypto' && (!cryptoAddressInput || !cryptoAddressInput.value)) requiredDetailsFilled = false;

             submitWithdrawalButton.disabled = !(amount >= minWithdrawal && amount <= currentPoints && requiredDetailsFilled);
         }

        function handleWithdraw() {
            // Ensure elements exist
             if (!withdrawAmountInput || !withdrawMethodSelect || !submitWithdrawalButton || !withdrawMessage || !paypalEmailInput || !bankAccountInput || !bankRoutingInput || !cryptoAddressInput) {
                 console.error("Withdrawal form elements not found!");
                 return;
             }

            const amount = parseFloat(withdrawAmountInput.value);
            const method = withdrawMethodSelect.value;

            withdrawMessage.style.display = 'none';
            withdrawMessage.textContent = '';
            withdrawMessage.className = 'withdraw-message';

            if (isNaN(amount) || amount <= 0) {
                showWithdrawMessage('Please enter a valid positive amount.', 'error'); return;
            }
             const minWithdrawal = 1;
             if (amount < minWithdrawal) {
                 showWithdrawMessage(`Minimum withdrawal amount is ${minWithdrawal} points.`, 'error'); return;
             }
            if (amount > userData.points) {
                showWithdrawMessage('Insufficient points.', 'error'); return;
            }

            let detailsValid = true;
            let detailsPayload = { amount, method };
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (method === 'paypal') {
                 const email = paypalEmailInput.value.trim();
                 if (!email || !emailRegex.test(email)) { detailsValid = false; paypalEmailInput.focus(); }
                 detailsPayload.email = email;
             } else if (method === 'wire') {
                 const accNum = bankAccountInput.value.trim();
                 const routNum = bankRoutingInput.value.trim();
                  if (!accNum) { detailsValid = false; bankAccountInput.focus(); }
                  else if (!routNum) { detailsValid = false; bankRoutingInput.focus(); }
                 detailsPayload.account = accNum;
                 detailsPayload.routing = routNum;
             } else if (method === 'crypto') {
                 const address = cryptoAddressInput.value.trim();
                  // Basic TRC20 check example
                 if (!address || address.length < 26 || address.length > 42 || !address.startsWith('T')) {
                    detailsValid = false; cryptoAddressInput.focus();
                 }
                 detailsPayload.address = address;
             }

             if (!detailsValid) {
                 showWithdrawMessage('Please fill required details correctly.', 'error');
                 return;
             }

            submitWithdrawalButton.disabled = true;
            submitWithdrawalButton.textContent = 'Processing...';
            console.log("Withdrawal Request Payload:", detailsPayload);
            console.log("User:", JSON.stringify(userData.telegramUser || {id: 'guest'}));

            setTimeout(() => {
                userData.points -= amount;
                updatePointsDisplay();
                saveData();
                showWithdrawMessage(`Withdrawal for ${amount.toLocaleString()} points via ${method} submitted (Simulation).`, 'success');
                 try { tg.HapticFeedback.notificationOccurred('success'); } catch(e) {}

                withdrawAmountInput.value = '';
                 paypalEmailInput.value = '';
                 bankAccountInput.value = '';
                 bankRoutingInput.value = '';
                 cryptoAddressInput.value = '';

                 submitWithdrawalButton.textContent = 'Request Withdrawal';
                 updateWithdrawButtonState();

            }, 1500);
        }

        function showWithdrawMessage(message, type = 'info') {
             withdrawMessage.textContent = message;
             withdrawMessage.className = `withdraw-message ${type}`;
             withdrawMessage.style.display = 'block';
             if (type === 'error') {
                try { tg.HapticFeedback.notificationOccurred('error'); } catch(e) {}
             }
         }


        // --- Event Listeners Setup ---
        function setupEventListeners() {
            // Navigation
            navButtons.forEach(button => {
                button.addEventListener('click', () => showPage(button.dataset.page));
            });

            // Tapping (Pointer events preferred)
            let isDragging = false;
            let startY = 0;
            catButton.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'touch') e.preventDefault();
                catButton.setPointerCapture(e.pointerId);
                isDragging = false;
                startY = e.clientY;
            }, { passive: false });

            catButton.addEventListener('pointermove', (e) => {
                 if (Math.abs(e.clientY - startY) > 10) isDragging = true;
             });

            catButton.addEventListener('pointerup', (e) => {
                 catButton.releasePointerCapture(e.pointerId);
                 if (!isDragging) handleTap(e);
                 isDragging = false;
             });

            // Fallback click for non-pointer browsers (rare)
            catButton.addEventListener('click', (e) => {
                 if (typeof window.PointerEvent === 'undefined') handleTap(e);
            });

            // Withdrawal Form Listeners (Check if elements exist)
             if (withdrawMethodSelect) {
                 withdrawMethodSelect.addEventListener('change', () => {
                     updateWithdrawMethodDetails();
                     updateWithdrawButtonState();
                 });
             }
             // Add listeners to all relevant inputs
             const withdrawalInputs = [withdrawAmountInput, paypalEmailInput, bankAccountInput, bankRoutingInput, cryptoAddressInput];
             withdrawalInputs.forEach(input => {
                 if (input) { // Check if element exists before adding listener
                    input.addEventListener('input', updateWithdrawButtonState);
                 } else {
                    // console.warn(`Withdrawal input element not found during listener setup.`);
                 }
             });
             if (submitWithdrawalButton) {
                submitWithdrawalButton.addEventListener('click', handleWithdraw);
             } else {
                console.error("Submit withdrawal button not found!");
             }
        }

        // --- Start the App ---
        document.addEventListener('DOMContentLoaded', initApp);

    </script>
</body>
</html>
