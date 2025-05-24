## College Placement Policy System

This project implements a configurable college placement policy system using Go.

### Prerequisites

- Go (version 1.22 or higher recommended)

### Setup

1.  Clone the repository (or ensure all files are in your project directory).
2.  Open your terminal in the project root directory.
3.  Initialize Go modules (if not already done):
    ```bash
    go mod init go-placement-policy
    ```
4.  Tidy dependencies:
    ```bash
    go mod tidy
    ```

### Running the Application

1.  Navigate to the `cmd/api` directory:
    ```bash
    cd cmd/api
    ```
2.  Run the main application:
    ```bash
    go run main.go
    ```

The server will start on port `8080`.

### Testing with `curl`

**1. Configure Policies (POST /policies/configure)**

Set the initial policies.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "maximumCompanies": {
        "enabled": true,
        "maxN": 3
    },
    "dreamOffer": {
        "enabled": true
    },
    "dreamCompany": {
        "enabled": true
    },
    "cgpaThreshold": {
        "enabled": true,
        "minimumCGPA": 7.0,
        "highSalaryThreshold": 2000000
    },
    "placementPercentage": {
        "enabled": true,
        "targetPercentage": 90.0
    },
    "offerCategory": {
        "enabled": true,
        "l1ThresholdAmount": 4000000,
        "l2ThresholdAmount": 2000000,
        "requiredHikePercentage": 20.0
    }
}' http://localhost:8080/policies/configure
```

You should get a `200 OK` response with `{"message": "Policy configuration updated successfully"}`.

**2. Get Current Policies (GET /policies)**

Check the active policies.

```bash
curl http://localhost:8080/policies
```

**3. Check Eligibility (POST /eligibility/check)**

Test with sample student and company data.

- **Scenario 1: Student S001 (placed, applied 2 companies, max allowed 3) applies to C001 (Dream company, 15L, Dream offer 15L). CGPA 7.8, High Salary Threshold 20L.**

  - Expected: Eligible (meets dream offer, within max companies, CGPA is fine for 15L not high salary).
  - `curl -X POST -H "Content-Type: application/json" -d '{"studentId": "S001", "companyId": "C001"}' http://localhost:8080/eligibility/check`

- **Scenario 2: Student S003 (L2 placed at 25L, applied to 2 companies) applies to C003 (30L). Policy requires 20% hike.**

  - Current salary: 25L. Required hike: 20% of 25L = 5L. New salary needed: 25L + 5L = 30L. Company offers 30L.
  - Expected: Eligible (meets L2 hike, assuming other policies don't block and max companies allow).
  - `curl -X POST -H "Content-Type: application/json" -d '{"studentId": "S003", "companyId": "C003"}' http://localhost:8080/eligibility/check`

- **Scenario 3: Student S002 (unplaced) applies to C001 (15L). CGPA 6.2, High Salary Threshold 20L.**

  - Expected: Eligible (unplaced, CGPA policy only for high-salary which is 20L+, C001 is 15L).
  - `curl -X POST -H "Content-Type: application/json" -d '{"studentId": "S002", "companyId": "C001"}' http://localhost:8080/eligibility/check`

- **Scenario 4: Dream Offer + CGPA Test**
  - Student: S001 (CGPA 7.8, Dream Offer 15L, Currently placed at 8L)
  - Company: C001 (Offering 15L)
  - Expected: Eligible (meets dream offer) despite low CGPA if CGPA policy threshold is ₹20L.
  - With current config: CGPA policy threshold is 20L. C001 offers 15L, so CGPA policy _doesn't apply_ as it's not a high-paying offer. S001's dream offer is 15L, which C001 meets.
  - `curl -X POST -H "Content-Type: application/json" -d '{"studentId": "S001", "companyId": "C001"}' http://localhost:8080/eligibility/check`
