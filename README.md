# Inventory Backend

> Lightweight REST API for managing inventory data through Google Sheets.

**Inventory Backend** is a small Node.js backend service built with Express.js. It acts as an API layer between an inventory frontend and a Google Apps Script endpoint connected to Google Sheets.

The backend currently provides APIs for:

* Health checking
* Updating inventory rows
* Deleting inventory rows
* CORS configuration
* Request validation
* Communication with Google Apps Script

---

## ✨ Features

* 🚀 Lightweight Express.js REST API
* 📦 Inventory row management
* ✏️ Update inventory data
* 🗑️ Delete inventory rows
* 📊 Google Sheets integration
* 🔗 Google Apps Script integration
* 🌐 CORS support
* 🔐 Environment-based configuration
* ⚡ Axios-based external API communication
* 🩺 Health check endpoint
* 📦 ES Modules support

---

# 🏗️ Architecture

The backend follows a simple API-to-service architecture:

```text
┌──────────────────────────┐
│      Inventory Frontend  │
└────────────┬─────────────┘
             │
             │ HTTP Request
             ▼
┌──────────────────────────┐
│     Express.js API       │
│                          │
│  /health                 │
│  /inventory/update       │
│  /inventory/delete       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       sheets.js          │
│                          │
│  updateRow()             │
│  deleteRow()             │
└────────────┬─────────────┘
             │
             │ Axios
             ▼
┌──────────────────────────┐
│     Google Apps Script   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Google Sheets       │
│                          │
│     Inventory Data       │
└──────────────────────────┘
```

The backend does not directly connect to a traditional database. Instead, inventory data is managed through a Google Apps Script endpoint.

---

# 🛠️ Tech Stack

| Technology         | Purpose                            |
| ------------------ | ---------------------------------- |
| Node.js            | JavaScript runtime                 |
| Express.js         | REST API framework                 |
| Axios              | HTTP client                        |
| CORS               | Cross-origin request handling      |
| dotenv             | Environment variable management    |
| Google Apps Script | External inventory data processing |
| Google Sheets      | Inventory data storage             |

---

# 📁 Project Structure

```text
inventory-backend/
│
├── src/
│   ├── index.js
│   └── sheets.js
│
├── .gitattributes
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 📂 Source Structure

## `src/index.js`

Main application entry point.

Responsibilities:

* Initialize Express
* Load environment variables
* Configure JSON parsing
* Configure CORS
* Register API routes
* Validate incoming requests
* Handle API errors
* Start the HTTP server

---

## `src/sheets.js`

Google Sheets integration layer.

Responsibilities:

* Communicate with Google Apps Script
* Update inventory rows
* Delete inventory rows
* Handle external API errors
* Configure request timeout

The module exposes:

```javascript
updateRow(rowIndex, data)
```

and:

```javascript
deleteRow(rowIndex)
```

---

# ⚙️ Requirements

Before running the project, make sure you have installed:

* Node.js 18+
* npm
* A Google Apps Script endpoint
* A Google Sheet used as the inventory data source

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/Vinh021203/inventory-backend.git

cd inventory-backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```text
.env
```

Example:

```env
PORT=4000

CORS_ORIGIN=http://localhost:3000

APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Environment Variables

| Variable          | Description                 | Example                         |
| ----------------- | --------------------------- | ------------------------------- |
| `PORT`            | Backend HTTP port           | `4000`                          |
| `CORS_ORIGIN`     | Allowed frontend origin     | `http://localhost:3000`         |
| `APPS_SCRIPT_URL` | Google Apps Script endpoint | `https://script.google.com/...` |

If `PORT` is not provided, the application defaults to:

```text
4000
```

---

# 💻 Running the Application

Start the backend with:

```bash
npm start
```

The server will start on:

```text
http://localhost:4000
```

You should see:

```text
Inventory backend running on port 4000
```

---

# 📡 API Reference

## Health Check

Check whether the backend is running.

### Request

```http
GET /health
```

### Example

```bash
curl http://localhost:4000/health
```

### Response

