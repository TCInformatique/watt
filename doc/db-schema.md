# Schéma de base de données — Compteur Connecté

## Diagramme entité-relation

```mermaid
erDiagram
    User ||--|| Contact : "contact"
    User ||--o{ Session : "sessions"
    Contact ||--o{ Member : "members"
    Contact ||--o{ Log : "logs"
    Contact ||--o{ Contract : "contracts"
    Contact ||--o{ BillingPoint : "billingPoints"
    Contact ||--o{ Invoice : "invoices"
    Org ||--o{ Member : "members"
    Org ||--o{ Log : "logs"
    Org ||--o{ Session : "sessions"
    Org ||--o{ Site : "sites"
    Org ||--o{ Meter : "meters"
    Org ||--o{ Tariff : "tariffs"
    Org ||--o{ Contract : "contracts"
    Org ||--o{ BillingPoint : "billingPoints"
    Org ||--o{ Invoice : "invoices"
    Member ||--o{ Log : "logsRelated"
    Member ||--o{ Log : "logsCreated"
    Site ||--o{ Location : "locations"
    Site ||--o{ Meter : "meters"
    Site ||--o{ Contract : "contracts"
    Location ||--o{ Meter : "meters"
    Location ||--o{ BillingPoint : "billingPoints"
    Meter ||--o{ Consumption : "consumptions"
    Meter ||--o{ BillingPoint : "billingPoints"
    Tariff ||--o{ TariffTier : "tiers"
    Tariff ||--o{ Contract : "contracts"
    Contract ||--o{ BillingPoint : "billingPoints"
    Contract ||--o{ Invoice : "invoices"
    BillingPoint ||--o{ Invoice : "invoices"
    Invoice ||--o{ InvoiceLine : "lines"
    Invoice ||--o{ InvoicePayment : "payments"

    User {
        int id PK
        string email UK
        string passwordHash
        UserRole role
        datetime createdAt
        int contactId FK
    }

    Contact {
        int id PK
        string firstName
        string lastName
        string email
        string phone
        string city
        string zipCode
        string street
        datetime birthday
        string birthdayAsString
        ContactGender gender
        boolean isInvitation
        datetime createdAt
        datetime updatedAt
    }

    Member {
        int id PK
        int contactId FK
        int orgId FK
        MemberRole role
        datetime createdAt
        datetime updatedAt
    }

    Org {
        int id PK
        string name UK
        datetime createdAt
        datetime updatedAt
    }

    Session {
        string id PK
        int userId FK
        int orgId FK
        datetime createdAt
        datetime expiresAt
    }

    Log {
        int id PK
        LogType type
        json data
        int orgId FK
        int contactId FK
        int memberId FK
        int createdById FK
        datetime createdAt
        datetime updatedAt
    }

    Site {
        int id PK
        int orgId FK
        string name
        string address
        string city
        string zipCode
        datetime createdAt
        datetime updatedAt
    }

    Location {
        int id PK
        int siteId FK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }

    Meter {
        int id PK
        int orgId FK
        int siteId FK
        int locationId FK
        string serialNumber UK
        string model
        string simNumber
        MeterStatus status
        MeterType type
        datetime createdAt
        datetime updatedAt
    }

    Consumption {
        int id PK
        int meterId FK
        datetime timestamp
        decimal indexValue
        decimal instantPower
        decimal voltage
        decimal current
        string alertStatus
        datetime createdAt
    }

    Tariff {
        int id PK
        int orgId FK
        string name
        TariffType type
        decimal baseAmount
        decimal annualPlatformFee
        decimal unitPrice
        string currency
        datetime activeFrom
        datetime activeUntil
        datetime createdAt
        datetime updatedAt
    }

    TariffTier {
        int id PK
        int tariffId FK
        decimal minConsumption
        decimal maxConsumption
        decimal unitPrice
        datetime createdAt
    }

    Contract {
        int id PK
        int orgId FK
        int clientContactId FK
        int tariffId FK
        int siteId FK
        datetime startDate
        datetime endDate
        ContractStatus status
        datetime createdAt
        datetime updatedAt
    }

    BillingPoint {
        int id PK
        int orgId FK
        int contactId FK
        int locationId FK
        int meterId FK
        int contractId FK
        string label
        datetime createdAt
        datetime updatedAt
    }

    Invoice {
        int id PK
        int orgId FK
        int billingPointId FK
        int contactId FK
        int contractId FK
        datetime periodStart
        datetime periodEnd
        decimal totalAmount
        InvoiceStatus status
        string pdfUrl
        datetime createdAt
        datetime updatedAt
    }

    InvoiceLine {
        int id PK
        int invoiceId FK
        string description
        decimal quantity
        decimal unitPrice
        decimal total
        datetime createdAt
    }

    InvoicePayment {
        int id PK
        int invoiceId FK
        decimal amount
        string method
        PaymentStatus status
        datetime paidAt
        string transactionRef
        datetime createdAt
    }
```

## Légende des relations

| Notation | Signification |
|----------|---------------|
| `\|\|--\|\|` | Un et un seul (1:1) |
| `\|\|--o\{` | Un ou plusieurs (1:N) |
| `\}\|--o\|` | Zéro ou un (0..1:1) |
| `\}\|--o\{` | Zéro ou plusieurs (0..N) |

## Domaines

- **Auth** : `User`, `Session`
- **Organisation** : `Org`, `Member`, `Contact`
- **Audit** : `Log`
- **Parc** : `Site`, `Location`, `Meter`, `Consumption`
- **Facturation** : `Tariff`, `TariffTier`, `Contract`, `BillingPoint`, `Invoice`, `InvoiceLine`, `InvoicePayment`
