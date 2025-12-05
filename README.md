🚀 AI-Powered RFP Manager
An intelligent Request for Proposal (RFP) management system that streamlines vendor communication and proposal analysis. This application allows users to create RFPs from natural language requirements, automatically score incoming proposals using AI.

🛠 Tech Stack
Frontend: React.js
Backend: Express.js, Node.js
Database: MongoDB (Atlas or Local)
AI Engine: Google Gemini (Gemini 1.5 Flash)
Email Services: Resend (Sending & Inbound Webhook)

⚙️ Project Setup
1. Installation
Clone the repository and install dependencies for both the client and server.
code

# Install Backend Dependencies
```bash
cd backend
npm install
```

# Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

2. Environment Configuration
Set up your environment variables by referring to the .env.example files in both the frontend and backend directories.
Backend (.env):
Sign up on Resend and generate an API Key.
Add your MongoDB Connection string.

3. Database Seeding (First Run Only)
The application requires initial vendor data to function correctly.
Open backend/index.js.
Uncomment the storeVendors() function call at the end of the file.
Run the backend server once to seed the database.
Important: Once the data is saved, comment out storeVendors() again to prevent duplicate data entry.
Note: You can modify the storeVendors function if you wish to alter the initial vendor data.

4. Resend Webhook Configuration
To receive proposals via email, you must configure the Resend Inbound Webhook.
Go to the Webhooks section in your Resend Dashboard.
Add a new webhook endpoint.
Set the Endpoint URL to: https://<YOUR_DEPLOYED_BACKEND_URL>/proposals
Note: Resend cannot access localhost. You must deploy your backend (e.g., via Vercel, Render, Railway) or use a tunnel service (like ngrok) to make this functionality work.

📖 API Documentation
RFP Management

Method	Endpoint	Description

GET	/api/create-rfp 
Fetch all RFPs

POST /api/create-rfp
Create a new RFP from requirements

GET	/api/create-rfp/:id
Get details of a specific RFP

Proposals

Method	Endpoint	Description

GET	 /api/proposals
Fetch all received proposals

POST /api/proposals
Webhook endpoint for inbound emails (Resend)

POST /api/proposals/placeOrder/:rfpId/:proposalId
Award contract and email vendor

Vendors

Method	Endpoint	Description
GET	/api/vendors	
List all available vendors

🧠 Decisions & Assumptions

AI Analysis (Google Gemini)

Model: We utilize Gemini 2.5 Flash for its speed and efficiency.

RFP Generation: The model converts natural language requirements into structured RFP data.
Proposal Extraction: We use detailed systemInstructions to force the LLM to return strictly formatted JSON objects from vendor emails. This ensures the data is ready for database operations immediately.

Scoring Algorithm

The system automatically assigns a score to every proposal to aid decision-making. The score is calculated based on:

Cost: Lower cost relative to budget increases the score.

Delivery Date: Faster delivery times are preferred.

Payment Terms: Favorable credit terms (longer days to pay) contribute to a higher score.

Error Handling & Resend Loop

Assumption: Vendors may format emails incorrectly.

Solution: If the AI cannot extract the necessary proposal details from an incoming email (resulting in an empty object), the system automatically triggers a reply email asking the vendor to resend the details with the correct information.

🤖 AI Tools Usage

This project leveraged several AI tools to accelerate development and ensure high-quality output:

Code & Debugging: Google AI Studio and Claude were used to generate boilerplate code, debug complex logic.

UI Design: AI tools assisted in creating a pixel-perfect, responsive UI.

Integration Help: Specifically used Google Gemini to understand how to implement Inbound Email parsing with Resend documentation.