```json
{
  "ok": true
}
```

---

# ✏️ Update Inventory

Update a specific inventory row.

### Request

```http
POST /inventory/update
```

### Headers

```http
Content-Type: application/json
```

### Body

```json
{
  "rowIndex": 2,
  "data": {
    "name": "Product A",
    "quantity": 100,
    "price": 25000
  }
}
```

### Example

```bash
curl -X POST http://localhost:4000/inventory/update \
  -H "Content-Type: application/json" \
  -d '{
    "rowIndex": 2,
    "data": {
      "name": "Product A",
      "quantity": 100,
      "price": 25000
    }
  }'
```

### Successful Response

```json
{
  "success": true,
  "result": {}
}
```

The exact `result` content depends on the response returned by the configured Google Apps Script.

---

# 🗑️ Delete Inventory Row

Delete an inventory row based on its row index.

### Request

```http
DELETE /inventory/delete?rowIndex=2
```

### Example

```bash
curl -X DELETE \
  "http://localhost:4000/inventory/delete?rowIndex=2"
```

### Successful Response

```json
{
  "success": true,
  "result": {}
}
```

---

# ❌ Error Handling

The API returns JSON responses for validation and server errors.

## Invalid Update Payload

If `rowIndex` or `data` is missing:

```json
{
  "success": false,
  "error": "Invalid payload"
}
```

HTTP status:

```text
400 Bad Request
```

---

## Missing Row Index

For the delete endpoint:

```json
{
  "success": false,
  "error": "Missing rowIndex"
}
```

HTTP status:

```text
400 Bad Request
```

---

## Internal Server Error

If Google Apps Script or another internal operation fails:

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP status:

```text
500 Internal Server Error
```

---

# 🔄 Data Flow

## Update Flow

```text
Frontend
   │
   │ POST /inventory/update
   ▼
Express API
   │
   │ Validate payload
   ▼
updateRow()
   │
   │ Axios POST
   ▼
Google Apps Script
   │
   ▼
Google Sheets
   │
   ▼
Response
   │
   ▼
Express API
   │
   ▼
Frontend
```

---

## Delete Flow

```text
Frontend
   │
   │ DELETE /inventory/delete
   ▼
Express API
   │
   │ Validate rowIndex
   ▼
deleteRow()
   │
   │ Axios POST
   ▼
Google Apps Script
   │
   ▼
Google Sheets
   │
   ▼
Response
   │
   ▼
Express API
   │
   ▼
Frontend
```

---

# 🔗 Google Apps Script Integration

The backend communicates with Google Apps Script through:

```env
APPS_SCRIPT_URL=your_google_apps_script_endpoint
```

The integration is implemented in:

```text
src/sheets.js
```

### Update request

The backend sends:

```json
{
  "rowIndex": 2,
  "data": {
    "name": "Product A",
    "quantity": 100
  }
}
```

to the Apps Script endpoint.

### Delete request

The backend sends:

```json
{
  "method": "delete",
  "rowIndex": 2
}
```

to the Apps Script endpoint.

The backend expects the Apps Script response to contain:

```json
{
  "success": true
}
```

If the response does not contain `success: true`, the backend treats the operation as failed.

---

# 🌐 CORS

CORS is configured using the `CORS_ORIGIN` environment variable.

Example:

```env
CORS_ORIGIN=http://localhost:3000
```

The server currently allows:

```text
GET
POST
DELETE
OPTIONS
```

and accepts:

```text
Content-Type
```

as an allowed request header.

---

# ⏱️ Request Timeout

Requests from the backend to Google Apps Script use a timeout of:

```text
15 seconds
```

This prevents the Node.js server from waiting indefinitely for an external response.

---

# 🔐 Environment & Security

Sensitive configuration should be stored in environment variables.

Do not commit:

```text
.env
.env.local
```

to GitHub.

Important variables include:

```text
APPS_SCRIPT_URL
CORS_ORIGIN
PORT
```

In production, make sure the Google Apps Script endpoint is properly protected according to your application's security requirements.

---

# 🧪 Testing API Locally

You can test the health endpoint:

```bash
curl http://localhost:4000/health
```

Test an inventory update:

```bash
curl -X POST http://localhost:4000/inventory/update \
  -H "Content-Type: application/json" \
  -d '{
    "rowIndex": 2,
    "data": {
      "name": "Test Product",
      "quantity": 50
    }
  }'
```

Test inventory deletion:

```bash
curl -X DELETE \
  "http://localhost:4000/inventory/delete?rowIndex=2"
```

---

# 📋 API Summary

| Method   | Endpoint            | Description             |
| -------- | ------------------- | ----------------------- |
| `GET`    | `/health`           | Check API status        |
| `POST`   | `/inventory/update` | Update an inventory row |
| `DELETE` | `/inventory/delete` | Delete an inventory row |

---

# 📦 NPM Scripts

The project currently provides:

| Command     | Description                         |
| ----------- | ----------------------------------- |
| `npm start` | Start the production/server process |

The command maps to:

```bash
node src/index.js
```

---

# 🧩 Dependencies

The project currently uses:

```text
express
cors
dotenv
axios
```

### Express

Used to build the HTTP API server.

### CORS

Used to control which frontend origins can communicate with the API.

### dotenv

Loads environment variables from `.env`.

### Axios

Used to communicate with the Google Apps Script endpoint.

---

# 🎯 Use Case

This backend is designed for lightweight inventory applications where Google Sheets acts as the data layer.

A typical setup can be:

```text
┌─────────────────────┐
│   Web Application   │
│                     │
│ Inventory Dashboard │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│   Inventory Backend │
│                     │
│ Node.js + Express   │
└──────────┬──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│   Google Apps Script│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Google Sheets    │
│                     │
│ Inventory Database  │
└─────────────────────┘
```

This approach is useful for small internal tools, prototypes and lightweight inventory management systems where a full database infrastructure is unnecessary.

---

# 🚀 Deployment

The backend can be deployed to any Node.js-compatible hosting platform.

Typical deployment process:

```bash
npm install

npm start
```

Before starting the application, configure:

```env
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.com
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

# 🌍 Project

## Repository

[GitHub — Vinh021203/inventory-backend](https://github.com/Vinh021203/inventory-backend)

## Author

**VinhWorks / Vinh**

[Portfolio](https://vinhwork.io.vn)

---

# 📈 Future Improvements

Potential improvements for future versions include:

* [ ] Add `GET /inventory` endpoint
* [ ] Add inventory search and filtering
* [ ] Add pagination
* [ ] Add request schema validation
* [ ] Add authentication
* [ ] Add API rate limiting
* [ ] Improve error classification
* [ ] Add structured logging
* [ ] Add automated tests
* [ ] Add API documentation with OpenAPI
* [ ] Add Docker support
* [ ] Add CI/CD pipeline
* [ ] Add stronger Google Apps Script authentication

---

# 🤝 Contributing

Contributions and suggestions are welcome.

### Development workflow

```bash
git checkout -b feature/your-feature

npm install

npm start
```

After making changes:

```bash
git add .

git commit -m "feat: describe your change"

git push origin feature/your-feature
```

Then create a Pull Request on GitHub.

---

# 📝 Commit Convention

Recommended commit prefixes:

```text
feat:      New feature
fix:       Bug fix
refactor:  Code refactoring
docs:      Documentation
chore:     Maintenance
perf:      Performance improvement
test:      Tests
```

Examples:

```bash
git commit -m "feat: add inventory listing endpoint"

git commit -m "fix: handle invalid row index"

git commit -m "refactor: improve sheets service"

git commit -m "docs: update API documentation"
```

---

# 📄 License

This project is maintained by **VinhWorks**.

See the repository for the current licensing information.

---

## ⭐ Support

If this project is useful to you, consider giving the repository a ⭐ on GitHub.

**Inventory Backend**

[View Repository](https://github.com/Vinh021203/inventory-backend)

[Visit VinhWorks](https://vinhwork.io.vn)
